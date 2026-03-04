package com.garageos.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String plate;

    private String make, model, color, vin, type;
    private Integer year, mileage;
    private String ownerName, ownerPhone, ownerEmail, ownerCompany;

    @Enumerated(EnumType.STRING)
    private Status status = Status.Ready;

   @JsonIgnore
@OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
private List<ServiceHistory> history;

    public enum Status {
        Ready, In_Service, Awaiting_Parts, Completed
    }
}