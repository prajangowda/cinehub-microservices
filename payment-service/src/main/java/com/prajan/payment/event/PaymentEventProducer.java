package com.prajan.payment.event;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.prajan.common.event.PaymentFailedEvent;
import com.prajan.common.event.PaymentSucceededEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final ObjectMapper objectMapper;

    private static final String PAYMENT_SUCCEEDED_TOPIC =
            "payment-succeeded";

    private static final String PAYMENT_FAILED_TOPIC =
            "payment-failed";


    public void publishPaymentSucceeded(
            PaymentSucceededEvent event
    ) {

        try {

            String message =
                    objectMapper.writeValueAsString(event);

            kafkaTemplate.send(
                    PAYMENT_SUCCEEDED_TOPIC,
                    String.valueOf(event.bookingId()),
                    message
            );

            log.info(
                    "Payment succeeded event published. bookingId={}",
                    event.bookingId()
            );

        } catch (JsonProcessingException e) {

            log.error(
                    "Failed to serialize PaymentSucceededEvent",
                    e
            );

            throw new RuntimeException(e);
        }
    }


    public void publishPaymentFailed(
            PaymentFailedEvent event
    ) {

        try {

            String message =
                    objectMapper.writeValueAsString(event);

            kafkaTemplate.send(
                    PAYMENT_FAILED_TOPIC,
                    String.valueOf(event.bookingId()),
                    message
            );

            log.info(
                    "Payment failed event published. bookingId={}",
                    event.bookingId()
            );

        } catch (JsonProcessingException e) {

            log.error(
                    "Failed to serialize PaymentFailedEvent",
                    e
            );

            throw new RuntimeException(e);
        }
    }
}
