package com.prajan.common.dto;

import lombok.Builder;

@Builder
public record ScreenIdNameResponse(
        Long id,
        String name,
        Long theatreId,
        String theatreName) { }
