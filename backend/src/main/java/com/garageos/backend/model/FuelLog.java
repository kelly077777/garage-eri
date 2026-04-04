package com.garageos.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "fuel_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FuelLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
@ManyToOne(fetch = FetchType.EAGER)
@JsonIgnoreProperties({"insuranceFile","inspectionFile","speedGovernorFile",
    "driverLicenseFile","yellowCardFile","serviceHistory",
    "hibernateLazyInitializer","handler"})
private FleetVehicle fleetVehicle;

    private LocalDate date;
    private Double liters;
    private Integer costPerLiter;
    private Integer totalCost;
    private Integer mileageAtFill;
    private String filledBy;
    private String station;
}