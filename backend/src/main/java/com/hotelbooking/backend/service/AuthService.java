package com.hotelbooking.backend.service;

import com.hotelbooking.backend.dto.AuthResponse;
import com.hotelbooking.backend.dto.LoginRequest;
import com.hotelbooking.backend.dto.RegisterRequest;
import com.hotelbooking.backend.entity.Role;
import com.hotelbooking.backend.entity.User;
import com.hotelbooking.backend.exception.ApiException;
import com.hotelbooking.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new ApiException(HttpStatus.CONFLICT, "This email is already registered");
        }
        User user = new User();
        user.setName(req.name());
        user.setEmail(req.email());
        user.setPhone(req.phone());
        user.setPassword(passwordEncoder.encode(req.password()));
        user.setRole(Role.USER);
        user.setToken(UUID.randomUUID().toString());
        userRepository.save(user);
        return toResponse(user);
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Wrong email or password"));
        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Wrong email or password");
        }
        user.setToken(UUID.randomUUID().toString());
        userRepository.save(user);
        return toResponse(user);
    }

    /** Reads "Authorization: Bearer <token>" and finds the logged-in user. */
    public User getCurrentUser(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Please login first");
        }
        String token = authHeader.substring(7);
        return userRepository.findByToken(token)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Session expired, please login again"));
    }

    public User requireAdmin(String authHeader) {
        User user = getCurrentUser(authHeader);
        if (user.getRole() != Role.ADMIN) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Admin access only");
        }
        return user;
    }

    private AuthResponse toResponse(User u) {
        return new AuthResponse(u.getId(), u.getName(), u.getEmail(), u.getRole().name(), u.getToken());
    }
}
