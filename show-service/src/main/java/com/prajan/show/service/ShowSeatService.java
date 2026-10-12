package com.prajan.show.service;

import com.prajan.common.dto.SeatResponse;
import com.prajan.common.dto.ShowSeatStatus;
import com.prajan.common.enums.SeatStatus;
import com.prajan.show.client.ScreenClient;
import com.prajan.show.dto.ShowSeatResponse;
import com.prajan.show.entity.ShowSeat;
import com.prajan.show.repository.ShowSeatRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ShowSeatService {

    private final ShowSeatRepository showSeatRepository;
    private final ScreenClient screenClient;

    public List<ShowSeatResponse> getSeatsByShow(Long showId) {

        return showSeatRepository.findByShowId(showId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    @Transactional
    public void bookSeats(
            Long showId,
            List<Long> seatIds
    ) {

        List<ShowSeat> seats =
                showSeatRepository
                        .findByShowIdAndSeatIdIn(
                                showId,
                                seatIds
                        );

        if (seats.size() != seatIds.size()) {
            throw new RuntimeException(
                    "One or more seats not found"
            );
        }

        for (ShowSeat seat : seats) {

            if (seat.getStatus() != SeatStatus.AVAILABLE) {
                throw new RuntimeException(
                        "Seat is not available: "
                                + seat.getSeatId()
                );
            }

            seat.setStatus(
                    SeatStatus.BOOKED
            );
        }

        showSeatRepository.saveAll(seats);
    }


    private ShowSeatResponse mapToResponse(ShowSeat showSeat) {

        SeatResponse seat= screenClient.getSeatById(showSeat.getId());
        return ShowSeatResponse.builder()
                .id(showSeat.getId())
                .seatId(seat.getId())
                .rowName(seat.getRowName())
                .seatNumber(seat.getSeatNumber())
                .seatType(seat.getSeatType())
                .status(showSeat.getStatus())
                .build();
    }

    public List<ShowSeatStatus> getSeatsStatusByShow(Long showId,List<Long> seatIds) {
        return showSeatRepository.findByShowId(showId)
                .stream()
                .filter(seat -> seatIds.contains(seat.getId()))
                .map(this::mapToStatus)
                .toList();
    }

    private ShowSeatStatus mapToStatus(ShowSeat showSeat) {
        return ShowSeatStatus.builder()
                .id(showSeat.getId())
                .status(showSeat.getStatus())
                .showId(showSeat.getShow().getId())
                .build();
    }
}