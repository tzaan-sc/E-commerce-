package com.ecommerce.backend.repository.cart;

import com.ecommerce.backend.entity.cart.CartItem;
import com.ecommerce.backend.entity.auth.User;
import com.ecommerce.backend.entity.product.Product;
import com.ecommerce.backend.entity.product.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    // Truy vấn chuẩn xác: Phải có đủ User, Product và VariantId
    @Query("SELECT c FROM CartItem c WHERE c.user = :user AND c.product = :product AND c.variant = :variant")
    Optional<CartItem> findByUserAndProductAndVariant(User user, Product product, ProductVariant variant);

    List<CartItem> findAllByIdInAndUser(List<Long> ids, User user);
    List<CartItem> findByUser(User user);
    long countByUser(User user);
}
