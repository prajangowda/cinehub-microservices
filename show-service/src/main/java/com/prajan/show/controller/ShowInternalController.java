package com.prajan.show.controller;

import com.prajan.common.dto.ShowBookingResponse;
import com.prajan.common.dto.ShowExistsResponse;
import com.prajan.common.dto.ShowSeatStatus;
import com.prajan.show.service.ShowSeatService;
import com.prajan.show.service.ShowService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/internal")
@RequiredArgsConstructor
@Slf4j
public class ShowInternalController {

    private final ShowService showService;
    private final ShowSeatService showSeatService;

    @PostMapping("/shows/booking-details")
    public List<ShowBookingResponse> getShowBookingDetailsInternal(
            @RequestBody List<Long> showIds
    ) {
        log.info("Fetching booking details for shows with IDs: {}", showIds);
        List<ShowBookingResponse> response = showService.getShowBookingDetailsInternal(showIds);
        log.info("Booking details fetched successfully: {}", response);
        return response;
    }

    @GetMapping("/shows/{showId}/exists")
    public ShowExistsResponse checkShowExists(
            @PathVariable Long showId
    ) {
        log.info("Checking if show exists with ID: {}", showId);
        ShowExistsResponse response = showService.checkShowExists(showId);
        log.info("Show existence check completed: {}", response);
        return response;
    }

    @PostMapping("/shows/{showId}/seats")
    public List<ShowSeatStatus> getShowSeatsInternal(
            @PathVariable Long showId,
            @RequestBody List<Long> seatIds
    ) {
        log.info("Fetching seats for show with ID: {}", showId);
        List<ShowSeatStatus> response = showSeatService.getSeatsStatusByShow(showId,seatIds);
        log.info("Seats fetched successfully: {}", response);
        return response;
    }

    @GetMapping("/shows/{showId}/booking-details")
    public ShowBookingResponse getShowBookingDetails(
            @PathVariable Long showId
    ) {
        log.info("Fetching booking details for show with ID: {}", showId);
        return showService.getShowBookingDetails(showId);
    }
}
