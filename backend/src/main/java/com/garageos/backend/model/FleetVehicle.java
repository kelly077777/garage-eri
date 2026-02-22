package com.garageos.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "fleet_vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FleetVehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Basic Info
    private String plate;
    private String make;
    private String model;
    private Integer year;
    private String color;
    private String vin;
    private String type;
    private Integer mileage;

    // Assigned Driver
    private String driverName;
    private String driverPhone;
    private String driverLicense;

    // Insurance & Documents
    private String insuranceCompany;
    private String insuranceNumber;
    private LocalDate insuranceExpiry;
    private LocalDate inspectionExpiry;

    @Enumerated(EnumType.STRING)
    private FleetStatus status = FleetStatus.Active;

    // Maintenance History
    @OneToMany(mappedBy = "fleetVehicle", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<FleetServiceHistory> serviceHistory;

    public enum FleetStatus {
        Active, In_Maintenance, Out_of_Service
    }
}