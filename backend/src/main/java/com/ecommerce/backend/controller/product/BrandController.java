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
 @CrossOrigin(origins = "http://localhost:3000")
 public class BrandController {

     private final BrandService brandService;

     @PostMapping
     public ResponseEntity<Brand> createBrand(@Valid @RequestBody CreateBrandRequest request) {
         Brand newBrand = brandService.createBrand(request);
         return new ResponseEntity<>(newBrand, HttpStatus.CREATED);
     }

     @PutMapping("/{id}")
     public ResponseEntity<Brand> updateBrand(@PathVariable Long id,
                                              @Valid @RequestBody UpdateBrandRequest request) {
         Brand updatedBrand = brandService.updateBrand(id, request);
         return ResponseEntity.ok(updatedBrand);
     }

     @DeleteMapping("/{id}")
     public ResponseEntity<Void> deleteBrand(@PathVariable Long id) {
         brandService.deleteBrand(id);
         return ResponseEntity.noContent().build();
     }

     @GetMapping
     public ResponseEntity<List<Brand>> getAllBrands() {
         return ResponseEntity.ok(brandService.getAllBrands());
     }

     @GetMapping("/{id}")
     public ResponseEntity<Brand> getBrandById(@PathVariable Long id) {
         return ResponseEntity.ok(brandService.getBrandById(id));
     }
 }
