 package com.ecommerce.backend.service.product.impl;

 import com.ecommerce.backend.entity.product.Brand;
 import com.ecommerce.backend.dto.product.brand.CreateBrandRequest;
 import com.ecommerce.backend.dto.product.brand.UpdateBrandRequest;
 import com.ecommerce.backend.repository.product.BrandRepository;
 import com.ecommerce.backend.service.product.BrandService;
 import lombok.RequiredArgsConstructor;
 import org.springframework.stereotype.Service;

 import java.util.List;

 @Service
 @RequiredArgsConstructor
 public class BrandServiceImpl implements BrandService {

     private final BrandRepository brandRepository;

     @Override
     public Brand createBrand(CreateBrandRequest request) {
         Brand brand = new Brand();
         brand.setName(request.getName());
         brand.setLogoUrl(request.getLogoUrl()); // PHẢI set logoUrl
         return brandRepository.save(brand);
     }

     @Override
     public Brand updateBrand(Long id, UpdateBrandRequest request) {
         Brand brand = brandRepository.findById(id)
                 .orElseThrow(() -> new RuntimeException("Brand không tồn tại"));
         brand.setName(request.getName());
         brand.setLogoUrl(request.getLogoUrl());
         // cập nhật các trường khác nếu có
         return brandRepository.save(brand);
     }

     @Override
     public void deleteBrand(Long id) {
         brandRepository.deleteById(id);
     }

     @Override
     public List<Brand> getAllBrands() {
         return brandRepository.findAll();
     }

     @Override
     public Brand getBrandById(Long id) {
         return brandRepository.findById(id)
                 .orElseThrow(() -> new RuntimeException("Brand không tồn tại"));
     }
 }
