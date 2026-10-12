package com.prajan.booking.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.prajan.booking.Clients.ShowClient;
import com.prajan.booking.entity.Booking;
import com.prajan.booking.entity.BookingSeat;
import com.prajan.booking.event.PaymentEventProducer;
import com.prajan.booking.repository.BookingRepository;
import com.prajan.common.enums.BookingStatus;
import com.prajan.common.event.PaymentFailedEvent;
import com.prajan.common.event.PaymentSucceededEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingResponseHandler {

    private final BookingRepository bookingRepository;
    private final ShowClient showClient;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;
    private final PaymentEventProducer paymentEventProducer;
    private final ReservationService reservationService;

    public void confirmBookingAfterPayment(
            PaymentSucceededEvent event
    ) {

        Booking booking =
                bookingRepository.findById(
                        event.bookingId()
                ).orElseThrow(
                        () -> new RuntimeException(
                                "Booking not found: "
                                        + event.bookingId()
                        )
                );


        // Idempotency
        if (booking.getStatus() ==
                BookingStatus.CONFIRMED) {

            return;
        }

        List<Long> seatIds =
                booking.getBookingSeats()
                        .stream()
                        .map(BookingSeat::getShowSeatId)
                        .toList();

        // Ask show-service to convert RESERVED → BOOKED
        showClient.bookSeats(
                booking.getShowId(),
               seatIds
        );


        booking.setStatus(
                BookingStatus.CONFIRMED
        );

        bookingRepository.save(booking);



        reservationService.deleteReservation(
                booking.getReservationToken(),
                booking.getShowId(),
                seatIds
        );
    }

    public void handlePaymentFailure(
            PaymentFailedEvent event
    ) {

        Booking booking =
                bookingRepository.findById(event.bookingId())
                        .orElseThrow();

        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            return;
        }

        List<Long> seatIds =
                booking.getBookingSeats()
                        .stream()
                        .map(BookingSeat::getShowSeatId)
                        .toList();

        reservationService.deleteReservation(
                booking.getReservationToken(),
                booking.getShowId(),
                seatIds
        );

        booking.setStatus(
                BookingStatus.PAYMENT_FAILED
        );

        bookingRepository.save(booking);
    }
}
