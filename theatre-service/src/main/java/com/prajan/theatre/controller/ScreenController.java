package com.prajan.theatre.controller;

import com.prajan.theatre.dto.CreateScreenRequest;
import com.prajan.theatre.dto.ScreenResponse;
import com.prajan.theatre.service.ScreenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/screens")
@RequiredArgsConstructor
@Slf4j
public class ScreenController {

    private final ScreenService screenService;

    @PostMapping
    public ResponseEntity<ScreenResponse> createScreen(
            @RequestBody CreateScreenRequest request) {

        log.info("Creating screen with request: {}", request);
        ScreenResponse response = screenService.createScreen(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    @GetMapping("/theatre/{theatreId}")
    public ResponseEntity<List<ScreenResponse>> getScreensByTheatre(
            @PathVariable Long theatreId) {

        log.info("Fetching screens for theatre with ID: {}", theatreId);
        return ResponseEntity.ok(
                screenService.getScreensByTheatre(theatreId)
        );
    }
}
