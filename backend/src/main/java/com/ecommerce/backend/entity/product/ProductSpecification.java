package com.ecommerce.backend.entity.product;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "product_specifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSpecification {
    @Id
    private Long id; // ID này sẽ trùng với Product ID (Shared Primary Key)

    @OneToOne
    @MapsId
    @JoinColumn(name = "product_id")
    @JsonBackReference // Tránh vòng lặp vô hạn khi xuất JSON
    private Product product;

    @Column(length = 255)
    private String cpu;

    @Column(length = 255)
    private String vga;

    @Column(name = "screen_detail", columnDefinition = "TEXT")
    private String screenDetail;

    @Column(length = 100)
    private String resolution;

    @Column(name = "storage_type", length = 100)
    private String storageType;

    @Column(columnDefinition = "TEXT")
    private String otherSpecs; // Các thông số phụ khác
}