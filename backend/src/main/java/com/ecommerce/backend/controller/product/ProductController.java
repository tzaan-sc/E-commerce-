package com.ecommerce.backend.controller.product;

import com.ecommerce.backend.dto.product.CreateProductRequest;
import com.ecommerce.backend.dto.product.UpdateProductRequest;
import com.ecommerce.backend.entity.product.Product;
import com.ecommerce.backend.service.product.impl.ProductServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin("*")
public class ProductController {

    @Autowired
    private ProductServiceImpl productService; // DÙNG TRỰC TIẾP IMPL

    @GetMapping
    public ResponseEntity<List<Product>> getAll() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateProductRequest request) {
        return ResponseEntity.ok(productService.createProduct(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody UpdateProductRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok("Đã xoá sản phẩm");
    }
    @GetMapping("/brand/{brandId}")
    public ResponseEntity<List<Product>> getProductsByBrand(@PathVariable Long brandId) {
        List<Product> products = productService.getProductsByBrand(brandId);
        return ResponseEntity.ok(products);
    }
    @GetMapping("/usage-purpose/{usagePurposeId}")
    public ResponseEntity<List<Product>> getProductsByUsagePurpose(@PathVariable Long usagePurposeId) {
        return ResponseEntity.ok(productService.getProductsByUsagePurpose(usagePurposeId));
    }
    // API: GET /api/products/filter?purpose=4&brand=2
    @GetMapping("/filter")
    public ResponseEntity<List<Product>> filterProducts(
            @RequestParam("purpose") Long purpose, // Phải khớp với chữ trong URL (?purpose=...)
            @RequestParam("brand") Long brand      // Phải khớp với chữ trong URL (&brand=...)
    ) {
        // Gọi service
        return ResponseEntity.ok(productService.filterProducts(purpose, brand));
    }
}
