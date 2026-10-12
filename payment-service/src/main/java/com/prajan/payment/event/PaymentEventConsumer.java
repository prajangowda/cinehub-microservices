package com.prajan.payment.event;


import com.prajan.common.event.PaymentRequestedEvent;
import com.prajan.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentEventConsumer {

    private final PaymentService paymentService;

    @KafkaListener(
            topics = "payment-requested",
            groupId = "payment-service"
    )
    public void consume(PaymentRequestedEvent event) throws Exception {

        log.info(
                "Payment request received for booking {}",
                event.bookingId()
        );

        paymentService.createOrder(event);
    }
}
