package com.garageos.backend.repository;

import com.garageos.backend.model.FleetVehicle;
import org.springframework.data.jpa.repository.JpaRepository;
public interface FleetVehicleRepository extends JpaRepository<FleetVehicle, Long> {}