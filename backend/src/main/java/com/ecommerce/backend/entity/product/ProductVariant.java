package com.ecommerce.backend.entity.product;

import com.ecommerce.backend.entity.product.variant.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

@Entity
@Table(name = "product_variants")
@Data
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "SKU không được để trống")
    @Column(unique = true)
    private String sku;

    @NotNull(message = "Giá không được để trống")
    @PositiveOrZero
    private Double price;

    @NotNull(message = "Số lượng không được để trống")
    @Min(0)
    private Integer stockQuantity;

    private Boolean isActive = true;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    // Cấu hình chi tiết
    @ManyToOne @JoinColumn(name = "ram_id") private Ram ram;
    @ManyToOne @JoinColumn(name = "gpu_id") private Gpu gpu;
    @ManyToOne @JoinColumn(name = "chip_id") private Chip chip;
    @ManyToOne @JoinColumn(name = "storage_id") private Storage storage;
    @ManyToOne @JoinColumn(name = "color_id") private Color color;
}