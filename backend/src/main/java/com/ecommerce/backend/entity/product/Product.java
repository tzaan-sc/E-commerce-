package com.ecommerce.backend.entity.product;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

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

    @Column(nullable = false, length = 200)
    private String name;

    // THÊM SLUG - URL thân thiện SEO
    @Column(nullable = false, unique = true, length = 300)
    private String slug; // Ví dụ: "dell-xps-13-9310-i7-1165g7"

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer stockQuantity = 0;

    @Column(length = 500)
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id", nullable = true)
    private Brand brand;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usage_purpose_id", nullable = true)
    private UsagePurpose usagePurpose;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "screen_size_id", nullable = true)
    private ScreenSize screenSize;

//    @CreationTimestamp
//    private LocalDateTime createdAt;
//
//    @UpdateTimestamp
//    private LocalDateTime updatedAt;


//
//    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
//    private List<CartItem> cartItems;
//
//    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
//    private List<OrderDetail> orderDetails;
}