package com.garageos.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name="audit_logs")
@Data
public class AuditLog {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    private String userName;
    private String userRole;
    private String action;
    private String moduleName;
    private String details;
    private String timestamp;
}