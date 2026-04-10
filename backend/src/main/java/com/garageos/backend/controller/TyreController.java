package com.garageos.backend.controller;

import com.garageos.backend.model.Tyre;
import com.garageos.backend.model.TyreMovement;
import com.garageos.backend.repository.TyreRepository;
import com.garageos.backend.repository.TyreMovementRepository;
import com.garageos.backend.repository.FleetVehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/tyres")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "https://inquisitive-kataifi-41bdfe.netlify.app"})
public class TyreController {

    private final TyreRepository tyreRepo;
    private final TyreMovementRepository movementRepo;
    private final FleetVehicleRepository fleetRepo;

    @GetMapping
    public List<Tyre> getAll() { return tyreRepo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Tyre> getOne(@PathVariable Long id) {
        return tyreRepo.findById(id).map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Tyre create(@RequestBody Tyre tyre) {
        if(tyre.getFleetVehicle() != null && tyre.getFleetVehicle().getId() != null) {
            fleetRepo.findById(tyre.getFleetVehicle().getId())
                .ifPresent(tyre::setFleetVehicle);
        }
        return tyreRepo.save(tyre);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tyre> update(@PathVariable Long id, @RequestBody Tyre updated) {
        return tyreRepo.findById(id).map(t -> {
            updated.setId(id);
            if(updated.getFleetVehicle() != null && updated.getFleetVehicle().getId() != null) {
                fleetRepo.findById(updated.getFleetVehicle().getId())
                    .ifPresent(updated::setFleetVehicle);
            }
            return ResponseEntity.ok(tyreRepo.save(updated));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        tyreRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/vehicle/{vehicleId}")
    public List<Tyre> getByVehicle(@PathVariable Long vehicleId) {
        return tyreRepo.findByFleetVehicleId(vehicleId);
    }

    @GetMapping("/movements/{tyreId}")
    public List<TyreMovement> getMovements(@PathVariable Long tyreId) {
        return movementRepo.findByTyreId(tyreId);
    }

    @PostMapping("/movements")
    public TyreMovement addMovement(@RequestBody TyreMovement movement) {
        return movementRepo.save(movement);
    }
}