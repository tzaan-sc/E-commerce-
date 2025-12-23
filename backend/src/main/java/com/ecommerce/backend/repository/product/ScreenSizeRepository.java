package com.ecommerce.backend.repository.product;

import com.ecommerce.backend.entity.product.ScreenSize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface ScreenSizeRepository extends JpaRepository<ScreenSize, Long> {
    // Phương thức tùy chỉnh để kiểm tra xem một ScreenSize có giá trị cụ thể đã tồn tại chưa
    boolean existsByValue(Double value);
    Optional<ScreenSize> findByValue(Double value);

}