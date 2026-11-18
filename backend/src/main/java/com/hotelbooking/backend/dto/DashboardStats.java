package com.hotelbooking.backend.dto;

public record DashboardStats(
        long totalUsers,
        long totalHotels,
        long totalPackages,
        long totalBookings,
        long confirmedBookings,
        long cancelledBookings,
        double totalRevenue) {
}
