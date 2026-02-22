package com.garageos.backend.repository;

import com.garageos.backend.model.FleetServiceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
public interface FleetServiceHistoryRepository extends JpaRepository<FleetServiceHistory, Long> {}