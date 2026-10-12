package com.prajan.common.dto;

import lombok.Builder;

@Builder
public record MovieIdNameResponse
        ( Long id, String title){ }
