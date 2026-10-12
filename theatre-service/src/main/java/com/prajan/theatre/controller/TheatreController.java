package com.prajan.theatre.controller;

import com.prajan.theatre.dto.CreateTheatreRequest;
import com.prajan.theatre.dto.TheatreResponse;
import com.prajan.theatre.dto.UpdateTheatreRequest;
import com.prajan.theatre.service.TheatreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/theatre_owner/theatres")
@RequiredArgsConstructor
@Slf4j
public class TheatreController {

    private final TheatreService theatreService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('THEATRE_OWNER')")
    public TheatreResponse createTheatre(
            @Valid @RequestBody CreateTheatreRequest request) {

        log.info("Creating theatre with name: {}", request.getName());
        return theatreService.createTheatre(request);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('THEATRE_OWNER')")
    public TheatreResponse getTheatre(
            @PathVariable Long id) {
        log.info("Fetching theatre with ID: {}", id);
        return theatreService.getTheatre(id);
    }

    @GetMapping
    public List<TheatreResponse> getAllTheatres() {
        log.info("Fetching all theatres");
        return theatreService.getAllTheatres();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('THEATRE_OWNER')")
    public TheatreResponse updateTheatre(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTheatreRequest request) {
        log.info("Updating theatre with ID: {}", id);
        return theatreService.updateTheatre(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('THEATRE_OWNER')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTheatre(
            @PathVariable Long id) {
        log.info("Deleting theatre with ID: {}", id);
        theatreService.deleteTheatre(id);
    }

    @GetMapping("/city/{city}")
    @PreAuthorize("hasRole('THEATRE_OWNER')")
    public List<TheatreResponse> getByCity(
            @PathVariable String city) {
        log.info("Fetching theatres in city: {}", city);
        return theatreService.getTheatresByCity(city);
    }

    @GetMapping("/active")
    public List<TheatreResponse> getActiveTheatres() {
        log.info("Fetching active theatres");
        return theatreService.getActiveTheatres();
    }
}
