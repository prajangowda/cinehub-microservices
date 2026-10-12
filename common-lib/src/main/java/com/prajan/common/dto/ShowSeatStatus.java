package com.prajan.common.dto;

import com.prajan.common.enums.SeatStatus;
import lombok.Builder;

@Builder
public record ShowSeatStatus(
        Long id,
        Long showId,
        SeatStatus status
) {}