package com.prajan.booking.dto;

import java.math.BigDecimal;

public record ReservationResponse(

        Long bookingId,

        BigDecimal totalAmount,

        long expiresInSeconds
) {
}