package com.prajan.theatre.dto;

import com.prajan.theatre.enums.ScreenType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateScreenRequest {

    private Long theatreId;

    private String name;

    private ScreenType type;

    private Integer rows;

    private Integer seatsPerRow;
}