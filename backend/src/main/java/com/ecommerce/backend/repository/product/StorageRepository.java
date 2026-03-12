package com.ecommerce.backend.repository.product;

import com.ecommerce.backend.entity.product.variant.Storage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StorageRepository extends JpaRepository<Storage, Long> {
}
