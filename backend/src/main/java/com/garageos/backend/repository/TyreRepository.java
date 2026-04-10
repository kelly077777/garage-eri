package com.garageos.backend.repository;

import com.garageos.backend.model.Tyre;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TyreRepository extends JpaRepository<Tyre, Long> {
    List<Tyre> findByFleetVehicleId(Long fleetVehicleId);
    List<Tyre> findByStatus(String status);
}