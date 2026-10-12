package com.prajan.auth.enums;

public record SignupResponse(
        boolean otpRequired,
        String message
) {}