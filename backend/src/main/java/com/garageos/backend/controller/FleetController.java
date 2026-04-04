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
@CrossOrigin(origins = {"http://localhost:5173", "https://inquisitive-kataifi-41bdfe.netlify.app"})
public class FleetController {

    private final FleetVehicleRepository fleetRepo;
    private final FleetServiceHistoryRepository serviceRepo;
    private final FuelLogRepository fuelRepo;

    // ── Fleet Vehicles ──
  
    @GetMapping
public List<Map<String, Object>> getAll() {
    return fleetRepo.findAll().stream().map(v -> {
        Map<String, Object> m = new java.util.HashMap<>();
        m.put("id", v.getId());
        m.put("plate", v.getPlate());
        m.put("make", v.getMake());
        m.put("model", v.getModel());
        m.put("year", v.getYear());
        m.put("color", v.getColor());
        m.put("type", v.getType());
        m.put("status", v.getStatus());
        m.put("mileage", v.getMileage());
        m.put("driverName", v.getDriverName());
        m.put("driverPhone", v.getDriverPhone());
        m.put("cardNumber", v.getCardNumber());
        m.put("companyDepartment", v.getCompanyDepartment());
        m.put("insuranceExpiry", v.getInsuranceExpiry());
        m.put("inspectionExpiry", v.getInspectionExpiry());
        m.put("speedGovernorExpiry", v.getSpeedGovernorExpiry());
        m.put("driverLicenseExpiry", v.getDriverLicenseExpiry());
        m.put("insuranceCompany", v.getInsuranceCompany());
        m.put("insuranceNumber", v.getInsuranceNumber());
        return m;
    }).collect(java.util.stream.Collectors.toList());
}

   
    @GetMapping("/{id}")
public ResponseEntity<Map<String, Object>> getOne(@PathVariable Long id) {
    return fleetRepo.findById(id).map(v -> {
        Map<String, Object> m = new java.util.HashMap<>();
        m.put("id", v.getId());
        m.put("plate", v.getPlate());
        m.put("make", v.getMake());
        m.put("model", v.getModel());
        m.put("insuranceFile", v.getInsuranceFile());
        m.put("inspectionFile", v.getInspectionFile());
        m.put("speedGovernorFile", v.getSpeedGovernorFile());
        m.put("driverLicenseFile", v.getDriverLicenseFile());
        m.put("yellowCardFile", v.getYellowCardFile());
        m.put("insuranceExpiry", v.getInsuranceExpiry());
        m.put("inspectionExpiry", v.getInspectionExpiry());
        m.put("speedGovernorExpiry", v.getSpeedGovernorExpiry());
        m.put("driverLicenseExpiry", v.getDriverLicenseExpiry());
        m.put("insuranceCompany", v.getInsuranceCompany());
        m.put("insuranceNumber", v.getInsuranceNumber());
        m.put("driverName", v.getDriverName());
        m.put("driverPhone", v.getDriverPhone());
        return ResponseEntity.ok(m);
    }).orElse(ResponseEntity.notFound().build());
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
    // Update fuel log
@PutMapping("/{id}/fuel/{fuelId}")
public ResponseEntity<?> updateFuel(
        @PathVariable Long id,
        @PathVariable Long fuelId,
        @RequestBody FuelLog log) {
    return fuelRepo.findById(fuelId).map(existing -> {
        existing.setDate(log.getDate());
        existing.setLiters(log.getLiters());
        existing.setCostPerLiter(log.getCostPerLiter());
        existing.setTotalCost(log.getTotalCost());
        existing.setMileageAtFill(log.getMileageAtFill());
        existing.setStation(log.getStation());
        existing.setFilledBy(log.getFilledBy());
        return ResponseEntity.ok(fuelRepo.save(existing));
    }).orElse(ResponseEntity.notFound().build());
}

// Delete fuel log
@DeleteMapping("/{id}/fuel/{fuelId}")
public ResponseEntity<?> deleteFuel(
        @PathVariable Long id,
        @PathVariable Long fuelId) {
    fuelRepo.deleteById(fuelId);
    return ResponseEntity.ok().build(); 

} 


} 

