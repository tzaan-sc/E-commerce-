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
        return new ResponseEntity<>(newBrand, HttpStatus.CREATED); // Trả về 201 Created
    }

    // PUT: /api/brands
    @PutMapping
    public ResponseEntity<Brand> updateBrand(@Valid @RequestBody UpdateBrandRequest request) {
        Brand updatedBrand = brandService.updateBrand(request);
        return ResponseEntity.ok(updatedBrand); // Trả về 200 OK
    }

    // DELETE: /api/brands/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBrand(@PathVariable Long id) {
        brandService.deleteBrand(id);
        return ResponseEntity.ok("Brand với ID=" + id + " đã được xóa thành công."); // Trả về 200 OK
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