package com.hotelbooking.backend.controller;

import com.hotelbooking.backend.dto.RoomAvailability;
import com.hotelbooking.backend.entity.Hotel;
import com.hotelbooking.backend.entity.Room;
import com.hotelbooking.backend.service.HotelService;
import com.hotelbooking.backend.service.RoomService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

/** Public APIs: anyone can search hotels, see details and room availability. */
@RestController
@RequestMapping("/api/hotels")
public class HotelController {

    private final HotelService hotelService;
    private final RoomService roomService;

    public HotelController(HotelService hotelService, RoomService roomService) {
        this.hotelService = hotelService;
        this.roomService = roomService;
    }

    // GET /api/hotels?city=Goa&name=
    @GetMapping
    public List<Hotel> search(@RequestParam(defaultValue = "") String city,
                              @RequestParam(defaultValue = "") String name) {
        return hotelService.search(city, name);
    }

    @GetMapping("/{id}")
    public Hotel details(@PathVariable Long id) {
        return hotelService.getById(id);
    }

    @GetMapping("/{id}/rooms")
    public List<Room> rooms(@PathVariable Long id) {
        return roomService.getRooms(id);
    }

    // GET /api/hotels/1/availability?checkIn=2026-12-01&checkOut=2026-12-04
    @GetMapping("/{id}/availability")
    public List<RoomAvailability> availability(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        return roomService.getAvailability(id, checkIn, checkOut);
    }
}
