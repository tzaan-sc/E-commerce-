package com.ecommerce.backend.repository.product;

import com.ecommerce.backend.entity.product.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

    // Lấy danh sách biến thể theo ID Sản phẩm
    List<ProductVariant> findByProductId(Long productId);

    // Kiểm tra trùng SKU khi Thêm mới
    boolean existsBySku(String sku);

    // Kiểm tra trùng SKU khi Cập nhật (trừ chính biến thể đang sửa)
    boolean existsBySkuAndIdNot(String sku, Long id);

    // Tìm theo SKU (Dùng cho import Excel hoặc tìm kiếm)
    Optional<ProductVariant> findBySku(String sku);
}