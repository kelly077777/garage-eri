package com.garageos.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fleet_vehicle_id")
    private FleetVehicle fleetVehicle;

    private LocalDate date;
    private Double liters;
    private Integer costPerLiter;
    private Integer totalCost;
    private Integer mileageAtFill;
    private String filledBy;
    private String station;
}