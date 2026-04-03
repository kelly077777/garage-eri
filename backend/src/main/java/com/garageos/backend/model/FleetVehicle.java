package com.garageos.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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
    private String cardNumber;
    private String companyDepartment;

    // Assigned Driver
    private String driverName;
    private String driverPhone;
    private String driverLicense;

    // Insurance
    private String insuranceCompany;
    private String insuranceNumber;
    private LocalDate insuranceIssuedDate;
    private LocalDate insuranceExpiry;
    @Column(columnDefinition = "TEXT")
    private String insuranceFile;

    // Inspection
    private LocalDate inspectionIssuedDate;
    private LocalDate inspectionExpiry;
    @Column(columnDefinition = "TEXT")
    private String inspectionFile;

    // Speed Governor
    private LocalDate speedGovernorIssuedDate;
    private LocalDate speedGovernorExpiry;
    @Column(columnDefinition = "TEXT")
    private String speedGovernorFile;

    // Driver License
    private LocalDate driverLicenseIssuedDate;
    private LocalDate driverLicenseExpiry;
    @Column(columnDefinition = "TEXT")
    private String driverLicenseFile;

    // Yellow Card
    private LocalDate yellowCardIssuedDate;
    private LocalDate yellowCardExpiry;
    @Column(columnDefinition = "TEXT")
    private String yellowCardFile;

    @Enumerated(EnumType.STRING)
    private FleetStatus status = FleetStatus.Active;

    // Maintenance History
    @OneToMany(mappedBy = "fleetVehicle", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"fleetVehicle", "hibernateLazyInitializer", "handler"})
    private List<FleetServiceHistory> serviceHistory;

    public enum FleetStatus {
        Active, In_Maintenance, Out_of_Service
    }
}