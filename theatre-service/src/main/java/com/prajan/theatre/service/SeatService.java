package com.prajan.theatre.service;

import com.prajan.common.dto.MyBookkingSeatsRow;
import com.prajan.common.dto.SeatResponse;
import com.prajan.theatre.entity.Screen;
import com.prajan.theatre.entity.Seat;
import com.prajan.theatre.repository.SeatRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.prajan.common.enums.SeatType;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SeatService {

    private final SeatRepository seatRepository;

    public void generateSeats(Screen screen,
                              Integer rows,
                              Integer seatsPerRow) {

        List<Seat> seats = new ArrayList<>();

        for (int row = 0; row < rows; row++) {

            String rowName = String.valueOf((char) ('A' + row));

            for (int seatNo = 1; seatNo <= seatsPerRow; seatNo++) {

                Seat seat = Seat.builder()
                        .rowName(rowName)
                        .seatNumber(seatNo)
                        .seatType(SeatType.REGULAR)
                        .active(true)
                        .screen(screen)
                        .build();

                seats.add(seat);
            }
        }

        seatRepository.saveAll(seats);
    }

    public List<SeatResponse> getSeatsByScreen(Long screenId) {

        List<Seat> seats = seatRepository.findByScreenId(screenId);

        List<SeatResponse> seatResponses = new ArrayList<>();

        for (Seat seat : seats) {
            SeatResponse response = SeatResponse.builder()
                    .id(seat.getId())
                    .rowName(seat.getRowName())
                    .seatNumber(seat.getSeatNumber())
                    .seatType(seat.getSeatType())
                    .active(seat.getActive())
                    .build();

            seatResponses.add(response);
        }

        return seatResponses;
    }

    public SeatResponse getSeatById(Long seat) {

        Seat seatEntity = seatRepository.findById(seat)
                .orElseThrow(() -> new RuntimeException("Seat not found with id: " + seat));

        return SeatResponse.builder()
                .id(seatEntity.getId())
                .rowName(seatEntity.getRowName())
                .seatNumber(seatEntity.getSeatNumber())
                .seatType(seatEntity.getSeatType())
                .active(seatEntity.getActive())
                .build();
    }

    public List<MyBookkingSeatsRow> getSeatsRowById(List<Long> seatIds) {

        List<Seat> seats = seatRepository.findByIdIn(seatIds);

        List<MyBookkingSeatsRow> seatResponses = new ArrayList<>();

        for (Seat seat : seats) {
            MyBookkingSeatsRow row = MyBookkingSeatsRow.builder()
                    .seatNumber(seat.getSeatNumber())
                    .rowName(seat.getRowName())
                    .seatId(seat.getId())
                    .build();

            seatResponses.add(row);
        }

        return seatResponses;
    }
}
