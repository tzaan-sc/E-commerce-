package com.ecommerce.backend.entity.cart;

import com.ecommerce.backend.entity.auth.User;
import com.ecommerce.backend.entity.product.Product;
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

    @Column(nullable = false)
    private Integer quantity = 1;
}