package com.prajan.common.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class MyBookkingSeatsRow {
    private Integer seatNumber;
    private String rowName;
    private Long seatId;
}
