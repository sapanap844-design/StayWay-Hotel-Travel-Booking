package com.hotelbooking.backend.controller;

import com.hotelbooking.backend.entity.TravelPackage;
import com.hotelbooking.backend.service.TravelPackageService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/packages")
public class TravelPackageController {

    private final TravelPackageService service;

    public TravelPackageController(TravelPackageService service) {
        this.service = service;
    }

    @GetMapping
    public List<TravelPackage> all() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public TravelPackage one(@PathVariable Long id) {
        return service.getById(id);
    }
}
