package com.ecommerce.backend.entity.product.variant;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import jakarta.persistence.Id;

@Entity
@Table(name = "storages")
@Data
public class Storage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String capacity;    // VD: 512, 1024
    private String storageType; // VD: SSD, HDD

    // Hàm này giúp khớp với storageDisplay ở Frontend
    public String getStorageDisplay() {
        return capacity + " " + storageType;
    }
}