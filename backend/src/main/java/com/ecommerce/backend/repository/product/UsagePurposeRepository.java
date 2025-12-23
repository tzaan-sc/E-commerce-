package com.ecommerce.backend.repository.product;

import com.ecommerce.backend.entity.product.UsagePurpose;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsagePurposeRepository extends JpaRepository<UsagePurpose, Long> {
    // Kiểm tra tên nhu cầu đã tồn tại chưa
    boolean existsByName(String name);
    Optional<UsagePurpose> findByName(String name);
}