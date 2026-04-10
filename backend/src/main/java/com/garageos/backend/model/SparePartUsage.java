package com.garageos.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "spare_part_usage")
public class SparePartUsage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long partId;
    private Integer quantity;
    private LocalDate usedDate;
    private String reason;
    private String doneBy;
    private String notes;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fleet_vehicle_id")
    @JsonIgnoreProperties({"insuranceFile","inspectionFile","speedGovernorFile",
        "driverLicenseFile","yellowCardFile","serviceHistory",
        "hibernateLazyInitializer","handler"})
    private FleetVehicle fleetVehicle;
}