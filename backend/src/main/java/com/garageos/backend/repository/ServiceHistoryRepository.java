package com.garageos.backend.repository;

import com.garageos.backend.model.ServiceHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceHistoryRepository extends JpaRepository<ServiceHistory, Long> {
}