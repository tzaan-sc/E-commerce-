package com.ecommerce.backend.repository.product;

import com.ecommerce.backend.entity.product.UsagePurpose;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsagePurposeRepository extends JpaRepository<UsagePurpose, Long> {
    boolean existsByName(String name);
}
