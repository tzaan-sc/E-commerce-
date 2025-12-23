package com.ecommerce.backend.entity.product;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_images") // Tên bảng trong Database
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImageProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 255)
    private String name; // Tên ảnh (ví dụ: "Ảnh mặt trước")

    @Column(name = "url_image", length = 500, nullable = false)
    private String urlImage; // Đường dẫn ảnh

    // Quan hệ N-1 về Product
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonBackReference // Ngắt vòng lặp JSON (cặp với @JsonManagedReference bên Product)
    private Product product;
}