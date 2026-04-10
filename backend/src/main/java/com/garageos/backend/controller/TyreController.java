package com.garageos.backend.controller;

import com.garageos.backend.model.Tyre;
import com.garageos.backend.model.TyreMovement;
import com.garageos.backend.repository.TyreRepository;
import com.garageos.backend.repository.TyreMovementRepository;
import com.garageos.backend.repository.FleetVehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tyres")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "https://inquisitive-kataifi-41bdfe.netlify.app"})
public class TyreController {

    private final TyreRepository tyreRepo;
    private final TyreMovementRepository movementRepo;
    private final FleetVehicleRepository fleetRepo;

    // Get all tyres
    @GetMapping
    public List<Tyre> getAll() { return tyreRepo.findAll(); }

    // Get single tyre
    @GetMapping("/{id}")
    public ResponseEntity<Tyre> getOne(@PathVariable Long id) {
        return tyreRepo.findById(id).map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // Register new tyre
    @PostMapping
    public Tyre create(@RequestBody Tyre tyre) {
        tyre.setStatus("New");
        tyre.setFleetVehicle(null);
        return tyreRepo.save(tyre);
    }

    // Update tyre basic info
    @PutMapping("/{id}")
    public ResponseEntity<Tyre> update(@PathVariable Long id, @RequestBody Tyre updated) {
        return tyreRepo.findById(id).map(t -> {
            updated.setId(id);
            updated.setStatus(t.getStatus());
            updated.setFleetVehicle(t.getFleetVehicle());
            return ResponseEntity.ok(tyreRepo.save(updated));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Delete tyre
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        tyreRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // ASSIGN tyre to vehicle
    @PostMapping("/{id}/assign")
    public ResponseEntity<Tyre> assign(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return tyreRepo.findById(id).map(tyre -> {
            Long vehicleId = Long.valueOf(body.get("vehicleId").toString());
            String position = body.get("position").toString();
            String doneBy = body.getOrDefault("doneBy", "").toString();
            String notes = body.getOrDefault("notes", "").toString();

            fleetRepo.findById(vehicleId).ifPresent(vehicle -> {
                // Log movement
                TyreMovement movement = new TyreMovement();
                movement.setTyreId(id);
                movement.setAction("ASSIGNED");
                movement.setToVehicle(vehicle.getPlate());
                movement.setToPosition(position);
                movement.setActionDate(LocalDate.now());
                movement.setReason("Tyre assigned to vehicle");
                movement.setDoneBy(doneBy);
                movement.setNotes(notes);
                movementRepo.save(movement);

                // Update tyre
                tyre.setFleetVehicle(vehicle);
                tyre.setPosition(position);
                tyre.setStatus("In_Use");
                tyre.setFittedDate(LocalDate.now());
            });

            return ResponseEntity.ok(tyreRepo.save(tyre));
        }).orElse(ResponseEntity.notFound().build());
    }

    // REMOVE tyre from vehicle
    @PostMapping("/{id}/remove")
    public ResponseEntity<Tyre> remove(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return tyreRepo.findById(id).map(tyre -> {
            String reason = body.get("reason").toString();
            String newStatus = body.getOrDefault("status", "Worn").toString();
            String doneBy = body.getOrDefault("doneBy", "").toString();
            String notes = body.getOrDefault("notes", "").toString();

            // Log movement
            TyreMovement movement = new TyreMovement();
            movement.setTyreId(id);
            movement.setAction("REMOVED");
            movement.setFromVehicle(tyre.getFleetVehicle()!=null?tyre.getFleetVehicle().getPlate():"");
            movement.setFromPosition(tyre.getPosition());
            movement.setActionDate(LocalDate.now());
            movement.setReason(reason);
            movement.setDoneBy(doneBy);
            movement.setNotes(notes);
            movementRepo.save(movement);

            // Update tyre
            tyre.setFleetVehicle(null);
            tyre.setPosition(null);
            tyre.setStatus(newStatus);
            tyre.setRemovedDate(LocalDate.now());
            tyre.setRemovedReason(reason);

            return ResponseEntity.ok(tyreRepo.save(tyre));
        }).orElse(ResponseEntity.notFound().build());
    }

    // MOVE tyre to another vehicle
    @PostMapping("/{id}/move")
    public ResponseEntity<Tyre> move(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return tyreRepo.findById(id).map(tyre -> {
            Long newVehicleId = Long.valueOf(body.get("vehicleId").toString());
            String newPosition = body.get("position").toString();
            String doneBy = body.getOrDefault("doneBy", "").toString();
            String notes = body.getOrDefault("notes", "").toString();

            fleetRepo.findById(newVehicleId).ifPresent(newVehicle -> {
                // Log movement
                TyreMovement movement = new TyreMovement();
                movement.setTyreId(id);
                movement.setAction("MOVED");
                movement.setFromVehicle(tyre.getFleetVehicle()!=null?tyre.getFleetVehicle().getPlate():"");
                movement.setFromPosition(tyre.getPosition());
                movement.setToVehicle(newVehicle.getPlate());
                movement.setToPosition(newPosition);
                movement.setActionDate(LocalDate.now());
                movement.setReason("Tyre moved to another vehicle");
                movement.setDoneBy(doneBy);
                movement.setNotes(notes);
                movementRepo.save(movement);

                // Update tyre
                tyre.setFleetVehicle(newVehicle);
                tyre.setPosition(newPosition);
                tyre.setStatus("In_Use");
            });

            return ResponseEntity.ok(tyreRepo.save(tyre));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DISPOSE tyre
    @PostMapping("/{id}/dispose")
    public ResponseEntity<Tyre> dispose(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return tyreRepo.findById(id).map(tyre -> {
            String reason = body.getOrDefault("reason", "End of life").toString();
            String doneBy = body.getOrDefault("doneBy", "").toString();

            TyreMovement movement = new TyreMovement();
            movement.setTyreId(id);
            movement.setAction("DISPOSED");
            movement.setFromVehicle(tyre.getFleetVehicle()!=null?tyre.getFleetVehicle().getPlate():"");
            movement.setActionDate(LocalDate.now());
            movement.setReason(reason);
            movement.setDoneBy(doneBy);
            movementRepo.save(movement);

            tyre.setStatus("Disposed");
            tyre.setFleetVehicle(null);
            tyre.setPosition(null);

            return ResponseEntity.ok(tyreRepo.save(tyre));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Get tyre movements history
    @GetMapping("/movements/{tyreId}")
    public List<TyreMovement> getMovements(@PathVariable Long tyreId) {
        return movementRepo.findByTyreId(tyreId);
    }

    // Get tyres by vehicle
    @GetMapping("/vehicle/{vehicleId}")
    public List<Tyre> getByVehicle(@PathVariable Long vehicleId) {
        return tyreRepo.findByFleetVehicleId(vehicleId);
    }
}