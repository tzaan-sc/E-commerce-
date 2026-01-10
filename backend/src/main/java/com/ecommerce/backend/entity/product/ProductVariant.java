package com.ecommerce.backend.entity.product;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_variants")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String sku;

    private Double price;

    // Giá nhập để tính giá trị tồn kho trong Excel
    private Double importPrice;

    @Column(name = "stock_quantity")
    @Builder.Default
    private Integer stockQuantity = 0;

    // --- CÁC TRƯỜNG CHI TIẾT ĐỂ XUẤT EXCEL ---
    private String ramCapacity;     // Ví dụ: 16GB
    private String storageCapacity; // Ví dụ: 512GB SSD
    private String color;           // Ví dụ: Space Gray

    @Column(columnDefinition = "TEXT")
    private String note;            // Ghi chú vị trí kho hoặc bảo hành

    private String image;

    @Version
    private Long version;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonBackReference
    @ToString.Exclude
    private Product product;
}