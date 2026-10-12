package com.prajan.theatre.service;

import com.prajan.common.dto.ScreenIdNameResponse;
import com.prajan.theatre.dto.CreateScreenRequest;
import com.prajan.theatre.dto.ScreenResponse;
import com.prajan.theatre.entity.Screen;
import com.prajan.theatre.entity.Theatre;
import com.prajan.theatre.error.ResourceNotFoundException;
import com.prajan.theatre.mapper.ScreenMapper;
import com.prajan.theatre.repository.ScreenRepository;
import com.prajan.theatre.repository.TheatreRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ScreenService {

    private final ScreenRepository screenRepository;
    private final TheatreRepository theatreRepository;
    private final SeatService seatService;

    public ScreenResponse createScreen(CreateScreenRequest request) {

        Theatre theatre = theatreRepository.findById(request.getTheatreId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Theatre not found"));

        Screen screen = Screen.builder()
                .name(request.getName())
                .type(request.getType())
                .rows(request.getRows())
                .seatsPerRow(request.getSeatsPerRow())
                .totalSeats(request.getRows() * request.getSeatsPerRow())
                .active(true)
                .theatre(theatre)
                .build();

        Screen savedScreen = screenRepository.save(screen);

        seatService.generateSeats(
                savedScreen,
                request.getRows(),
                request.getSeatsPerRow()
        );

        log.info("Screen created with ID: {}", savedScreen.getId());
        return ScreenMapper.toResponse(savedScreen);
    }

    public List<ScreenResponse> getScreensByTheatre(Long theatreId) {

        if (!theatreRepository.existsById(theatreId)) {
            log.warn("Theatre not found with ID: {}", theatreId);
            throw new ResourceNotFoundException("Theatre not found");
        }

        return screenRepository.findByTheatreId(theatreId)
                .stream()
                .map(ScreenMapper::toResponse)
                .toList();
    }

    public ScreenIdNameResponse getScreenIdNameById(Long screenId) {
        Screen screen = screenRepository.findById(screenId)
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found"));

        return ScreenIdNameResponse.builder()
                .id(screen.getId())
                .name(screen.getName())
                .theatreId(screen.getTheatre().getId())
                .theatreName(screen.getTheatre().getName())
                .build();

    }
}