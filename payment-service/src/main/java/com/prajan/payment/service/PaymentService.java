package com.prajan.payment.service;


import com.prajan.common.enums.BookingStatus;
import com.prajan.common.event.PaymentFailedEvent;
import com.prajan.common.event.PaymentRequestedEvent;
import com.prajan.common.event.PaymentSucceededEvent;
import com.prajan.payment.dto.PaymentVerificationRequest;
import com.prajan.payment.entity.Payment;

import com.prajan.payment.event.PaymentEventProducer;
import com.prajan.payment.repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    private final PaymentRepository paymentRepository;

    private final PaymentEventProducer paymentEventProducer;

    public Map<String, Object> createOrder(
            PaymentRequestedEvent event
    ) throws Exception {


        // 1. Basic validation

        if (event.bookingId() == null) {
            throw new IllegalArgumentException(
                    "Booking ID cannot be null"
            );
        }

        if (event.userId() == null) {
            throw new IllegalArgumentException(
                    "User ID cannot be null"
            );
        }

        if (event.amount() == null ||
                event.amount().compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "Invalid payment amount"
            );
        }



        // 2. Check whether payment already exists
        Optional<Payment> existingPayment =
                paymentRepository.findByBookingId(
                        event.bookingId()
                );

        if (existingPayment.isPresent()) {

            Payment payment =
                    existingPayment.get();

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "razorpayOrderId",
                    payment.getRazorpayOrderId()
            );

            response.put(
                    "amount",
                    payment.getAmount()
            );

            response.put(
                    "currency",
                    payment.getCurrency()
            );

            response.put(
                    "bookingId",
                    payment.getBookingId()
            );

            response.put(
                    "paymentStatus",
                    payment.getStatus()
            );

            return response;
        }


        // 3. Convert INR to paise

        long amountInPaise =
                event.amount()
                        .movePointRight(2)
                        .longValueExact();


        // --------------------------------------------------------
        // 4. Create Razorpay client
        // --------------------------------------------------------

        RazorpayClient razorpayClient =
                new RazorpayClient(
                        keyId,
                        keySecret
                );


        // --------------------------------------------------------
        // 5. Create Razorpay order request
        // --------------------------------------------------------

        JSONObject orderRequest =
                new JSONObject();

        orderRequest.put(
                "amount",
                amountInPaise
        );

        orderRequest.put(
                "currency",
                event.currency()
        );

        orderRequest.put(
                "receipt",
                "CINE-" + event.bookingId()
        );


        // --------------------------------------------------------
        // 6. Create Razorpay order
        // --------------------------------------------------------

        Order razorpayOrder =
                razorpayClient.orders.create(
                        orderRequest
                );


        String razorpayOrderId =
                razorpayOrder.get("id");


        // --------------------------------------------------------
        // 7. Save Payment
        // --------------------------------------------------------

        Payment payment =
                Payment.builder()
                        .bookingId(
                                event.bookingId()
                        )
                        .userId(
                                event.userId()
                        )
                        .amount(
                                event.amount()
                        )
                        .currency(
                                event.currency()
                        )
                        .razorpayOrderId(
                                razorpayOrderId
                        )
                        .status(
                                BookingStatus.PAYMENT_PENDING
                        )
                        .build();

        paymentRepository.save(payment);


        // --------------------------------------------------------
        // 8. Return information required by frontend
        // --------------------------------------------------------

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "razorpayOrderId",
                razorpayOrderId
        );

        response.put(
                "amount",
                amountInPaise
        );

        response.put(
                "currency",
                event.currency()
        );

        response.put(
                "bookingId",
                event.bookingId()
        );

        response.put(
                "paymentStatus",
                payment.getStatus()
        );

        return response;
    }




     // VERIFY PAYMENT


    @Transactional
    public Map<String, Object> verifyPayment(
            PaymentVerificationRequest request
    ) throws Exception {



        // 1. Find payment

        Payment payment =
                paymentRepository
                        .findByBookingId(
                                request.getBookingId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Payment not found"
                                )
                        );



        // 2. Idempotency

        if (payment.getStatus() ==
                BookingStatus.PAID) {

            return Map.of(
                    "success",
                    true,

                    "message",
                    "Payment already verified",

                    "bookingId",
                    payment.getBookingId()
            );
        }


        // --------------------------------------------------------
        // 3. Verify Razorpay order belongs to our payment
        // --------------------------------------------------------


        if (!payment.getRazorpayOrderId()
                .equals(
                        request.getRazorpayOrderId()
                )) {

            throw new RuntimeException(
                    "Razorpay order does not belong to this booking"
            );
        }


        // --------------------------------------------------------
        // 4. Create signature verification object
        // --------------------------------------------------------

        JSONObject options =
                new JSONObject();

        options.put(
                "razorpay_order_id",
                request.getRazorpayOrderId()
        );

        options.put(
                "razorpay_payment_id",
                request.getRazorpayPaymentId()
        );

        options.put(
                "razorpay_signature",
                request.getRazorpaySignature()
        );


        // --------------------------------------------------------
        // 5. Verify Razorpay signature
        // --------------------------------------------------------

        boolean isValid =
                Utils.verifyPaymentSignature(
                        options,
                        keySecret
                );


        // --------------------------------------------------------
        // 6. Payment failed
        // --------------------------------------------------------

        if (!isValid) {

            payment.setStatus(
                    BookingStatus.PAYMENT_FAILED
            );

            paymentRepository.save(payment);


            PaymentFailedEvent event =
                    new PaymentFailedEvent(
                            payment.getBookingId(),
                            payment.getUserId(),
                            payment.getId(),
                            "PAYMENT_VERIFICATION_FAILED"
                    );

            paymentEventProducer.publishPaymentFailed(event);

            return Map.of(
                    "success",
                    false,

                    "message",
                    "Payment verification failed",

                    "bookingId",
                    payment.getBookingId()
            );
        }


        // --------------------------------------------------------
        // 7. Payment successful
        // --------------------------------------------------------

        payment.setRazorpayPaymentId(
                request.getRazorpayPaymentId()
        );

        payment.setStatus(
                BookingStatus.PAID
        );

        paymentRepository.save(payment);

        PaymentSucceededEvent event =
                new PaymentSucceededEvent(
                        payment.getBookingId(),
                        payment.getUserId(),
                        payment.getId(),
                        payment.getRazorpayPaymentId(),
                        payment.getAmount(),
                        payment.getCurrency()
                );

        paymentEventProducer.publishPaymentSucceeded(event);


        // 8. Return success

        return Map.of(
                "success",
                true,

                "message",
                "Payment verified successfully",

                "bookingId",
                payment.getBookingId(),

                "paymentId",
                payment.getId(),

                "razorpayPaymentId",
                payment.getRazorpayPaymentId()
        );
    }


    public Map<String, Object> getOrder(Long bookingId) {

        Payment payment = getPaymentByBookingId(bookingId);

        return Map.of(
                "bookingId", payment.getBookingId(),
                "razorpayOrderId", payment.getRazorpayOrderId(),
                "amount", payment.getAmount()
                        .movePointRight(2)
                        .longValueExact(),
                "currency", payment.getCurrency(),
                "paymentStatus", payment.getStatus()
        );
    }

    public Payment getPaymentByBookingId(Long bookingId) {

        for (int i = 0; i < 5; i++) {

            Optional<Payment> payment =
                    paymentRepository.findByBookingId(bookingId);

            if (payment.isPresent()) {
                return payment.get();
            }

            System.out.println(
                    "Payment not found for booking " + bookingId +
                            ", retry " + (i + 1) + "/5"
            );

            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException(
                        "Interrupted while waiting for payment", e
                );
            }
        }

        throw new RuntimeException(
                "Payment not found for booking: " + bookingId
        );
    }
}