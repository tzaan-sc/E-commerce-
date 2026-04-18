package com.ecommerce.backend.entity.product;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity // 🔥 Đổi từ @Embeddable sang @Entity
@Table(name = "product_specifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSpecification {

    @Id
    private Long id; // ID này sẽ lấy từ Product sang

    private String resolution;
    private String refreshRate;
    private String panelType;
    private String battery;
    private String weight;
    private String os;
    private String wifi;
    private String bluetooth;

    @Column(columnDefinition = "TEXT")
    private String ports;

    @OneToOne
    @MapsId // 🔥 Ép ID của bảng này trùng với ID của Product
    @JoinColumn(name = "product_id")
    @JsonBackReference // Tránh vòng lặp vô tận khi render JSON
    @ToString.Exclude // Tránh lỗi log loop của Lombok
    private Product product;
}