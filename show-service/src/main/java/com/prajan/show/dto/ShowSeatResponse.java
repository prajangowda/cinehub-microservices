package com.prajan.show.dto;

import com.prajan.common.enums.SeatStatus;
import com.prajan.common.enums.SeatType;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShowSeatResponse {

    private Long id;

    private Long seatId;

    private String rowName;

    private Integer seatNumber;

    private SeatType seatType;

    private SeatStatus status;
}