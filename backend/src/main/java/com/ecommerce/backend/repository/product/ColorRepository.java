package com.ecommerce.backend.repository.product;

import com.ecommerce.backend.entity.product.variant.Color;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ColorRepository extends JpaRepository<Color, Long> {
}
