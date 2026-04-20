package com.ecommerce.backend.repository.product;
import com.ecommerce.backend.entity.product.variant.Ram;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RamRepository extends JpaRepository<Ram, Long> {
    // Thêm dòng này để tìm theo ramSize trong Entity Ram của bạn
    Optional<Ram> findByRamSize(String ramSize);
}