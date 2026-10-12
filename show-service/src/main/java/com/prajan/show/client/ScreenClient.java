package com.prajan.show.client;

import com.prajan.common.dto.ScreenIdNameResponse;
import com.prajan.common.dto.SeatResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "theatre-service")
public interface ScreenClient {

    @GetMapping("/api/v1/internal/screens/{id}")
    ScreenIdNameResponse getScreenById(@PathVariable("id") Long id);

    @GetMapping("/api/v1/internal/screens/{id}/seats")
    List<SeatResponse> getSeatsByScreen(@PathVariable("id") Long id);

    @GetMapping("/api/v1/internal/seat/{seat}")
    SeatResponse getSeatById(@PathVariable("seat") Long seatId);
}
