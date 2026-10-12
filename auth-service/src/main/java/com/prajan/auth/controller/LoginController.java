package com.prajan.auth.controller;


import com.prajan.auth.authService.AuthService;
import com.prajan.auth.authService.CookieService;
import com.prajan.auth.dto.*;
import com.prajan.auth.enums.SignupResponse;
import com.prajan.auth.repository.UserInRepository;
import com.prajan.common.enums.Role;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class LoginController {


    final private UserInRepository userrepo;

    final private AuthService authService;

    final private CookieService cookieService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(Authentication authentication) {
        log.info("me request received for user: {}", authentication.getName());
        return ResponseEntity.ok(authService.getCurrentUser(authentication));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest dto, HttpServletResponse response) {

        log.info("login request received for email: {}", dto.getEmail());

        LoginResponse result= authService.login(dto);

        cookieService.addAccessTokenCookie(response, result.getAccessToken());

        cookieService.addRefreshTokenCookie(response,result.getRefreshToken());

        log.info("login successful for email: {}", dto.getEmail());
        return ResponseEntity.ok("Logged In");
    }

    //signUp
    @PostMapping("/signup")
    public ResponseEntity<SignupResponse> signup(
            @Valid @RequestBody SingupRequest request) {
        log.info("signup request received for email: {}", request.getEmail());
        return ResponseEntity.ok(authService.signup(request));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request,HttpServletResponse response) {

        log.info("verify OTP request received for email: {}", request.getEmail());

        LoginResponse result = authService.verifyOtp(request);

        cookieService.addAccessTokenCookie(response, result.getAccessToken());

        cookieService.addRefreshTokenCookie(response,result.getRefreshToken());

        return ResponseEntity.ok("Logged In");
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<String> resendOtp(
            @RequestParam String email) {
       log.info("Request recieved for resend OTP");
        return ResponseEntity.ok(authService.resendOtp(email));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        log.info("logout request received");
        cookieService.logout(response);
        return ResponseEntity.ok("Logged out successfully");
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request, HttpServletResponse response) {
        log.info("refresh token request received");
        LoginResponse result=authService.refreshToken(request, response);
        cookieService.addAccessTokenCookie(response, result.getAccessToken());
        log.info("refresh token request received");
        return ResponseEntity.ok("access token issued");
    }


}
