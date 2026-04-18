package com.ecommerce.backend.entity.product;

import com.ecommerce.backend.entity.promotion.Promotion;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.util.List;
import java.util.ArrayList;
import com.fasterxml.jackson.annotation.JsonManagedReference;
@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, unique = true, length = 300)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer stockQuantity = 0;

    private String status = "ACTIVE";

    // --- LIÊN KẾT BẢNG KHUYẾN MÃI ---

    @ManyToOne
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;

    // Thông số kỹ thuật (Lưu dưới dạng Embeddable hoặc JSON)
    @OneToOne(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private ProductSpecification specification;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<ProductVariant> variants;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    @Builder.Default
    private List<ImageProduct> images = new ArrayList<>();

    // 👇 BẠN HÃY THÊM DÒNG NÀY VÀO ĐÂY
    private String imageUrl;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "brand_id")
    @JsonIgnoreProperties({"products"})
    private Brand brand;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usage_purpose_id")
    private UsagePurpose usagePurpose;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "screen_size_id")
    private ScreenSize screenSize;
}