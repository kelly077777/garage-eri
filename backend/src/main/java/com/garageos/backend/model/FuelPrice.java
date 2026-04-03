package com.garageos.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "fuel_prices")
public class FuelPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fuelType;
    private Integer pricePerLiter;
    private LocalDate effectiveFrom;
    private LocalDate effectiveTo;

    public FuelPrice() {}

    public FuelPrice(String fuelType, Integer pricePerLiter, LocalDate effectiveFrom, LocalDate effectiveTo) {
        this.fuelType = fuelType;
        this.pricePerLiter = pricePerLiter;
        this.effectiveFrom = effectiveFrom;
        this.effectiveTo = effectiveTo;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFuelType() { return fuelType; }
    public void setFuelType(String fuelType) { this.fuelType = fuelType; }
    public Integer getPricePerLiter() { return pricePerLiter; }
    public void setPricePerLiter(Integer pricePerLiter) { this.pricePerLiter = pricePerLiter; }
    public LocalDate getEffectiveFrom() { return effectiveFrom; }
    public void setEffectiveFrom(LocalDate effectiveFrom) { this.effectiveFrom = effectiveFrom; }
    public LocalDate getEffectiveTo() { return effectiveTo; }
    public void setEffectiveTo(LocalDate effectiveTo) { this.effectiveTo = effectiveTo; }
}