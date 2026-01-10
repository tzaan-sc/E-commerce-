package com.ecommerce.backend.service.product;

import com.ecommerce.backend.dto.product.ProductVariantDTO;
import java.util.List;

public interface ProductVariantService {
    // 1. Lấy tất cả biến thể (Cho trang Kho)
    List<ProductVariantDTO> getAllVariants();

    // 2. Lấy biến thể theo ID Sản phẩm (Cho trang Quản lý SP)
    List<ProductVariantDTO> getVariantsByProduct(Long productId);

    // 3. Tạo mới hoặc Cập nhật
    ProductVariantDTO saveVariant(ProductVariantDTO dto);

    // 4. Xóa biến thể
    void deleteVariant(Long id);
}