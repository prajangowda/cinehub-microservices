package com.prajan.gateway.filter;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {

    public static final List<String> openApiEndpoints = List.of(
            "/api/v1/auth/login",
            "/api/v1/auth/signup",
            "/api/v1/auth/refresh",
            "/api/v1/public/**",
            "/api/v1/auth/verify-otp",
            "/api/v1/auth/refresh"
    );

    public static final List<String> openApiPrefixes = List.of(
            "/api/v1/public/"
    );

    public Predicate<ServerHttpRequest> isSecured =
            request -> {

                String path = request.getURI().getPath();

                // Exact public endpoints
                boolean exactMatch =
                        openApiEndpoints.stream()
                                .anyMatch(path::equals);

                // Public wildcard endpoints
                boolean prefixMatch =
                        openApiPrefixes.stream()
                                .anyMatch(path::startsWith);

                return !(exactMatch || prefixMatch);
            };
}