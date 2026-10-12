package com.prajan.auth.controller;

import com.prajan.auth.authService.AuthService;
import com.prajan.auth.dto.UserResponse;
import com.prajan.auth.error.ResourceNotFoundException;
import com.prajan.auth.model.UserIn;
import com.prajan.auth.repository.UserInRepository;
import com.prajan.common.enums.Role;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth/internal/users")
@RequiredArgsConstructor
@Slf4j
public class InternalUserController {

    private final AuthService authService;
    private final UserInRepository userInRepository;

    @GetMapping("/{userId}")
    public UserResponse getUser(
            @PathVariable Long userId
    ) {

        log.info("Fetching user with ID: {}", userId);
        UserIn user = userInRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));

        log.info("User fetched successfully with ID: {}", userId);
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    @PutMapping("/{userId}/role")
    public ResponseEntity<Void> changeRole(
            @PathVariable Long userId,
            @RequestParam Role role
    ) {
        authService.changeRole(userId, role);
        return ResponseEntity.ok().build();
    }
}