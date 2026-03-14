package com.garageos.backend.repository;

import com.garageos.backend.model.GarageExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GarageExpenseRepository extends JpaRepository<GarageExpense, Long> {}  