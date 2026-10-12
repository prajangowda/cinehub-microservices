package com.prajan.booking.controller;


import com.prajan.booking.dto.CreateBookingRequest;
import com.prajan.booking.dto.MyBookingResponse;
import com.prajan.booking.dto.ReservationResponse;
import com.prajan.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/bookings")
@RequiredArgsConstructor
@Slf4j
public class BookingController {

    private final BookingService bookingService;


    @PostMapping("/reserve")
    public ResponseEntity<ReservationResponse> reserveSeats(
            @RequestBody CreateBookingRequest request
    ) {

        log.info("Reserving seats with request: {}", request);

        ReservationResponse response =
                bookingService.reserveSeats(request);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<MyBookingResponse>> getMyBookings(

    ) {
        log.info("Fetching bookings for the authenticated user");

        List<MyBookingResponse> bookings =
                bookingService.getMyBookings();

        return ResponseEntity.ok(bookings);
    }
}