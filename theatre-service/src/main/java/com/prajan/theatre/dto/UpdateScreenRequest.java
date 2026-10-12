package com.prajan.theatre.dto;


import com.prajan.theatre.enums.ScreenType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateScreenRequest {

    private String name;

    private ScreenType type;

    private Boolean active;
}