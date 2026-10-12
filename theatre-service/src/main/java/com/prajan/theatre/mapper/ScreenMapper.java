package com.prajan.theatre.mapper;


import com.prajan.theatre.dto.ScreenResponse;
import com.prajan.theatre.entity.Screen;


public class ScreenMapper {

    private ScreenMapper() {
    }

    public static ScreenResponse toResponse(Screen screen) {

        return new ScreenResponse(
                screen.getId(),
                screen.getName(),
                screen.getType(),
                screen.getRows(),
                screen.getSeatsPerRow(),
                screen.getTotalSeats(),
                screen.getActive(),
                screen.getTheatre().getId()
        );
    }
}
