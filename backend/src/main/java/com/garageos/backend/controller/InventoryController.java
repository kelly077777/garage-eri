package com.garageos.backend.controller;

import com.garageos.backend.model.InventoryItem;
import com.garageos.backend.repository.InventoryItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5174", "https://inquisitive-kataifi-41bdfe.netlify.app"})
public class InventoryController {

    private final InventoryItemRepository inventoryRepo;

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
    public ResponseEntity<InventoryItem> update(@PathVariable Long id, @RequestBody InventoryItem updated) {
        return inventoryRepo.findById(id).map(item -> {
            updated.setId(id);
            if (updated.getQuantity() <= 0) updated.setStatus(InventoryItem.ItemStatus.Out_of_Stock);
            else if (updated.getMinQuantity() != null && updated.getQuantity() <= updated.getMinQuantity()) updated.setStatus(InventoryItem.ItemStatus.Low_Stock);
            else updated.setStatus(InventoryItem.ItemStatus.In_Stock);
            return ResponseEntity.ok(inventoryRepo.save(updated));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        inventoryRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}