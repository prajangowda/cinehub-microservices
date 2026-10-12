package com.prajan.booking.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final RedisTemplate<String, Object> redisTemplate;

    public void deleteReservation(
            String reservationToken,
            Long showId,
            List<Long> seatIds
    ) {

        // Delete reservation
        redisTemplate.delete(
                "cinehub:reservation:" + reservationToken
        );

        // Delete individual seat locks
        for (Long seatId : seatIds) {

            redisTemplate.delete(
                    "cinehub:seat-lock:show:"
                            + showId
                            + ":seat:"
                            + seatId
            );
        }
    }
}
