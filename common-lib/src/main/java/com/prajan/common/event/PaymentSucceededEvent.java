package com.prajan.common.event;

import java.math.BigDecimal;

public record PaymentSucceededEvent(
        Long bookingId,
        Long userId,
        Long paymentId,
        String razorpayPaymentId,
        BigDecimal amount,
        String currency
) {
}
