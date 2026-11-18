package com.hotelbooking.backend.service;

import com.hotelbooking.backend.dto.DashboardStats;
import com.hotelbooking.backend.entity.BookingStatus;
import com.hotelbooking.backend.repository.BookingRepository;
import com.hotelbooking.backend.repository.HotelRepository;
import com.hotelbooking.backend.repository.TravelPackageRepository;
import com.hotelbooking.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final TravelPackageRepository packageRepository;
    private final BookingRepository bookingRepository;

    public DashboardService(UserRepository userRepository, HotelRepository hotelRepository,
                            TravelPackageRepository packageRepository, BookingRepository bookingRepository) {
        this.userRepository = userRepository;
        this.hotelRepository = hotelRepository;
        this.packageRepository = packageRepository;
        this.bookingRepository = bookingRepository;
    }

    public DashboardStats getStats() {
        return new DashboardStats(
                userRepository.count(),
                hotelRepository.count(),
                packageRepository.count(),
                bookingRepository.count(),
                bookingRepository.countByStatus(BookingStatus.CONFIRMED),
                bookingRepository.countByStatus(BookingStatus.CANCELLED),
                bookingRepository.totalRevenue());
    }
}
