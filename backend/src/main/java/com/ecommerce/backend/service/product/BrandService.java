package com.ecommerce.backend.service.product;

import com.ecommerce.backend.entity.product.Brand;
import com.ecommerce.backend.dto.product.brand.CreateBrandRequest;
import com.ecommerce.backend.dto.product.brand.UpdateBrandRequest;

import java.util.List;

public interface BrandService {

    Brand createBrand(CreateBrandRequest request);

    Brand updateBrand(Long id, UpdateBrandRequest request); // <- phải có 2 tham số

    void deleteBrand(Long id);

    List<Brand> getAllBrands();

    Brand getBrandById(Long id);
}
