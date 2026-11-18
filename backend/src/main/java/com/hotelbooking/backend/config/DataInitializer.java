package com.hotelbooking.backend.config;

import com.hotelbooking.backend.entity.*;
import com.hotelbooking.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Runs once when the app starts. If the tables are empty it adds:
 *  - an admin account  (admin@hotel.com / Admin@123)
 *  - a few sample hotels, rooms and travel packages
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final TravelPackageRepository packageRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, HotelRepository hotelRepository,
                           RoomRepository roomRepository, TravelPackageRepository packageRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
        this.packageRepository = packageRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@hotel.com")) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail("admin@hotel.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
        }

        if (hotelRepository.count() == 0) {
            Hotel h1 = hotel("Sea Breeze Resort", "Goa", "Calangute Beach Road, Goa",
                    "A beachfront resort with a pool, spa and sea-view rooms, a short walk from the sand.",
                    "https://picsum.photos/seed/seabreeze/800/500", 4.5);
            room(h1, "Standard", 3500.0, 2, 10);
            room(h1, "Deluxe Sea View", 5200.0, 3, 6);
            room(h1, "Suite", 8900.0, 4, 2);

            Hotel h2 = hotel("Pink City Palace Hotel", "Jaipur", "MI Road, Jaipur",
                    "A heritage-style hotel near the old city, with a rooftop restaurant and courtyard.",
                    "https://picsum.photos/seed/pinkcity/800/500", 4.3);
            room(h2, "Standard", 2800.0, 2, 12);
            room(h2, "Heritage Room", 4600.0, 3, 5);

            Hotel h3 = hotel("Hill View Inn", "Manali", "Mall Road, Manali",
                    "A cosy mountain stay with wood interiors, a fireplace lounge and valley views.",
                    "https://picsum.photos/seed/hillview/800/500", 4.1);
            room(h3, "Standard", 2200.0, 2, 8);
            room(h3, "Family Cottage", 5400.0, 5, 3);

            Hotel h4 = hotel("Marine Drive Grand", "Mumbai", "Marine Drive, Mumbai",
                    "A city hotel on the waterfront with a business lounge and airport pickup.",
                    "https://picsum.photos/seed/marinedrive/800/500", 4.4);
            room(h4, "Business Room", 6200.0, 2, 15);
            room(h4, "Executive Suite", 11500.0, 4, 3);
        }

        if (packageRepository.count() == 0) {
            pack("Goa Beach Escape", "Goa", 4, 18999.0,
                    "4 days with beachfront stay, airport transfers, sunset cruise and a North Goa day tour.",
                    "https://picsum.photos/seed/goapackage/800/500");
            pack("Royal Rajasthan Trail", "Jaipur - Jodhpur - Udaipur", 7, 36999.0,
                    "7 days across three cities with forts, palaces, a desert camp evening and guided tours.",
                    "https://picsum.photos/seed/rajasthan/800/500");
            pack("Manali Snow Getaway", "Manali", 5, 21999.0,
                    "5 days with Solang Valley, Rohtang pass visit (when open) and a cosy hill stay.",
                    "https://picsum.photos/seed/manali/800/500");
        }
    }

    private Hotel hotel(String name, String city, String address, String desc, String img, double rating) {
        Hotel h = new Hotel();
        h.setName(name);
        h.setCity(city);
        h.setAddress(address);
        h.setDescription(desc);
        h.setImageUrl(img);
        h.setRating(rating);
        return hotelRepository.save(h);
    }

    private void room(Hotel hotel, String type, double price, int capacity, int total) {
        Room r = new Room();
        r.setHotel(hotel);
        r.setRoomType(type);
        r.setPricePerNight(price);
        r.setCapacity(capacity);
        r.setTotalRooms(total);
        roomRepository.save(r);
    }

    private void pack(String title, String destination, int days, double price, String desc, String img) {
        TravelPackage p = new TravelPackage();
        p.setTitle(title);
        p.setDestination(destination);
        p.setDurationDays(days);
        p.setPrice(price);
        p.setDescription(desc);
        p.setImageUrl(img);
        packageRepository.save(p);
    }
}
