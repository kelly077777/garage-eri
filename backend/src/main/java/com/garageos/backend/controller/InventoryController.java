package com.garageos.backend.controller;

import com.garageos.backend.model.InventoryItem;
import com.garageos.backend.repository.InventoryItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = {"http://localhost:5173", "https://inquisitive-kataifi-41bdfe.netlify.app"})
public class InventoryController {

    private final InventoryItemRepository inventoryRepo;

    public InventoryController(InventoryItemRepository inventoryRepo) {
        this.inventoryRepo = inventoryRepo;
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
}