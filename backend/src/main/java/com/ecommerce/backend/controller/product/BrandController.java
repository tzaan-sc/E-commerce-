package com.ecommerce.backend.controller.product;

import com.ecommerce.backend.entity.product.Brand;
import com.ecommerce.backend.dto.product.brand.CreateBrandRequest;
import com.ecommerce.backend.dto.product.brand.UpdateBrandRequest;
import com.ecommerce.backend.service.product.BrandService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
@RequiredArgsConstructor
public class BrandController {

    private final BrandService brandService;

    // POST: /api/brands
    @PostMapping
    public ResponseEntity<Brand> createBrand(@Valid @RequestBody CreateBrandRequest request) {
        Brand newBrand = brandService.createBrand(request);
        return new ResponseEntity<>(newBrand, HttpStatus.CREATED);
    }

    // ✅ FIX: Sửa lại cấu trúc PUT
    // PUT: /api/brands/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Brand> updateBrand(
            @PathVariable Long id,
            @Valid @RequestBody UpdateBrandRequest request) {

        // 💡 Giữ lại dòng gán ID để đảm bảo DTO Validation (UpdateBrandRequest) thành công
        request.setId(id);

        // BrandService.updateBrand(request) giữ nguyên logic cũ.
        Brand updatedBrand = brandService.updateBrand(request);
        return ResponseEntity.ok(updatedBrand);
    }

    // DELETE: /api/brands/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBrand(@PathVariable Long id) {
        brandService.deleteBrand(id);
        return ResponseEntity.noContent().build(); // Đồng bộ với UsagePurposeController (204 No Content)
    }

    // GET: /api/brands
    @GetMapping
    public ResponseEntity<List<Brand>> getAllBrands() {
        List<Brand> brands = brandService.getAllBrands();
        return ResponseEntity.ok(brands);
    }

    // GET: /api/brands/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Brand> getBrandById(@PathVariable Long id) {
        Brand brand = brandService.getBrandById(id);
        return ResponseEntity.ok(brand);
    }
}