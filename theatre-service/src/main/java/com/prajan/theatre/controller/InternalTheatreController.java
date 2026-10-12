package com.prajan.theatre.controller;

import com.prajan.common.dto.MyBookkingSeatsRow;
import com.prajan.common.dto.ScreenIdNameResponse;
import com.prajan.common.dto.SeatResponse;
import com.prajan.theatre.service.ScreenService;
import com.prajan.theatre.service.SeatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/internal")
@RequiredArgsConstructor
@Slf4j
public class InternalTheatreController {

    private final ScreenService screenService;
    private final SeatService seatService;

    @GetMapping("/screens/{id}")
    public ScreenIdNameResponse getScreenById(@PathVariable Long id) {
        return screenService.getScreenIdNameById(id);
    }

    @GetMapping("/screens/{screenId}/seats")
    public List<SeatResponse> getSeatsByScreen(
            @PathVariable Long screenId) {

        return seatService.getSeatsByScreen(screenId);
    }

    @GetMapping("/seat/{seat}")
    public SeatResponse getSeatById(@PathVariable Long seat) {
        return seatService.getSeatById(seat);
    }

    @GetMapping("/seats/id")
    public List<MyBookkingSeatsRow> getSeatsById(@RequestBody List<Long> seatIds) {
        return seatService.getSeatsRowById(seatIds);
    }
}
