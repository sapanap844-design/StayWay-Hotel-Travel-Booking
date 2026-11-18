package com.hotelbooking.backend.dto;

/** What React receives after login/register. Never includes the password. */
public record AuthResponse(Long id, String name, String email, String role, String token) {
}
