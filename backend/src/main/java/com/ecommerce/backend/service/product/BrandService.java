package com.ecommerce.backend.service.product;

import com.ecommerce.backend.entity.product.Brand;
import com.ecommerce.backend.dto.product.brand.CreateBrandRequest;
import com.ecommerce.backend.dto.product.brand.UpdateBrandRequest;
import java.util.List;

public interface BrandService {
    // Thêm Brand
    Brand createBrand(CreateBrandRequest request);

    // Chỉnh sửa Brand
    Brand updateBrand(UpdateBrandRequest request);

    // Xóa Brand theo ID
    void deleteBrand(Long brandId);

    // Lấy tất cả Brands (ví dụ)
    List<Brand> getAllBrands();

    // Lấy Brand theo ID (ví dụ)
    Brand getBrandById(Long brandId);
}