package com.ecommerce.backend.repository.product;

import com.ecommerce.backend.entity.product.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> { }
