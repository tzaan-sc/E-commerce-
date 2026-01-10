package com.ecommerce.backend.repository.product;

import com.ecommerce.backend.entity.product.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional; // <--- Nhớ thêm import này

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

    // 1. Tìm biến thể bằng SKU (Cần thiết cho logic Dry Run)
    Optional<ProductVariant> findBySku(String sku);

    // 2. Tìm tất cả biến thể của 1 sản phẩm
    List<ProductVariant> findByProductId(Long productId);

    // 3. Kiểm tra trùng SKU
    boolean existsBySku(String sku);
}