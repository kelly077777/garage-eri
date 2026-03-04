package com.garageos.backend.controller;

import com.garageos.backend.model.*;
import com.garageos.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "https://inquisitive-kataifi-41bdfe.netlify.app"})
public class VehicleController {

    private final VehicleRepository vehicleRepo;
    private final ServiceHistoryRepository historyRepo;

    @GetMapping
    public List<Vehicle> getAll() {
        return vehicleRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getOne(@PathVariable Long id) {
        return vehicleRepo.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Vehicle create(@RequestBody Vehicle vehicle) {
        return vehicleRepo.save(vehicle);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> update(@PathVariable Long id, @RequestBody Vehicle updated) {
        return vehicleRepo.findById(id).map(v -> {
            updated.setId(id);
            return ResponseEntity.ok(vehicleRepo.save(updated));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        vehicleRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/history")
    public ResponseEntity<ServiceHistory> addHistory(
            @PathVariable Long id,
            @RequestBody ServiceHistory entry) {
        return vehicleRepo.findById(id).map(v -> {
            entry.setVehicle(v);
            return ResponseEntity.ok(historyRepo.save(entry));
        }).orElse(ResponseEntity.notFound().build());
    }
 @GetMapping("/{id}/history")
public List<ServiceHistory> getHistory(@PathVariable Long id) {
    return historyRepo.findByVehicleId(id);
}
}