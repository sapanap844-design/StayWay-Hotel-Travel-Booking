package com.hotelbooking.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record BookingResponse(
        Long id,
        Long hotelId,
        String hotelName,
        String city,
        String roomType,
        String userName,
        String userEmail,
        LocalDate checkIn,
        LocalDate checkOut,
        Integer guests,
        Double totalPrice,
        String status,
        LocalDateTime createdAt) {
}
