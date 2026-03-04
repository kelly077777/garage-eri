package com.garageos.backend.repository;

import com.garageos.backend.model.ServiceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface ServiceHistoryRepository extends JpaRepository<ServiceHistory, Long> {
    List<ServiceHistory> findByVehicleId(Long vehicleId);
} 