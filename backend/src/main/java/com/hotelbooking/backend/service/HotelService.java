package com.hotelbooking.backend.service;

import com.hotelbooking.backend.entity.Hotel;
import com.hotelbooking.backend.entity.Room;
import com.hotelbooking.backend.exception.ApiException;
import com.hotelbooking.backend.repository.BookingRepository;
import com.hotelbooking.backend.repository.HotelRepository;
import com.hotelbooking.backend.repository.RoomRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class HotelService {

    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;

    public HotelService(HotelRepository hotelRepository, RoomRepository roomRepository,
                        BookingRepository bookingRepository) {
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
    }

    public List<Hotel> search(String city, String name) {
        return hotelRepository.search(city, name);
    }

    public Hotel getById(Long id) {
        return hotelRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Hotel not found"));
    }

    public Hotel create(Hotel hotel) {
        hotel.setId(null);
        return hotelRepository.save(hotel);
    }

    public Hotel update(Long id, Hotel data) {
        Hotel hotel = getById(id);
        hotel.setName(data.getName());
        hotel.setCity(data.getCity());
        hotel.setAddress(data.getAddress());
        hotel.setDescription(data.getDescription());
        hotel.setImageUrl(data.getImageUrl());
        hotel.setRating(data.getRating());
        return hotelRepository.save(hotel);
    }

    @Transactional
    public void delete(Long id) {
        Hotel hotel = getById(id);
        List<Room> rooms = roomRepository.findByHotelId(id);
        for (Room r : rooms) {
            if (bookingRepository.existsByRoomId(r.getId())) {
                throw new ApiException(HttpStatus.CONFLICT,
                        "This hotel already has bookings, so it cannot be deleted");
            }
        }
        roomRepository.deleteAll(rooms);
        hotelRepository.delete(hotel);
    }
}
