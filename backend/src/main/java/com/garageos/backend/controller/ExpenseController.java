package com.garageos.backend.controller;

import com.garageos.backend.model.GarageExpense;
import com.garageos.backend.repository.GarageExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = {"http://localhost:5173", "https://inquisitive-kataifi-41bdfe.netlify.app"})
@RequiredArgsConstructor
public class ExpenseController {
    private final GarageExpenseRepository repo;

    @GetMapping
    public List<GarageExpense> getAll() { return repo.findAll(); }

    @PostMapping
    public GarageExpense create(@RequestBody GarageExpense expense) { return repo.save(expense); }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}