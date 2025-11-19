package com.ecommerce.backend.repository.cart;

import com.ecommerce.backend.entity.cart.CartItem;
import com.ecommerce.backend.entity.auth.User;
import com.ecommerce.backend.entity.product.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByUserAndProduct(User user, Product product);
    List<CartItem> findAllByIdInAndUser(List<Long> ids, User user);
    List<CartItem> findByUser(User user);
    long countByUser(User user);
}
