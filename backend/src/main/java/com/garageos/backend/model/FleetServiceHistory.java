package com.garageos.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "fleet_service_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FleetServiceHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fleet_vehicle_id")
    private FleetVehicle fleetVehicle;

    private LocalDate date;
    private String type;
    private String description;
    private Integer cost;
    private String mechanic;
    private Integer mileageAtService;

    @ElementCollection
    private List<String> parts;
}