package com.ecommerce.backend.entity.product.variant;

import com.ecommerce.backend.entity.product.ProductVariant;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "variant_images")
@Data
public class VariantImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "variant_id") // Tên cột liên kết trong Database
    @JsonIgnore // Chống lỗi đệ quy JSON
    private ProductVariant productVariant;
}