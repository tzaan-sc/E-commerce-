package com.ecommerce.backend.repository.product;

import com.ecommerce.backend.entity.product.variant.Gpu;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GpuRepository extends JpaRepository<Gpu, Long> {
}
