package com.hotelbooking.backend.repository;

import com.hotelbooking.backend.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface HotelRepository extends JpaRepository<Hotel, Long> {

    @Query("SELECT h FROM Hotel h WHERE LOWER(h.city) LIKE LOWER(CONCAT('%', :city, '%')) " +
           "AND LOWER(h.name) LIKE LOWER(CONCAT('%', :name, '%')) ORDER BY h.rating DESC")
    List<Hotel> search(@Param("city") String city, @Param("name") String name);
}
