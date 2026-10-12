package com.prajan.common.event;

import java.math.BigDecimal;
import java.util.List;

public record PaymentRequestedEvent(
        Long bookingId,
        Long userId,
        Long showId,
        List<Long> seatIds,
        BigDecimal amount,
        String currency
) {
}