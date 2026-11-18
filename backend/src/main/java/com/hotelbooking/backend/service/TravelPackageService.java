package com.hotelbooking.backend.service;

import com.hotelbooking.backend.entity.TravelPackage;
import com.hotelbooking.backend.exception.ApiException;
import com.hotelbooking.backend.repository.TravelPackageRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TravelPackageService {

    private final TravelPackageRepository repository;

    public TravelPackageService(TravelPackageRepository repository) {
        this.repository = repository;
    }

    public List<TravelPackage> findAll() {
        return repository.findAll();
    }

    public TravelPackage getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Package not found"));
    }

    public TravelPackage create(TravelPackage p) {
        p.setId(null);
        return repository.save(p);
    }

    public TravelPackage update(Long id, TravelPackage data) {
        TravelPackage p = getById(id);
        p.setTitle(data.getTitle());
        p.setDestination(data.getDestination());
        p.setDescription(data.getDescription());
        p.setPrice(data.getPrice());
        p.setDurationDays(data.getDurationDays());
        p.setImageUrl(data.getImageUrl());
        return repository.save(p);
    }

    public void delete(Long id) {
        repository.delete(getById(id));
    }
}
