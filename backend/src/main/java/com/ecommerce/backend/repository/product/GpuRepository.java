package com.ecommerce.backend.repository.product;
import com.ecommerce.backend.entity.product.variant.Gpu;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface GpuRepository extends JpaRepository<Gpu, Long> {
    // Khớp với gpuName trong Entity Gpu
    Optional<Gpu> findByGpuName(String gpuName);
}