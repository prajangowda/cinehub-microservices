package com.prajan.theatre.client;


import com.prajan.common.enums.Role;
import com.prajan.theatre.dto.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "AUTH-SERVICE")
public interface AuthClient {

    @PutMapping("/api/v1/auth/internal/users/{userId}/role")
    void changeRole(
            @PathVariable("userId") Long userId,
            @RequestParam("role") Role role
    );

    @GetMapping("/api/v1/auth/internal/users/{userId}")
    UserResponse getUser(
            @PathVariable("userId") Long userId
    );
}