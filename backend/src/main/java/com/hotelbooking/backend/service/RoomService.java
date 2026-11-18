package com.hotelbooking.backend.service;

import com.hotelbooking.backend.dto.RoomAvailability;
import com.hotelbooking.backend.entity.Hotel;
import com.hotelbooking.backend.entity.Room;
import com.hotelbooking.backend.exception.ApiException;
import com.hotelbooking.backend.repository.BookingRepository;
import com.hotelbooking.backend.repository.RoomRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final HotelService hotelService;

    public RoomService(RoomRepository roomRepository, BookingRepository bookingRepository,
                       HotelService hotelService) {
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
        this.hotelService = hotelService;
    }

    public List<Room> getRooms(Long hotelId) {
        hotelService.getById(hotelId);
        return roomRepository.findByHotelId(hotelId);
    }

    /** Room availability = totalRooms - bookings that overlap the dates. */
    public List<RoomAvailability> getAvailability(Long hotelId, LocalDate checkIn, LocalDate checkOut) {
        if (!checkOut.isAfter(checkIn)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Check-out must be after check-in");
        }
        return getRooms(hotelId).stream()
                .map(r -> new RoomAvailability(r, availableCount(r, checkIn, checkOut)))
                .toList();
    }

    public long availableCount(Room room, LocalDate checkIn, LocalDate checkOut) {
        long taken = bookingRepository.countOverlapping(room.getId(), checkIn, checkOut);
        return Math.max(0, room.getTotalRooms() - taken);
    }

    public Room getById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Room not found"));
    }

    public Room addRoom(Long hotelId, Room data) {
        Hotel hotel = hotelService.getById(hotelId);
        data.setId(null);
        data.setHotel(hotel);
        return roomRepository.save(data);
    }

    public Room updateRoom(Long roomId, Room data) {
        Room room = getById(roomId);
        room.setRoomType(data.getRoomType());
        room.setPricePerNight(data.getPricePerNight());
        room.setCapacity(data.getCapacity());
        room.setTotalRooms(data.getTotalRooms());
        return roomRepository.save(room);
    }

    public void deleteRoom(Long roomId) {
        Room room = getById(roomId);
        if (bookingRepository.existsByRoomId(roomId)) {
            throw new ApiException(HttpStatus.CONFLICT, "This room already has bookings, so it cannot be deleted");
        }
        roomRepository.delete(room);
    }
}
