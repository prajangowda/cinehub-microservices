package com.prajan.theatre.mapper;

import com.prajan.theatre.dto.TheatreResponse;
import com.prajan.theatre.entity.Theatre;

public class TheatreMapper {

    private TheatreMapper() {
    }

    public static TheatreResponse toResponse(Theatre theatre) {

        return TheatreResponse.builder()
                .id(theatre.getId())
                .name(theatre.getName())
                .address(theatre.getAddress())
                .city(theatre.getCity())
                .state(theatre.getState())
                .pincode(theatre.getPincode())
                .latitude(theatre.getLatitude())
                .longitude(theatre.getLongitude())
                .phone(theatre.getPhone())
                .email(theatre.getEmail())
                .active(theatre.getActive())
                .build();
    }

}