package com.garageos.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "inventory_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category; // PART, TOOL, CONSUMABLE
    private String description;
    private Integer quantity;
    private Integer minQuantity; // alert threshold
    private Integer unitPrice;
    private String unit; // pcs, liters, kg, etc
    private String supplier;
    private String location; // shelf/bin location

    @Enumerated(EnumType.STRING)
    private ItemStatus status = ItemStatus.In_Stock;

    public enum ItemStatus {
        In_Stock, Low_Stock, Out_of_Stock
    }
}