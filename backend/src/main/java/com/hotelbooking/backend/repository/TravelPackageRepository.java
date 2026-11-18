package com.hotelbooking.backend.repository;

import com.hotelbooking.backend.entity.TravelPackage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TravelPackageRepository extends JpaRepository<TravelPackage, Long> {
}
