//package com.ecommerce.backend.entity.product;
//
//import jakarta.persistence.*;
//import lombok.*;
//import org.hibernate.annotations.CreationTimestamp;
//import org.hibernate.annotations.UpdateTimestamp;
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "products")
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class Product {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(nullable = false, length = 200)
//    private String name;
//
//    // THÊM SLUG - URL thân thiện SEO
//    @Column(nullable = false, unique = true, length = 300)
//    private String slug; // Ví dụ: "dell-xps-13-9310-i7-1165g7"
//
//    @Column(columnDefinition = "TEXT")
//    private String description;
//
//    @Column(nullable = false)
//    private Double price;
//
//    @Column(nullable = false)
//    private Integer stockQuantity = 0;
//
//    @Column(length = 500)
//    private String imageUrl;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "brand_id", nullable = true)
//    private Brand brand;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "usage_purpose_id", nullable = true)
//    private UsagePurpose usagePurpose;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "screen_size_id", nullable = true)
//    private ScreenSize screenSize;
//
//////    @CreationTimestamp
//////    private LocalDateTime createdAt;
//////
//////    @UpdateTimestamp
//////    private LocalDateTime updatedAt;
////
////
//////
//////    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
//////    private List<CartItem> cartItems;
//////
//////    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
//////    private List<OrderDetail> orderDetails;
//}
package com.ecommerce.backend.entity.product;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
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

    // ✅ QUAN TRỌNG: Chỉ định rõ tên cột trong database
    @Column(name = "imageUrl", length = 500)
    // HOẶC nếu database dùng snake_case:
    // @Column(name = "image_url", length = 500)
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference // Parent: Quản lý vòng lặp JSON
    private List<ImageProduct> images = new ArrayList<>();

    @Column(name = "specifications", columnDefinition = "TEXT")
    private String specifications;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "brand_id", nullable = true)
    @JsonIgnoreProperties({"products"})
    private Brand brand;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usage_purpose_id", nullable = true)
    @JsonIgnoreProperties({"products"})
    private UsagePurpose usagePurpose;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "screen_size_id", nullable = true)
    @JsonIgnoreProperties({"products"})
    private ScreenSize screenSize;

}