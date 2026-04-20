package com.ecommerce.backend.repository.product;
import com.ecommerce.backend.entity.product.variant.Storage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StorageRepository extends JpaRepository<Storage, Long> {
    // Khớp với capacity trong Entity Storage
    Optional<Storage> findByCapacity(String capacity);
}