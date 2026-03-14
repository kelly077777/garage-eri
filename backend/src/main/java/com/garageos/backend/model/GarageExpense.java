package com.garageos.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "garage_expenses")
public class GarageExpense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String date;
    private String plate;
    private String assignment;  
    private String reason;
    private String domain;
    private Integer amount;
}