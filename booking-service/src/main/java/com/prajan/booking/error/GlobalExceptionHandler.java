package com.prajan.booking.error;

import com.prajan.common.error.ApiError;
import feign.FeignException;
import feign.RetryableException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(FeignException.NotFound.class)
    public ResponseEntity<ApiError> handleFeignNotFound(
            FeignException.NotFound ex
    ) {

        ApiError error = new ApiError(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(),
                "User Not Found",
                "User does not exist"
        );

        return new ResponseEntity<>(
                error,
                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(RetryableException.class)
    public ResponseEntity<ApiError> handleFeignUnavailable(
            RetryableException ex
    ) {

        ApiError error = new ApiError(
                LocalDateTime.now(),
                HttpStatus.SERVICE_UNAVAILABLE.value(),
                "Service Unavailable",
                "Auth service is currently unavailable"
        );

        return new ResponseEntity<>(
                error,
                HttpStatus.SERVICE_UNAVAILABLE
        );
    }

    @ExceptionHandler(FeignException.class)
    public ResponseEntity<ApiError> handleFeignException(
            FeignException ex
    ) {
        log.error(
                "Feign error: status={}, message={}, content={}",
                ex.status(),
                ex.getMessage(),
                ex.contentUTF8(),
                ex
        );

        ApiError error = new ApiError(
                LocalDateTime.now(),
                HttpStatus.BAD_GATEWAY.value(),
                "Auth Service Error",
                "Error communicating with Auth service"
        );

        return new ResponseEntity<>(
                error,
                HttpStatus.BAD_GATEWAY
        );
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleResourceNotFound(
            ResourceNotFoundException ex
    ) {

        ApiError error = new ApiError(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(),
                "Resource Not Found",
                ex.getMessage()
        );

        return new ResponseEntity<>(
                error,
                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ResponseEntity<ApiError> handleResourceAlreadyExists(
            ResourceAlreadyExistsException ex
    ) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ApiError(
                        LocalDateTime.now(),
                        HttpStatus.CONFLICT.value(),
                        "Resource Already Exists",
                        ex.getMessage()
                ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGenericException(
            Exception ex
    ) {

        ApiError error = new ApiError(
                LocalDateTime.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                ex.getMessage()
        );

        return new ResponseEntity<>(
                error,
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}