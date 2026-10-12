package com.prajan.common.event;

public record PaymentFailedEvent(
        Long bookingId,
        Long userId,
        Long paymentId,
        String reason
) {
}
