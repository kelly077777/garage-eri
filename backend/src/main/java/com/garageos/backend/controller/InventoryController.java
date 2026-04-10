package com.garageos.backend.controller;

import com.garageos.backend.model.InventoryItem;
import com.garageos.backend.model.SparePartUsage;
import com.garageos.backend.repository.InventoryItemRepository;
import com.garageos.backend.repository.SparePartUsageRepository;
import com.garageos.backend.repository.FleetVehicleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = {"http://localhost:5173", "https://inquisitive-kataifi-41bdfe.netlify.app"})
public class InventoryController {

    private final InventoryItemRepository inventoryRepo;
    private final SparePartUsageRepository usageRepo;
    private final FleetVehicleRepository fleetRepo;

    public InventoryController(InventoryItemRepository inventoryRepo, SparePartUsageRepository usageRepo, FleetVehicleRepository fleetRepo) {
        this.inventoryRepo = inventoryRepo;
        this.usageRepo = usageRepo;
        this.fleetRepo = fleetRepo;
    }

    @GetMapping
    public List<InventoryItem> getAll() { return inventoryRepo.findAll(); }

    @PostMapping
    public InventoryItem create(@RequestBody InventoryItem item) {
        if (item.getQuantity() <= 0) item.setStatus(InventoryItem.ItemStatus.Out_of_Stock);
        else if (item.getMinQuantity() != null && item.getQuantity() <= item.getMinQuantity()) item.setStatus(InventoryItem.ItemStatus.Low_Stock);
        else item.setStatus(InventoryItem.ItemStatus.In_Stock);
        return inventoryRepo.save(item);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody InventoryItem item) {
        return inventoryRepo.findById(id).map(i -> {
            i.setName(item.getName());
            i.setCategory(item.getCategory());
            i.setQuantity(item.getQuantity());
            i.setMinQuantity(item.getMinQuantity());
            i.setUnitPrice(item.getUnitPrice());
            i.setUnit(item.getUnit());
            i.setSupplier(item.getSupplier());
            i.setLocation(item.getLocation());
            if (i.getQuantity() <= 0) i.setStatus(InventoryItem.ItemStatus.Out_of_Stock);
            else if (i.getMinQuantity() != null && i.getQuantity() <= i.getMinQuantity()) i.setStatus(InventoryItem.ItemStatus.Low_Stock);
            else i.setStatus(InventoryItem.ItemStatus.In_Stock);
            return ResponseEntity.ok(inventoryRepo.save(i));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        inventoryRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // Issue part to vehicle
    @PostMapping("/{id}/issue")
    public ResponseEntity<?> issuePart(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return inventoryRepo.findById(id).map(part -> {
            int quantity = Integer.parseInt(body.get("quantity").toString());

            if(part.getQuantity() < quantity) {
                return ResponseEntity.badRequest().body("Not enough stock. Available: " + part.getQuantity());
            }

            Long vehicleId = Long.valueOf(body.get("vehicleId").toString());
            String reason = body.getOrDefault("reason", "").toString();
            String doneBy = body.getOrDefault("doneBy", "").toString();
            String notes = body.getOrDefault("notes", "").toString();

            fleetRepo.findById(vehicleId).ifPresent(vehicle -> {
                SparePartUsage usage = new SparePartUsage();
                usage.setPartId(id);
                usage.setQuantity(quantity);
                usage.setUsedDate(LocalDate.now());
                usage.setReason(reason);
                usage.setDoneBy(doneBy);
                usage.setNotes(notes);
                usage.setFleetVehicle(vehicle);
                usageRepo.save(usage);

                part.setQuantity(part.getQuantity() - quantity);

                if(part.getQuantity() <= 0) {
                    part.setStatus(InventoryItem.ItemStatus.Out_of_Stock);
                } else if(part.getMinQuantity() != null && part.getQuantity() <= part.getMinQuantity()) {
                    part.setStatus(InventoryItem.ItemStatus.Low_Stock);
                } else {
                    part.setStatus(InventoryItem.ItemStatus.In_Stock);
                }
                inventoryRepo.save(part);
            });

            return ResponseEntity.ok(part);
        }).orElse(ResponseEntity.notFound().build());
    }

    // Get usage history for a part
    @GetMapping("/usage/{partId}")
    public List<SparePartUsage> getUsage(@PathVariable Long partId) {
        return usageRepo.findByPartId(partId);
    }

    // Get all parts used on a vehicle
    @GetMapping("/usage/vehicle/{vehicleId}")
    public List<SparePartUsage> getUsageByVehicle(@PathVariable Long vehicleId) {
        return usageRepo.findByFleetVehicleId(vehicleId);
    }
}