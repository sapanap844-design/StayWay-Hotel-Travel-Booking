package com.hotelbooking.backend.repository;

import com.hotelbooking.backend.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByHotelId(Long hotelId);
    void deleteByHotelId(Long hotelId);
}
