package com.garageos.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "tyre_movements")
public class TyreMovement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long tyreId;
    private String fromVehicle;
    private String toVehicle;
    private LocalDate movedDate;
    private String reason;
    private String movedBy;
    private String notes;
}