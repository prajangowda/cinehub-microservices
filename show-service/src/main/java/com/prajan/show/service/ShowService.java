package com.prajan.show.service;

import com.prajan.common.dto.*;

import com.prajan.common.enums.SeatStatus;
import com.prajan.show.client.MovieClient;
import com.prajan.show.client.ScreenClient;
import com.prajan.show.error.ResourceNotFoundException;

import com.prajan.show.dto.CreateShowRequest;
import com.prajan.show.dto.ShowResponse;
import com.prajan.show.dto.UpdateShowRequest;
import com.prajan.show.entity.Show;
import com.prajan.show.entity.ShowSeat;
import com.prajan.show.enums.ShowStatus;
import com.prajan.show.mapper.ShowMapper;
import com.prajan.show.repository.ShowRepository;
import com.prajan.show.repository.ShowSeatRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ShowService {

    private final ShowRepository showRepository;
    private final ShowSeatRepository showSeatRepository;
    private final MovieClient movieClient;
    private final ScreenClient screenClient;

    @Transactional
    public ShowResponse createShow(CreateShowRequest request) {

        validateTime(request);

        log.info("Checking movie and screen availability for movieId: {} and screenId: {}", request.getMovieId(), request.getScreenId());

        MovieIdNameResponse movie = movieClient.getMovieById(request.getMovieId());

        ScreenIdNameResponse screen = screenClient.getScreenById(request.getScreenId());

        log.info("Movie and Screen found: {} - {}, {} - {}", movie.id(), movie.title(), screen.id(), screen.name());

        validateScreenAvailability(
                request.getScreenId(),
                request.getShowDate(),
                request.getStartTime(),
                request.getEndTime()
        );

        Show show = Show.builder()
                .movieId(request.getMovieId())
                .screenId(request.getScreenId())
                .showDate(request.getShowDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .status(ShowStatus.SCHEDULED)
                .active(true)
                .build();

        Show savedShow = showRepository.save(show);

        List<SeatResponse> seatResponses = screenClient.getSeatsByScreen(savedShow.getScreenId());
        log.info("Retrieved {} seats for screenId: {}", seatResponses.size(), savedShow.getScreenId());

        List<ShowSeat> showSeats = seatResponses
                .stream()
                .filter(seat -> Boolean.TRUE.equals(seat.getActive()))
                .map(seat -> ShowSeat.builder()
                        .show(savedShow)
                        .seatId(seat.getId())
                        .status(SeatStatus.AVAILABLE)
                        .build())
                .toList();

        showSeatRepository.saveAll(showSeats);

        return ShowMapper.toResponse(savedShow,movie,screen);
    }

    private void validateTime(CreateShowRequest request) {

        if (request.getShowDate() == null ||
                request.getStartTime() == null ||
                request.getEndTime() == null) {

            throw new IllegalArgumentException(
                    "Date and show time are required"
            );
        }

        if (!request.getEndTime().isAfter(request.getStartTime())) {

            throw new IllegalArgumentException(
                    "End time must be after start time"
            );
        }

        if (request.getShowDate().isBefore(LocalDate.now())) {

            throw new IllegalArgumentException(
                    "Show date cannot be in the past"
            );
        }
    }

    public ShowResponse getShowById(Long showId) {

        Show show = showRepository.findById(showId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Show not found"));

        MovieIdNameResponse movie = movieClient.getMovieById(show.getMovieId());

        ScreenIdNameResponse screen = screenClient.getScreenById(show.getScreenId());

        return ShowMapper.toResponse(show, movie, screen);
    }

    private void validateScreenAvailability(
            Long screenId,
            LocalDate showDate,
            java.time.LocalTime startTime,
            java.time.LocalTime endTime) {

        List<Show> shows =
                showRepository.findByScreenIdAndShowDate(
                        screenId,
                        showDate
                );

        boolean conflict = shows.stream()
                .filter(show ->
                        show.getStatus() != ShowStatus.CANCELLED)
                .anyMatch(show ->
                        startTime.isBefore(show.getEndTime())
                                &&
                                endTime.isAfter(show.getStartTime())
                );

        if (conflict) {
            throw new IllegalArgumentException(
                    "Screen already has a show during this time"
            );
        }
    }

    public ShowResponse updateShow(
            Long showId,
            UpdateShowRequest request) {

        Show show = showRepository.findById(showId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Show not found"));

        if (show.getStatus() == ShowStatus.CANCELLED) {
            throw new IllegalArgumentException(
                    "Cancelled show cannot be updated"
            );
        }

        if (!request.getEndTime()
                .isAfter(request.getStartTime())) {

            throw new IllegalArgumentException(
                    "End time must be after start time"
            );
        }

        validateScreenAvailabilityForUpdate(
                show,
                request
        );

        show.setShowDate(request.getShowDate());
        show.setStartTime(request.getStartTime());
        show.setEndTime(request.getEndTime());

        MovieIdNameResponse movie = movieClient.getMovieById(show.getMovieId());

        ScreenIdNameResponse screen = screenClient.getScreenById(show.getScreenId());

        return ShowMapper.toResponse(show, movie, screen);
    }

    private void validateScreenAvailabilityForUpdate(
            Show currentShow,
            UpdateShowRequest request) {

        List<Show> shows =
                showRepository.findByScreenIdAndShowDate(
                        currentShow.getScreenId(),
                        request.getShowDate()
                );

        boolean conflict = shows.stream()
                .filter(show -> !show.getId()
                        .equals(currentShow.getId()))
                .filter(show ->
                        show.getStatus() != ShowStatus.CANCELLED)
                .anyMatch(show ->
                        request.getStartTime()
                                .isBefore(show.getEndTime())
                                &&
                                request.getEndTime()
                                        .isAfter(show.getStartTime())
                );

        if (conflict) {
            throw new IllegalArgumentException(
                    "Screen already has a show during this time"
            );
        }
    }

    public void cancelShow(Long showId) {

        Show show = showRepository.findById(showId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Show not found"));

        show.setStatus(ShowStatus.CANCELLED);
        show.setActive(false);
    }

    public List<ShowResponse> getAvailableShowsByMovie(Long movieId) {


        List<Show> shows = showRepository.findByMovieIdAndStatus(
                movieId,
                ShowStatus.SCHEDULED
        );
       log.info("Movie are fetched for the shows");

        return shows.stream()
                .map(show -> {

                    MovieIdNameResponse movie =
                            movieClient.getMovieById(show.getMovieId());

                    ScreenIdNameResponse screen =
                            screenClient.getScreenById(show.getScreenId());

                    return ShowResponse.builder()
                            .id(show.getId())

                            .movieId(show.getMovieId())
                            .movieTitle(movie.title())

                            .screenId(show.getScreenId())
                            .screenName(screen.name())

                            .theatreId(screen.theatreId())
                            .theatreName(screen.theatreName())

                            .showDate(show.getShowDate())
                            .startTime(show.getStartTime())
                            .endTime(show.getEndTime())

                            .status(show.getStatus())
                            .active(show.getActive())
                            .build();
                })
                .toList();
}

    public ShowExistsResponse checkShowExists(Long showId) {
        Show show = showRepository.findById(showId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Show not found"));

        return ShowExistsResponse.builder()
                .id(show.getId())
                .build();
    }

    public ShowBookingResponse getShowBookingDetails(Long showId) {

        Show show = showRepository.findById(showId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Show not found"));

        MovieIdNameResponse movie = movieClient.getMovieById(show.getMovieId());

        ScreenIdNameResponse screen = screenClient.getScreenById(show.getScreenId());
        log.info("Show booking details fetched for showId: {}", showId);
        return ShowBookingResponse.builder()
                .movieId(movie.id())
                .movieTitle(movie.title())
                .showDate(show.getShowDate())
                .startTime(show.getStartTime())
                .endTime(show.getEndTime())
                .build();
    }

    public List<ShowBookingResponse> getShowBookingDetailsInternal(List<Long> showIds) {

        List<Show> shows =
                showRepository.findAllById(showIds);

        List<Long> movieIds = shows.stream()
                .map(Show::getMovieId)
                .distinct()
                .toList();

        List<MovieIdNameResponse> movies =
                movieClient.getMoviesByIds(movieIds);

        Map<Long, MovieIdNameResponse> movieMap =
                movies.stream()
                        .collect(Collectors.toMap(
                                MovieIdNameResponse::id,
                                movie -> movie
                        ));

        List<ShowBookingResponse> response =
                shows.stream()
                        .map(showEntity -> {

                            MovieIdNameResponse movie =
                                    movieMap.get(showEntity.getMovieId());

                            return ShowBookingResponse.builder()
                                    .showId(showEntity.getId())
                                    .movieId(movie.id())
                                    .movieTitle(movie.title())
                                    .showDate(showEntity.getShowDate())
                                    .startTime(showEntity.getStartTime())
                                    .endTime(showEntity.getEndTime())
                                    .build();
                        })
                        .toList();

        return response;
    }
}