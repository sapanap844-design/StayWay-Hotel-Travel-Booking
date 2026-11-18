package com.hotelbooking.backend.controller;

import com.hotelbooking.backend.dto.BookingResponse;
import com.hotelbooking.backend.dto.DashboardStats;
import com.hotelbooking.backend.entity.Hotel;
import com.hotelbooking.backend.entity.Room;
import com.hotelbooking.backend.entity.TravelPackage;
import com.hotelbooking.backend.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/** Admin-only APIs. Every method first checks that the caller is an ADMIN. */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private static final String AUTH = "Authorization";

    private final AuthService authService;
    private final DashboardService dashboardService;
    private final HotelService hotelService;
    private final RoomService roomService;
    private final TravelPackageService packageService;
    private final BookingService bookingService;

    public AdminController(AuthService authService, DashboardService dashboardService,
                           HotelService hotelService, RoomService roomService,
                           TravelPackageService packageService, BookingService bookingService) {
        this.authService = authService;
        this.dashboardService = dashboardService;
        this.hotelService = hotelService;
        this.roomService = roomService;
        this.packageService = packageService;
        this.bookingService = bookingService;
    }

    // ---------- Dashboard ----------
    @GetMapping("/dashboard")
    public DashboardStats dashboard(@RequestHeader(value = AUTH, required = false) String auth) {
        authService.requireAdmin(auth);
        return dashboardService.getStats();
    }

    @GetMapping("/bookings")
    public List<BookingResponse> allBookings(@RequestHeader(value = AUTH, required = false) String auth) {
        authService.requireAdmin(auth);
        return bookingService.allBookings();
    }

    // ---------- Hotel management ----------
    @PostMapping("/hotels")
    public Hotel addHotel(@RequestHeader(value = AUTH, required = false) String auth,
                          @RequestBody Hotel hotel) {
        authService.requireAdmin(auth);
        return hotelService.create(hotel);
    }

    @PutMapping("/hotels/{id}")
    public Hotel updateHotel(@RequestHeader(value = AUTH, required = false) String auth,
                             @PathVariable Long id, @RequestBody Hotel hotel) {
        authService.requireAdmin(auth);
        return hotelService.update(id, hotel);
    }

    @DeleteMapping("/hotels/{id}")
    public ResponseEntity<Void> deleteHotel(@RequestHeader(value = AUTH, required = false) String auth,
                                            @PathVariable Long id) {
        authService.requireAdmin(auth);
        hotelService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ---------- Room management ----------
    @PostMapping("/hotels/{hotelId}/rooms")
    public Room addRoom(@RequestHeader(value = AUTH, required = false) String auth,
                        @PathVariable Long hotelId, @RequestBody Room room) {
        authService.requireAdmin(auth);
        return roomService.addRoom(hotelId, room);
    }

    @PutMapping("/rooms/{id}")
    public Room updateRoom(@RequestHeader(value = AUTH, required = false) String auth,
                           @PathVariable Long id, @RequestBody Room room) {
        authService.requireAdmin(auth);
        return roomService.updateRoom(id, room);
    }

    @DeleteMapping("/rooms/{id}")
    public ResponseEntity<Void> deleteRoom(@RequestHeader(value = AUTH, required = false) String auth,
                                           @PathVariable Long id) {
        authService.requireAdmin(auth);
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }

    // ---------- Travel package management ----------
    @PostMapping("/packages")
    public TravelPackage addPackage(@RequestHeader(value = AUTH, required = false) String auth,
                                    @RequestBody TravelPackage p) {
        authService.requireAdmin(auth);
        return packageService.create(p);
    }

    @PutMapping("/packages/{id}")
    public TravelPackage updatePackage(@RequestHeader(value = AUTH, required = false) String auth,
                                       @PathVariable Long id, @RequestBody TravelPackage p) {
        authService.requireAdmin(auth);
        return packageService.update(id, p);
    }

    @DeleteMapping("/packages/{id}")
    public ResponseEntity<Void> deletePackage(@RequestHeader(value = AUTH, required = false) String auth,
                                              @PathVariable Long id) {
        authService.requireAdmin(auth);
        packageService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
