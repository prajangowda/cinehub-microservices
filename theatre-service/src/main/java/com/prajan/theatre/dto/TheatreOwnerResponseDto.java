package com.prajan.theatre.dto;


import com.prajan.theatre.enums.RequestStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;


@Data
@Builder
public class TheatreOwnerResponseDto {
    private Long id;

    private String businessName;

    private String phone;

    private String address;

    private String gstNumber;

    private RequestStatus status;

    private LocalDateTime requestedAt;
}
