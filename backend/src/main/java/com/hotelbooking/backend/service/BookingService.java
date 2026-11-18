package com.hotelbooking.backend.service;

import com.hotelbooking.backend.dto.BookingRequest;
import com.hotelbooking.backend.dto.BookingResponse;
import com.hotelbooking.backend.entity.Booking;
import com.hotelbooking.backend.entity.BookingStatus;
import com.hotelbooking.backend.entity.Room;
import com.hotelbooking.backend.entity.User;
import com.hotelbooking.backend.exception.ApiException;
import com.hotelbooking.backend.repository.BookingRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomService roomService;

    public BookingService(BookingRepository bookingRepository, RoomService roomService) {
        this.bookingRepository = bookingRepository;
        this.roomService = roomService;
    }

    @Transactional
    public BookingResponse create(User user, BookingRequest req) {
        if (req.checkIn().isBefore(LocalDate.now())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Check-in date cannot be in the past");
        }
        if (!req.checkOut().isAfter(req.checkIn())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Check-out must be after check-in");
        }
        Room room = roomService.getById(req.roomId());
        if (req.guests() > room.getCapacity()) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "This room allows maximum " + room.getCapacity() + " guests");
        }
        if (roomService.availableCount(room, req.checkIn(), req.checkOut()) < 1) {
            throw new ApiException(HttpStatus.CONFLICT, "No rooms available for these dates");
        }

        long nights = ChronoUnit.DAYS.between(req.checkIn(), req.checkOut());

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setRoom(room);
        booking.setCheckIn(req.checkIn());
        booking.setCheckOut(req.checkOut());
        booking.setGuests(req.guests());
        booking.setTotalPrice(nights * room.getPricePerNight());
        booking.setStatus(BookingStatus.CONFIRMED);
        return toResponse(bookingRepository.save(booking));
    }

    public List<BookingResponse> myBookings(User user) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toResponse).toList();
    }

    public List<BookingResponse> allBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public BookingResponse cancel(User user, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Booking not found"));
        if (!booking.getUser().getId().equals(user.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "This is not your booking");
        }
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Booking is already cancelled");
        }
        if (!booking.getCheckIn().isAfter(LocalDate.now())) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "You can cancel only before the check-in date");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        return toResponse(bookingRepository.save(booking));
    }

    private BookingResponse toResponse(Booking b) {
        return new BookingResponse(
                b.getId(),
                b.getRoom().getHotel().getId(),
                b.getRoom().getHotel().getName(),
                b.getRoom().getHotel().getCity(),
                b.getRoom().getRoomType(),
                b.getUser().getName(),
                b.getUser().getEmail(),
                b.getCheckIn(),
                b.getCheckOut(),
                b.getGuests(),
                b.getTotalPrice(),
                b.getStatus().name(),
                b.getCreatedAt());
    }
}
