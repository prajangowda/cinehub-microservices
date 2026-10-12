package com.prajan.theatre.dto;


import com.prajan.common.enums.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private Role role;
}
