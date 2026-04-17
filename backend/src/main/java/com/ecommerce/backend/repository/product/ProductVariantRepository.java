package com.ecommerce.backend.repository.product;

import com.ecommerce.backend.entity.product.ProductVariant;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

    // ✅ Ép Hibernate lấy kèm RAM, Chip, GPU, Ảnh... khi tìm theo ProductId
    @EntityGraph(attributePaths = {"ram", "gpu", "chip", "storage", "color", "images"})
    List<ProductVariant> findByProductId(Long productId);

    // ✅ Ép lấy kèm chi tiết khi tìm tất cả (Dùng cho trang danh sách admin)
    @Override
    @EntityGraph(attributePaths = {"ram", "gpu", "chip", "storage", "color", "images"})
    List<ProductVariant> findAll();

    boolean existsBySku(String sku);

    boolean existsBySkuAndIdNot(String sku, Long id);

    Optional<ProductVariant> findBySku(String sku);
}