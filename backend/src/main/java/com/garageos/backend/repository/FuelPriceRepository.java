package com.garageos.backend.repository;

import com.garageos.backend.model.FuelPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface FuelPriceRepository extends JpaRepository<FuelPrice, Long> {
    List<FuelPrice> findByFuelTypeOrderByEffectiveFromDesc(String fuelType);
    Optional<FuelPrice> findByFuelTypeAndEffectiveToIsNull(String fuelType);
    Optional<FuelPrice> findByFuelTypeAndEffectiveFromLessThanEqualAndEffectiveToGreaterThanEqual(
        String fuelType, LocalDate date1, LocalDate date2);
    Optional<FuelPrice> findByFuelTypeAndEffectiveFromLessThanEqualAndEffectiveToIsNull(
        String fuelType, LocalDate date);
}