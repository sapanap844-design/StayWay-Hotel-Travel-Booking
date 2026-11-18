package com.hotelbooking.backend.controller;

import com.hotelbooking.backend.dto.BookingRequest;
import com.hotelbooking.backend.dto.BookingResponse;
import com.hotelbooking.backend.entity.User;
import com.hotelbooking.backend.service.AuthService;
import com.hotelbooking.backend.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/** Logged-in user APIs: book, see history, cancel. */
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final AuthService authService;

    public BookingController(BookingService bookingService, AuthService authService) {
        this.bookingService = bookingService;
        this.authService = authService;
    }

    @PostMapping
    public BookingResponse book(@RequestHeader(value = "Authorization", required = false) String auth,
                                @Valid @RequestBody BookingRequest request) {
        User user = authService.getCurrentUser(auth);
        return bookingService.create(user, request);
    }

    @GetMapping("/my")
    public List<BookingResponse> myBookings(@RequestHeader(value = "Authorization", required = false) String auth) {
        User user = authService.getCurrentUser(auth);
        return bookingService.myBookings(user);
    }

    @PutMapping("/{id}/cancel")
    public BookingResponse cancel(@RequestHeader(value = "Authorization", required = false) String auth,
                                  @PathVariable Long id) {
        User user = authService.getCurrentUser(auth);
        return bookingService.cancel(user, id);
    }
}
