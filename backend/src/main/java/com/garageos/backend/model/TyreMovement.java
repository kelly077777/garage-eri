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
    private String action; // ASSIGNED, REMOVED, MOVED, DISPOSED
    private String fromVehicle;
    private String toVehicle;
    private String fromPosition;
    private String toPosition;
    private LocalDate actionDate;
    private String reason;
    private String doneBy;
    private String notes;
}