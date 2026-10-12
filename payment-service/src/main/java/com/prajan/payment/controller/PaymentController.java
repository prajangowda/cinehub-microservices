package com.prajan.payment.controller;

import com.prajan.payment.dto.CreateOrderRequest;
import com.prajan.payment.dto.PaymentVerificationRequest;
import com.prajan.payment.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/payment")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

   // CREATE RAZORPAY ORDER
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(
            @RequestBody CreateOrderRequest request
    ) throws Exception {

        return ResponseEntity.ok(
                paymentService.getOrder(
                        request.bookingId()
                )
        );
    }

    // VERIFY RAZORPAY PAYMENT
    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(
            @RequestBody PaymentVerificationRequest request
    ) throws Exception {

        Map<String, Object> response =
                paymentService.verifyPayment(request);

        return ResponseEntity.ok(response);
    }
}