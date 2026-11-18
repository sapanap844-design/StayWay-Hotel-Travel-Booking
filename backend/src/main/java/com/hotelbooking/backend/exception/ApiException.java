package com.hotelbooking.backend.exception;

import org.springframework.http.HttpStatus;

/** Our own error type: carries a message and an HTTP status code. */
public class ApiException extends RuntimeException {

    private final HttpStatus status;

    public ApiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
