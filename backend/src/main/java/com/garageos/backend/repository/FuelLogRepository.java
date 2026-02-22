package com.garageos.backend.repository;

import com.garageos.backend.model.FuelLog;
import org.springframework.data.jpa.repository.JpaRepository;
public interface FuelLogRepository extends JpaRepository<FuelLog, Long> {}