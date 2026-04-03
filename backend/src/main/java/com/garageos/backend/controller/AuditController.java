package com.garageos.backend.controller;

import com.garageos.backend.model.AuditLog;
import com.garageos.backend.repository.AuditLogRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/audit")
@CrossOrigin(origins = {"http://localhost:5173", "https://inquisitive-kataifi-41bdfe.netlify.app"})
public class AuditController {

    private final AuditLogRepository repo;

    public AuditController(AuditLogRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<AuditLog> getAll() { return repo.findAll(); }

    @PostMapping
    public AuditLog create(@RequestBody AuditLog log) { return repo.save(log); }
}