package com.hotelbooking.backend.repository;

import com.hotelbooking.backend.entity.Booking;
import com.hotelbooking.backend.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Booking> findAllByOrderByCreatedAtDesc();

    long countByStatus(BookingStatus status);

    boolean existsByRoomId(Long roomId);

    /** How many CONFIRMED bookings of this room overlap the wanted dates. */
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.room.id = :roomId " +
           "AND b.status = com.hotelbooking.backend.entity.BookingStatus.CONFIRMED " +
           "AND b.checkIn < :checkOut AND b.checkOut > :checkIn")
    long countOverlapping(@Param("roomId") Long roomId,
                          @Param("checkIn") LocalDate checkIn,
                          @Param("checkOut") LocalDate checkOut);

    @Query("SELECT COALESCE(SUM(b.totalPrice), 0) FROM Booking b " +
           "WHERE b.status = com.hotelbooking.backend.entity.BookingStatus.CONFIRMED")
    double totalRevenue();
}
