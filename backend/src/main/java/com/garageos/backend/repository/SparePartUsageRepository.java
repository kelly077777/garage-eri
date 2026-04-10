package com.garageos.backend.repository;

import com.garageos.backend.model.SparePartUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SparePartUsageRepository extends JpaRepository<SparePartUsage, Long> {
    List<SparePartUsage> findByPartId(Long partId);
    List<SparePartUsage> findByFleetVehicleId(Long fleetVehicleId);
}