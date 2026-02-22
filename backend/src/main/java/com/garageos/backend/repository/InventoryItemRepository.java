package com.garageos.backend.repository;

import com.garageos.backend.model.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {}