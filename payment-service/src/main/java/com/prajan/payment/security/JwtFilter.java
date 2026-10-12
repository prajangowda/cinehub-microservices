package com.prajan.payment.security;

import com.prajan.common.enums.Role;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

    private final CookieService cookieService;
    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        try {
            log.info("Extracting token from cookies for request: {}", request.getRequestURI());

            String token =
                    cookieService.extractTokenFromCookies(
                            request,
                            "accessToken"
                    );

            if (token == null) {
                filterChain.doFilter(request, response);
                return;
            }

            Long userId = jwtUtil.getUserId(token);

            Role role = jwtUtil.getRole(token);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userId.toString(),
                            null,
                            List.of(
                                    new SimpleGrantedAuthority(
                                            "ROLE_" + role.name()
                                    )
                            )
                    );

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);

            log.info("Authentication set for userId: {} with role: {}", userId, role);
            filterChain.doFilter(request, response);

        } catch (JwtException | IllegalArgumentException ex) {

            log.error("JWT validation failed: {}", ex.getMessage());
            SecurityContextHolder.clearContext();

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );
        }
    }
}