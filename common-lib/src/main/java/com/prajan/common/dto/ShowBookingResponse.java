package com.prajan.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShowBookingResponse {
    private Long showId;
    private Long movieId;
    private String movieTitle;
    private LocalDate showDate;
    private LocalTime startTime;
    private LocalTime endTime;
}
