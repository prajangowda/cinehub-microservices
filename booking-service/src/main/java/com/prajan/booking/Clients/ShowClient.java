package com.prajan.booking.Clients;

import com.prajan.common.dto.ShowBookingResponse;
import com.prajan.common.dto.ShowExistsResponse;
import com.prajan.common.dto.ShowSeatStatus;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "SHOW-SERVICE")
public interface ShowClient {

    @GetMapping("/api/v1/internal/shows/{showId}/exists")
    public ShowExistsResponse checkShowExists( @PathVariable Long showId);

    @PostMapping("/api/v1/internal/shows/{showId}/seats")
    List<ShowSeatStatus> getShowSeats(@PathVariable Long showId , @RequestBody List<Long> showSeatIds);

    @GetMapping("/api/v1/internal/shows/{showId}/booking-details")
    public ShowBookingResponse getShowBookingDetails( @PathVariable Long showId);

    @PostMapping("/api/v1/internal/shows/booking-details")
    List<ShowBookingResponse> getShowBookingDetails(
            @RequestBody List<Long> showIds
    );

    @PutMapping("/api/v1/shows/{showId}/seats/book")
    void bookSeats(
            @PathVariable Long showId,
            @RequestBody List<Long> showIds
    );
}
