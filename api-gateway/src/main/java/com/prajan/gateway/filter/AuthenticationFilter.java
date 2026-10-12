package com.prajan.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import com.prajan.gateway.util.JwtUtil;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Component
@Slf4j
public class AuthenticationFilter
        extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    private final RouteValidator validator;
    private final JwtUtil jwtUtil;

    public AuthenticationFilter(
            RouteValidator validator,
            JwtUtil jwtUtil) {

        super(Config.class);

        this.validator = validator;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public GatewayFilter apply(Config config) {

        return (exchange, chain) -> {

              // Allow CORS preflight requests
        if (exchange.getRequest().getMethod() == HttpMethod.OPTIONS) {
            return chain.filter(exchange);
        }

        // Public endpoint
        if (!validator.isSecured.test(exchange.getRequest())) {
            return chain.filter(exchange);
        }

            // Public endpoint
            if (!validator.isSecured.test(exchange.getRequest())) {
                return chain.filter(exchange);
            }
            log.info("Processing authentication for request: {}", exchange.getRequest().getURI());
            // Get accessToken cookie
            HttpCookie cookie = exchange.getRequest()
                    .getCookies()
                    .getFirst("accessToken");

            // Cookie doesn't exist
            if (cookie == null || cookie.getValue().isBlank()) {
                return unauthorized(exchange);
            }

            String token = cookie.getValue();

            try {

                // Validate JWT
                if (!jwtUtil.isValid(token)) {
                    return unauthorized(exchange);
                }

            } catch (Exception e) {

                return unauthorized(exchange);
            }

            // JWT valid
            log.info("JWT valid for request: {} by Gateway", exchange.getRequest().getURI());
            return chain.filter(exchange);
        };
    }

    private Mono<Void> unauthorized(
            ServerWebExchange exchange) {

        exchange.getResponse()
                .setStatusCode(HttpStatus.UNAUTHORIZED);

        return exchange.getResponse().setComplete();
    }

    public static class Config {
    }
}