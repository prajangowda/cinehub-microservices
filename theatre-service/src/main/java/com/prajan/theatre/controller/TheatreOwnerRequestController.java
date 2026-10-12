package com.prajan.theatre.controller;


import com.prajan.theatre.dto.TheatreOwnerRequestDto;
import com.prajan.theatre.service.TheatreOwnerRequestService;
import com.prajan.theatre.dto.TheatreOwnerResponseDto;
import com.prajan.theatre.entity.TheatreOwnerRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/v1/owner/request")
@RequiredArgsConstructor
@Slf4j
public class TheatreOwnerRequestController {

    private final TheatreOwnerRequestService service;

    @PostMapping
    public TheatreOwnerResponseDto submit(
            @Valid @RequestBody TheatreOwnerRequestDto request
    ) {
        log.info("Submitting theatre owner request for user: {}", request);

        return service.submitRequest(request);
    }

}