package com.garageos.backend.controller;

import com.garageos.backend.model.GarageExpense;
import com.garageos.backend.repository.GarageExpenseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = {"http://localhost:5173", "https://inquisitive-kataifi-41bdfe.netlify.app"})
public class ExpenseController {

    private final GarageExpenseRepository repo;

    public ExpenseController(GarageExpenseRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<GarageExpense> getAll() { return repo.findAll(); }

    @PostMapping
    public GarageExpense create(@RequestBody GarageExpense expense) { return repo.save(expense); }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody GarageExpense expense) {
        return repo.findById(id).map(e -> {
            e.setDate(expense.getDate());
            e.setPlate(expense.getPlate());
            e.setReason(expense.getReason());
            e.setAmount(expense.getAmount());
            e.setAssignment(expense.getAssignment());
            return ResponseEntity.ok(repo.save(e));
        }).orElse(ResponseEntity.notFound().build());
    }
}