package com.garageos.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "tyres")
public class Tyre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String serialNumber;
    private String brand;
    private String size;
    private String type;
    private String status; // New, In_Use, Worn, Damaged, Disposed
    private String condition; // Good, Fair, Poor
    private LocalDate purchaseDate;
    private Double purchasePrice;
    private String position; // Front_Left, Front_Right, Rear_Left, Rear_Right, Spare
    private String notes;
    private LocalDate fittedDate;
    private LocalDate removedDate;
    private String removedReason;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fleet_vehicle_id")
    @JsonIgnoreProperties({"insuranceFile","inspectionFile","speedGovernorFile",
        "driverLicenseFile","yellowCardFile","serviceHistory",
        "hibernateLazyInitializer","handler"})
    private FleetVehicle fleetVehicle;
}