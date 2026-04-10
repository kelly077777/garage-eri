package com.garageos.backend.repository;

import com.garageos.backend.model.TyreMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TyreMovementRepository extends JpaRepository<TyreMovement, Long> {
    List<TyreMovement> findByTyreId(Long tyreId);
}
