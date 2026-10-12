package com.prajan.booking.Clients;

import com.prajan.common.dto.MyBookkingSeatsRow;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "THEATRE-SERVICE")
public interface TheatreClient {

    @GetMapping("/api/v1/internal/seats/id")
    public List<MyBookkingSeatsRow> getSeatsById( @RequestBody List<Long> seatIds);
}
