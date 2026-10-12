package com.prajan.booking.event;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.prajan.booking.service.BookingResponseHandler;
import com.prajan.common.event.PaymentFailedEvent;
import com.prajan.common.event.PaymentSucceededEvent;
import com.prajan.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentEventConsumer {

    private final ObjectMapper objectMapper;

    private final BookingResponseHandler bookingResponseHandler;


    @KafkaListener(
            topics = "payment-succeeded",
            groupId = "booking-service"
    )
    public void handlePaymentSucceeded(
            String message
    ) {

        try {

            PaymentSucceededEvent event =
                    objectMapper.readValue(
                            message,
                            PaymentSucceededEvent.class
                    );

            log.info(
                    "Received PaymentSucceededEvent. bookingId={}",
                    event.bookingId()
            );

            bookingResponseHandler.confirmBookingAfterPayment(
                    event
            );

        } catch (Exception e) {

            log.error(
                    "Error processing PaymentSucceededEvent",
                    e
            );

            throw new RuntimeException(e);
        }
    }


    @KafkaListener(
            topics = "payment-failed",
            groupId = "booking-service"
    )
    public void handlePaymentFailed(
            String message
    ) {

        try {

            PaymentFailedEvent event =
                    objectMapper.readValue(
                            message,
                            PaymentFailedEvent.class
                    );

            log.info(
                    "Received PaymentFailedEvent. bookingId={}",
                    event.bookingId()
            );

            bookingResponseHandler.handlePaymentFailure(
                    event
            );

        } catch (Exception e) {

            log.error(
                    "Error processing PaymentFailedEvent",
                    e
            );

            throw new RuntimeException(e);
        }
    }
}
