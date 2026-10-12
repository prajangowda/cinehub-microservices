package com.prajan.booking.service;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.prajan.booking.Clients.ShowClient;
import com.prajan.booking.Clients.TheatreClient;
import com.prajan.booking.dto.CreateBookingRequest;
import com.prajan.booking.dto.MyBookingResponse;
import com.prajan.booking.dto.ReservationResponse;
import com.prajan.booking.entity.Booking;
import com.prajan.booking.entity.BookingSeat;
import com.prajan.booking.event.PaymentEventProducer;
import com.prajan.booking.repository.BookingRepository;
import com.prajan.booking.security.CurrentUserService;
import com.prajan.common.dto.*;
import com.prajan.common.enums.SeatStatus;
import com.prajan.common.enums.BookingStatus;
import com.prajan.common.event.PaymentRequestedEvent;
import com.prajan.common.event.PaymentSucceededEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CurrentUserService currentUserService;
    private final ShowClient showClient;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;
    private final TheatreClient theatreClient;
    private final PaymentEventProducer paymentEventProducer;

    private static final BigDecimal SEAT_PRICE =
            BigDecimal.valueOf(200);

    private static final Duration RESERVATION_DURATION =
            Duration.ofMinutes(10);



    // Reserve seats in Redis for 10 minutes
    public ReservationResponse reserveSeats(
            CreateBookingRequest request
    ) {


        ShowExistsResponse show=
                showClient.checkShowExists(request.showId());


        // 2. Get selected show seats
        List<ShowSeatStatus> showSeats =
                showClient.getShowSeats(
                        request.showId(),
                        request.showSeatIds()
                        );


        // 3. Validate all requested seats exist
        if (showSeats.size() != request.showSeatIds().size()) {
            throw new RuntimeException(
                    "One or more seats do not exist"
            );
        }


        // 4. Validate seats belong to this show
        boolean invalidShowSeat = showSeats.stream()
                .anyMatch(showSeat ->
                        !showSeat.showId()
                                .equals(show.id())
                );

        if (invalidShowSeat) {
            throw new RuntimeException(
                    "One or more seats do not belong to this show"
            );
        }


        // 5. Check  availability
        boolean seatNotAvailable = showSeats.stream()
                .anyMatch(showSeat ->
                        showSeat.status()
                                != SeatStatus.AVAILABLE
                );

        if (seatNotAvailable) {
            throw new RuntimeException(
                    "One or more seats are not available"
            );
        }


        // 6. Calculate total amount on backend
        BigDecimal totalAmount =
                SEAT_PRICE.multiply(
                        BigDecimal.valueOf(showSeats.size())
                );


        // 7. Generate unique reservation token
        String reservationToken =
                UUID.randomUUID().toString();


        // Keep track of successfully locked seats
        List<String> lockedKeys = new ArrayList<>();


        try {

            // 8. Try locking every seat in Redis
            for (ShowSeatStatus showSeat : showSeats) {

                String redisKey =
                        "cinehub:seat-lock:show:"
                                + show.id()
                                + ":seat:"
                                + showSeat.id();


                Boolean locked =
                        redisTemplate.opsForValue().setIfAbsent(
                                redisKey,
                                reservationToken,
                                RESERVATION_DURATION
                        );


                // Seat already locked by another user
                if (!Boolean.TRUE.equals(locked)) {

                    throw new RuntimeException(
                            "One or more selected seats were just reserved by another user"
                    );
                }


                lockedKeys.add(redisKey);
            }
            log.info("Seats reserved successfully with token: {}", reservationToken);


             Booking booking = new Booking();
             booking.setUserId(currentUserService.getUserId());
             booking.setShowId(show.id());
             booking.setTotalAmount(totalAmount);
             booking.setStatus(BookingStatus.PAYMENT_PENDING);
             booking.setReservationToken(reservationToken);
             booking.setBookingReference( "CH-" + UUID.randomUUID() .toString() .substring(0, 8) .toUpperCase() );

             // 11. Create BookingSeat records

            List<BookingSeat> bookingSeats = showSeats.stream()
                    .map(showSeat ->
                    { BookingSeat bookingSeat = new BookingSeat();
                bookingSeat.setShowSeatId( showSeat.id() );
                bookingSeat.setBooking(booking);
                bookingSeat.setPrice(SEAT_PRICE);
                return bookingSeat; }) .toList();

            booking.setBookingSeats(bookingSeats);

            // 12. Save booking
            Booking savedBooking = bookingRepository.save(booking);
            log.info( "Booking created with ID: {} and status PAYMENT_PENDING", savedBooking.getId() );



            PaymentRequestedEvent event =
                    new PaymentRequestedEvent(
                            savedBooking.getId(),
                            currentUserService.getUserId(),
                            show.id(),
                            showSeats.stream()
                                    .map(ShowSeatStatus::id)
                                    .toList(),
                            totalAmount,
                            "INR"
                    );

            paymentEventProducer.send(event);

            log.info("Payment requested event sent for reservation: {}", reservationToken);

            // 13. Return reservation information to frontend
            return new ReservationResponse(
                    savedBooking.getId(),
                    totalAmount,
                    RESERVATION_DURATION.getSeconds()
            );

        } catch (Exception e) {

            // IMPORTANT: Print the actual error
            e.printStackTrace();
            // Release only the locks created by THIS request
            for (String key : lockedKeys) {

                String lockToken =
                        redisTemplate.opsForValue().get(key);

                if (reservationToken.equals(lockToken)) {
                    redisTemplate.delete(key);
                }
            }

            throw new RuntimeException(
                    "Unable to reserve selected seats",
                    e
            );
        }



    }



    // MY BOOKINGS
    public List<MyBookingResponse> getMyBookings() {

        Long userId = currentUserService.getUserId();

        List<Booking> bookings =
                bookingRepository.findByUserIdOrderByBookedAtDesc(userId);

        List<Long> showIds = bookings.stream()
                .map(Booking::getShowId)
                .distinct()
                .toList();

        List<ShowBookingResponse> shows =
                showClient.getShowBookingDetails(showIds);

        List<Long> showSeatIds = bookings.stream()
                .flatMap(booking ->
                        booking.getBookingSeats().stream()
                )
                .map(BookingSeat::getShowSeatId)
                .distinct()
                .toList();

        List<MyBookkingSeatsRow> seats =
                theatreClient.getSeatsById(showSeatIds);

        Map<Long, MyBookkingSeatsRow> seatMap =
                seats.stream()
                        .collect(Collectors.toMap(
                                MyBookkingSeatsRow::getSeatId,
                                seat -> seat
                        ));

        Map<Long, ShowBookingResponse> showMap =
                shows.stream()
                        .collect(Collectors.toMap(
                                ShowBookingResponse::getShowId,
                                show -> show
                        ));


        return bookings.stream()
                .map(booking -> {

                    ShowBookingResponse show =
                            showMap.get(booking.getShowId());

                    List<String> bookingSeats =
                            booking.getBookingSeats()
                                    .stream()
                                    .map(bookingSeat -> {

                                        MyBookkingSeatsRow seat =
                                                seatMap.get(
                                                        bookingSeat.getShowSeatId()
                                                );

                                        return seat.getRowName()
                                                + seat.getSeatId();
                                    })
                                    .toList();

                    return MyBookingResponse.builder()
                            .bookingId(booking.getId())
                            .bookingReference(
                                    booking.getBookingReference()
                            )
                            .status(
                                    booking.getStatus().name()
                            )
                            .totalAmount(
                                    booking.getTotalAmount()
                            )
                            .showDate(
                                    show.getShowDate()
                            )
                            .startTime(
                                    show.getStartTime()
                            )
                            .movieTitle(
                                    show.getMovieTitle()
                            )
                            .seats(bookingSeats)
                            .build();
                })
                .toList();
    }


}