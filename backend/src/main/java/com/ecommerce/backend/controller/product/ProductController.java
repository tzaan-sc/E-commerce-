package com.ecommerce.backend.controller.product;

import com.ecommerce.backend.dto.product.CreateProductRequest;
import com.ecommerce.backend.dto.product.UpdateProductRequest;
import com.ecommerce.backend.entity.product.Product;
import com.ecommerce.backend.service.product.impl.ProductServiceImpl;
import com.ecommerce.backend.service.product.impl.ProductImportService; // 👈 1. Import Service Import
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // 👈 2. Import MultipartFile

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin("*")
public class ProductController {

    @Autowired
    private ProductServiceImpl productService;

    @Autowired
    private ProductImportService productImportService; // 👈 3. Inject thêm Service Import

    // ==========================================
    // 👇👇👇 TÍNH NĂNG MỚI: NHẬP EXCEL 👇👇👇
    // ==========================================

    // API: POST /api/products/import
    @PostMapping("/import")
    public ResponseEntity<?> importExcel(@RequestParam("file") MultipartFile file) {
        // Kiểm tra file có phải Excel không
        if (!hasExcelFormat(file)) {
            return ResponseEntity.badRequest().body("Vui lòng upload file Excel (.xlsx)!");
        }

        try {
            productImportService.importProducts(file);
            return ResponseEntity.ok("✅ Nhập sản phẩm thành công!");
        } catch (Exception e) {
            e.printStackTrace(); // In lỗi ra console để debug
            return ResponseEntity.badRequest().body("❌ Lỗi: " + e.getMessage());
        }
    }

    // Hàm kiểm tra định dạng file (chỉ chấp nhận .xlsx hoặc .xls)
    private boolean hasExcelFormat(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null &&
                (contentType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") ||
                        contentType.equals("application/vnd.ms-excel"));
    }

    // ==========================================
    // 👆👆👆 HẾT PHẦN TÍNH NĂNG MỚI 👆👆👆
    // ==========================================


    // 1. GET ALL
    @GetMapping
    public ResponseEntity<List<Product>> getAll() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // 2. TÌM KIẾM THEO TỪ KHÓA
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(
            @RequestParam("keyword") String keyword
    ) {
        List<Product> products = productService.searchProducts(keyword);
        return ResponseEntity.ok(products);
    }

    // 3. GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    // 4. POST (Tạo mới thủ công)
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
    @GetMapping("/filter")
    public ResponseEntity<List<Product>> filterProducts(
            @RequestParam("purpose") Long purpose,
            @RequestParam("brand") Long brand
    ) {
        return ResponseEntity.ok(productService.filterProducts(purpose, brand));
    }

    // 10. ADVANCED FILTER
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