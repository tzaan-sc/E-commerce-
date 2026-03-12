package com.ecommerce.backend.entity.product.variant;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import jakarta.persistence.Id;


@Entity
@Table(name = "gpus")
@Data
public class Gpu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Tên GPU không được để trống")
    private String gpuName; // VD: NVIDIA GeForce RTX 4060
}