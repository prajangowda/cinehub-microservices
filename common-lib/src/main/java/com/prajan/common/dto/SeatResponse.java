package com.prajan.common.dto;

import com.prajan.common.enums.SeatType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class SeatResponse {

    private Long id;

    private String rowName;

    private Integer seatNumber;

    private SeatType seatType;

    private Boolean active;
}