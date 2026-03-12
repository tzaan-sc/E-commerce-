package com.ecommerce.backend.repository.product;

import com.ecommerce.backend.entity.product.variant.Chip;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChipRepository extends JpaRepository<Chip, Long> {
}
