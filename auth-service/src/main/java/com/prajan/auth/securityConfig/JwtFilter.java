package com.prajan.auth.securityConfig;

import com.prajan.auth.authService.CookieService;
import com.prajan.auth.authService.JWTservice;
import com.prajan.auth.model.CustomUserDetails;
import com.prajan.auth.model.UserIn;
import com.prajan.auth.repository.UserInRepository;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

    private final HandlerExceptionResolver handlerExceptionResolver;
    private final JWTservice jwtService;
    private final UserInRepository repo;
    private  final CookieService cookieService;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        if (path.startsWith("/api/v1/auth/internal/")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
               log.info("JwtFilter: Processing request for URI: {}", request.getRequestURI());
            String token = cookieService.extractTokenFromCookies(request,"accessToken");

            if (token == null) {
                filterChain.doFilter(request, response);
                return;
            }

            String email = jwtService.getEmailFromToken(token);
            log.info("JwtFilter: Extracted email from token: {}", email);

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserIn user = repo.findByEmail(email)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                if (!user.isActive())
                    throw new ResponseStatusException(
                            HttpStatus.FORBIDDEN,
                            "Account disabled by admin"
                    );

                CustomUserDetails userPrincipal = new CustomUserDetails(user);

                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                        new UsernamePasswordAuthenticationToken(userPrincipal, null, userPrincipal.getAuthorities());

                log.info("JwtFilter: User {} authenticated successfully", email);
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                log.info("JwtFilter: Passing request to next filter");


            }
            filterChain.doFilter(request, response);
            log.info("JwtFilter: Request returned from filter chain");
        }catch (JwtException | UsernameNotFoundException ex) {
            log.error("JwtFilter: Authentication failed - {}", ex.getMessage());
            SecurityContextHolder.clearContext();
            handlerExceptionResolver.resolveException(request, response, null, ex);
            return;
        }
    }
}
