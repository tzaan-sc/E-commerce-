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

    // 1. GET ALL
    @GetMapping
    public ResponseEntity<List<Product>> getAll() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // 2. TÌM KIẾM THEO TỪ KHÓA (NEW - ĐƯA LÊN TRƯỚC {id})
    // GET /api/products/search?keyword=dell
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(
            @RequestParam("keyword") String keyword
    ) {
        List<Product> products = productService.searchProducts(keyword);
        return ResponseEntity.ok(products);
    }

    // 3. GET BY ID (CŨ - BÂY GIỜ ĐÃ NẰM DƯỚI /search VÀ KHÔNG GÂY XUNG ĐỘT)
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    // 4. POST
    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateProductRequest request) {
        return ResponseEntity.ok(productService.createProduct(request));
    }

    // 5. PUT
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody UpdateProductRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    // 6. DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok("Đã xoá sản phẩm");
    }

    // 7. GET BY BRAND ID
    @GetMapping("/brand/{brandId}")
    public ResponseEntity<List<Product>> getProductsByBrand(@PathVariable Long brandId) {
        List<Product> products = productService.getProductsByBrand(brandId);
        return ResponseEntity.ok(products);
    }

    // 8. GET BY USAGE PURPOSE ID
    @GetMapping("/usage-purpose/{usagePurposeId}")
    public ResponseEntity<List<Product>> getProductsByUsagePurpose(@PathVariable Long usagePurposeId) {
        return ResponseEntity.ok(productService.getProductsByUsagePurpose(usagePurposeId));
    }

    // 9. FILTER
    // API: GET /api/products/filter?purpose=4&brand=2
    @GetMapping("/filter")
    public ResponseEntity<List<Product>> filterProducts(
            @RequestParam("purpose") Long purpose,
            @RequestParam("brand") Long brand
    ) {
        // Gọi service
        return ResponseEntity.ok(productService.filterProducts(purpose, brand));
    }
    //
//    @GetMapping("/advanced-filter")
//    public ResponseEntity<List<Product>> advancedFilter(
//            @RequestParam(required = false) String keyword,
//            // ✅ FIX: Sửa List<Long> brandIds
//            @RequestParam(value = "brandIds", required = false) List<Long> brandIds,
//            @RequestParam(required = false) Long purposeId,
//            @RequestParam(required = false) Long screenSizeId,
//            @RequestParam(required = false) Double minPrice,
//            @RequestParam(required = false) Double maxPrice,
//            @RequestParam(required = false) String sortBy
//    ) {
//        List<Product> products = productService.advancedFilter(
//                keyword, brandIds, purposeId, screenSizeId, minPrice, maxPrice, sortBy
//        );
//        return ResponseEntity.ok(products);
//    }
    @GetMapping("/advanced-filter")
    public ResponseEntity<List<Product>> advancedFilter(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) List<Long> brandIds,
            @RequestParam(required = false) Long purposeId,
            @RequestParam(required = false) Long screenSizeId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false, defaultValue = "default") String sortBy
    ) {
        System.out.println("=== RECEIVED REQUEST ===");
        System.out.println("Keyword: " + keyword);
        System.out.println("BrandIds: " + brandIds);

        List<Product> products = productService.advancedFilter(
                keyword,
                brandIds,
                purposeId,
                screenSizeId,
                minPrice,
                maxPrice,
                sortBy
        );

        System.out.println("Returning " + products.size() + " products");

        return ResponseEntity.ok(products);
    }
}