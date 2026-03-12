package com.ecommerce.backend.entity.product.variant;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import jakarta.persistence.Id;

@Entity
@Table(name = "rams")
@Data
public class Ram {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Dung lượng RAM không được để trống")
    private String ramSize; // VD: 8GB, 16GB, 32GB

    private String ramType; // VD: DDR4, DDR5
}