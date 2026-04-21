package com.ecommerce.backend.entity.product;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_name")
    private String productName;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "price")
    private Double price;

    @Column(name = "original_price")
    private Double originalPrice; // Giá gốc ban đầu

    @Column(name = "discount_amount")
    private Double discountAmount; // Số tiền được giảm

    @Column(name = "promotion_name")
    private String promotionName; // Tên nội dung khuyến mãi

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonBackReference
    @ToString.Exclude
    private Order order;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = true) // Sẽ tốt hơn nếu là `nullable = false`
    private Product product;
    @ManyToOne
    @JoinColumn(name = "variant_id") // Tên cột trong Database
    private ProductVariant variant;
}