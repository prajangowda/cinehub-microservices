package com.prajan.theatre.controller;


import com.prajan.theatre.service.TheatreOwnerRequestService;
import com.prajan.theatre.dto.TheatreOwnerResponseDto;
import com.prajan.theatre.entity.TheatreOwnerRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminRequestController {

    private final TheatreOwnerRequestService service;

    @GetMapping("/owner-requests")
    public List<TheatreOwnerResponseDto> pendingRequests() {
        return service.getPendingRequests();
    }

    @PutMapping("/owner-requests/{id}/approve")
    public void approve(@PathVariable Long id) {
        log.info("Approving request with ID: {}", id);
        service.approve(id);
    }

    @PutMapping("/owner-requests/{id}/reject")
    public void reject(@PathVariable Long id) {
        log.info("Rejecting request with ID: {}", id);
        service.reject(id);
    }
}