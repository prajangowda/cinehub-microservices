package com.prajan.booking.event;

import com.prajan.common.event.PaymentRequestedEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class PaymentEventProducer {

    private final KafkaTemplate<String, PaymentRequestedEvent> kafkaTemplate;

    public PaymentEventProducer(
            KafkaTemplate<String, PaymentRequestedEvent> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void send(PaymentRequestedEvent event) {

        kafkaTemplate.send(
                "payment-requested",
                event.bookingId().toString(),
                event
        );
    }
}