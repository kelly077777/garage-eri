package com.garageos.backend.controller;

import com.garageos.backend.model.*;
import com.garageos.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/fleet")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class FleetController {

    private final FleetVehicleRepository fleetRepo;
    private final FleetServiceHistoryRepository serviceRepo;
    private final FuelLogRepository fuelRepo;

    // ── Fleet Vehicles ──
    @GetMapping
    public List<FleetVehicle> getAll() { return fleetRepo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<FleetVehicle> getOne(@PathVariable Long id) {
        return fleetRepo.findById(id).map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public FleetVehicle create(@RequestBody FleetVehicle vehicle) {
        return fleetRepo.save(vehicle);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FleetVehicle> update(@PathVariable Long id, @RequestBody FleetVehicle updated) {
        return fleetRepo.findById(id).map(v -> {
            updated.setId(id);
            return ResponseEntity.ok(fleetRepo.save(updated));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        fleetRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // ── Service History ──
    @PostMapping("/{id}/service")
    public ResponseEntity<FleetServiceHistory> addService(
            @PathVariable Long id, @RequestBody FleetServiceHistory entry) {
        return fleetRepo.findById(id).map(v -> {
            entry.setFleetVehicle(v);
            return ResponseEntity.ok(serviceRepo.save(entry));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── Fuel Logs ──
    @PostMapping("/{id}/fuel")
    public ResponseEntity<FuelLog> addFuel(
            @PathVariable Long id, @RequestBody FuelLog log) {
        return fleetRepo.findById(id).map(v -> {
            log.setFleetVehicle(v);
            return ResponseEntity.ok(fuelRepo.save(log));
        }).orElse(ResponseEntity.notFound().build());
    }

   @GetMapping("/{id}/fuel")
public ResponseEntity<?> getFuel(@PathVariable Long id) {
    return fleetRepo.findById(id).map(v ->
        ResponseEntity.ok(fuelRepo.findAll().stream()
            .filter(f -> f.getFleetVehicle() != null && f.getFleetVehicle().getId().equals(id))
            .toList())
    ).orElse(ResponseEntity.notFound().build());
}

@GetMapping("/fuel/all")
public List<FuelLog> getAllFuelLogs() {
    return fuelRepo.findAll();
} 

}