package com.ecommerce.backend.repository.product;
import com.ecommerce.backend.entity.product.variant.Chip;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ChipRepository extends JpaRepository<Chip, Long> {
    // Khớp với cpuName trong Entity Chip
    Optional<Chip> findByCpuName(String cpuName);
}