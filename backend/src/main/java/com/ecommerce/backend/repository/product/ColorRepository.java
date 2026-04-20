package com.ecommerce.backend.repository.product;
import com.ecommerce.backend.entity.product.variant.Color;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ColorRepository extends JpaRepository<Color, Long> {
    // Khớp với colorName trong Entity Color
    Optional<Color> findByColorName(String colorName);
}