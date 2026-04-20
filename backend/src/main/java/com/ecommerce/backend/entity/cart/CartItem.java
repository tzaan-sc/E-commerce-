package com.ecommerce.backend.entity.cart;

import com.ecommerce.backend.entity.auth.User;
import com.ecommerce.backend.entity.product.Product;
import com.ecommerce.backend.entity.product.ProductVariant;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // User có thể giữ LAZY
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // SỬA DÒNG NÀY:
    @ManyToOne(fetch = FetchType.EAGER) // <-- Đổi từ LAZY sang EAGER
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "variant_id", nullable = true) // Để true nếu có SP không có biến thể
    private ProductVariant variant;
    @Column(nullable = false)
    private Integer quantity = 1;
}