package com.ecommerce.backend.repository.product;

import com.ecommerce.backend.entity.product.ScreenSize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScreenSizeRepository extends JpaRepository<ScreenSize, Long> {
}
