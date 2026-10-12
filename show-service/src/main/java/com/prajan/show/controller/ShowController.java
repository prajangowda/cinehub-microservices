package com.prajan.show.controller;

import com.prajan.common.dto.ShowBookingResponse;
import com.prajan.common.dto.ShowExistsResponse;
import com.prajan.common.dto.ShowSeatStatus;
import com.prajan.show.dto.CreateShowRequest;
import com.prajan.show.dto.ShowResponse;
import com.prajan.show.dto.ShowSeatResponse;
import com.prajan.show.dto.UpdateShowRequest;
import com.prajan.show.service.ShowSeatService;
import com.prajan.show.service.ShowService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class ShowController {

    private final ShowService showService;
    private final ShowSeatService showSeatService;

    @PostMapping("/shows")
    public ResponseEntity<ShowResponse> createShow(
            @RequestBody CreateShowRequest request) {

        log.info("Creating show with request: {}", request);

        ShowResponse response =
                showService.createShow(request);

        log.info("Show created successfully: {}", response);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/shows/{showId}")
    public ResponseEntity<ShowResponse> getShow(
            @PathVariable Long showId) {

        log.info("Fetching show with ID: {}", showId);
        ShowResponse response = showService.getShowById(showId);
        log.info("Show fetched successfully: {}", response);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/shows/{showId}")
    public ResponseEntity<ShowResponse> updateShow(
            @PathVariable Long showId,
            @RequestBody UpdateShowRequest request) {

        log.info("Updating show with ID: {}", showId);
        ShowResponse response = showService.updateShow(showId, request);
        log.info("Show updated successfully: {}", response);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/shows/{showId}/cancel")
    public ResponseEntity<Void> cancelShow(
            @PathVariable Long showId) {

        log.info("Cancelling show with ID: {}", showId);
        showService.cancelShow(showId);
        log.info("Show cancelled successfully: {}", showId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/public/shows/movies/{movieId}")
    public ResponseEntity<?> getShowsByMovie(
            @PathVariable Long movieId) {
        log.info("getting shows for modie id");

        return ResponseEntity.ok(
                showService.getAvailableShowsByMovie(movieId)
        );
    }

    @GetMapping("/shows/{showId}/seats")
    public List<ShowSeatResponse> getShowSeats(
            @PathVariable Long showId
    ) {
        log.info("Fetching seats for show with ID: {}", showId);
        List<ShowSeatResponse> response = showSeatService.getSeatsByShow(showId);
        log.info("Seats fetched successfully: {}", response);
        return response;
    }

    @PutMapping("/{showId}/seats/book")
    public ResponseEntity<Void> bookSeats(
            @PathVariable Long showId,
            @RequestBody List<Long> seatIds
    ) {

        log.info("Booking seats for show with ID: {} and seat IDs: {}", showId, seatIds);
        showSeatService.bookSeats(
                showId,
                seatIds
        );

        return ResponseEntity.ok().build();
    }
}