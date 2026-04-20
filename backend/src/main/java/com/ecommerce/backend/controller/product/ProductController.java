package com.ecommerce.backend.controller.product;

import com.ecommerce.backend.dto.product.CreateProductRequest;
import com.ecommerce.backend.dto.product.UpdateProductRequest;
import com.ecommerce.backend.entity.product.Product;
import com.ecommerce.backend.repository.product.ProductRepository;
import com.ecommerce.backend.service.product.impl.ProductImportService;
import com.ecommerce.backend.service.product.impl.ProductServiceImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin("*")
public class ProductController {

    @Autowired
    private ProductServiceImpl productService;

    @Autowired
    private ProductImportService productImportService; // ⚠️ Đảm bảo bạn đã tạo class này
    @Autowired
    private ProductRepository productRepository;
    // ==========================================
    // 👇 TÍNH NĂNG MỚI: NHẬP EXCEL
    // ==========================================

    @PostMapping("/import")
    public ResponseEntity<?> importExcel(@RequestParam("file") MultipartFile file) {
        // 1. Kiểm tra định dạng file ngay lập tức
        if (!hasExcelFormat(file)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng upload file Excel (.xlsx)!"));
        }

        try {
            // 2. Gọi service thực hiện import
            productImportService.importProducts(file);

            // 3. Trả về JSON thành công để Frontend xử lý
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "✅ Nhập sản phẩm từ file thành công!"
            ));
        } catch (RuntimeException e) {
            // 4. Bắt lỗi RuntimeException (chứa thông tin "Dòng X: ...") từ Service ném ra
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", "❌ " + e.getMessage()
            ));
        } catch (Exception e) {
            // 5. Bắt các lỗi hệ thống khác (lỗi đọc file, lỗi kết nối DB)
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "error",
                    "message", "❌ Lỗi hệ thống: " + e.getMessage()
            ));
        }
    }

    // Hàm hỗ trợ kiểm tra định dạng file (nếu chưa có)
    private boolean hasExcelFormat(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && (
                contentType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") || // .xlsx
                        contentType.equals("application/vnd.ms-excel") // .xls
        );
    }
    // ==========================================
    // 👇 CRUD CƠ BẢN
    // ==========================================

    // 1. GET ALL
    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) String mode) {
        if ("admin".equals(mode)) {
            // Nếu là admin, lấy tất cả không lọc
            return ResponseEntity.ok(productRepository.findAll());
        }
        // Nếu là khách hàng (mặc định), chỉ lấy ACTIVE
        return ResponseEntity.ok(productService.getAllProducts());
    }
    // 2. TÌM KIẾM
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam("keyword") String keyword) {
        return ResponseEntity.ok(productService.searchProducts(keyword));
    }

    // 3. GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    // 4. POST (Tạo mới - Đã có @Valid)
    @PostMapping
    public ResponseEntity<Product> createProduct(@Valid @RequestBody CreateProductRequest request) {
        return ResponseEntity.ok(productService.createProduct(request));
    }

    // 5. PUT (Cập nhật - ✅ ĐÃ SỬA: Thêm @Valid)
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody UpdateProductRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    // 6. DELETE (Xóa - ✅ ĐÃ SỬA: Sửa tên hàm, bỏ RequestBody thừa, sửa kiểu trả về)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok("Đã xoá sản phẩm thành công");
    }
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> toggleStatus(@PathVariable Long id) {
        productService.toggleProductStatus(id);
        return ResponseEntity.ok("Cập nhật trạng thái thành công");
    }
    // ==========================================
    // 👇 LỌC SẢN PHẨM
    // ==========================================

    // 7. GET BY BRAND
    @GetMapping("/brand/{brandId}")
    public ResponseEntity<List<Product>> getProductsByBrand(@PathVariable Long brandId) {
        return ResponseEntity.ok(productService.getProductsByBrand(brandId));
    }

    // 8. GET BY USAGE PURPOSE
    @GetMapping("/usage-purpose/{usagePurposeId}")
    public ResponseEntity<List<Product>> getProductsByUsagePurpose(@PathVariable Long usagePurposeId) {
        return ResponseEntity.ok(productService.getProductsByUsagePurpose(usagePurposeId));
    }

    // 9. FILTER (Cũ)
    @GetMapping("/filter")
    public ResponseEntity<List<Product>> filterProducts(
            @RequestParam("purpose") Long purpose,
            @RequestParam("brand") Long brand
    ) {
        return ResponseEntity.ok(productService.filterProducts(purpose, brand));
    }

    // 10. ADVANCED FILTER (Mới)
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
        // Log kiểm tra (có thể xóa khi chạy thật)
        System.out.println("Filter Request - Keyword: " + keyword + ", Brands: " + brandIds);

        List<Product> products = productService.advancedFilter(
                keyword, brandIds, purposeId, screenSizeId, minPrice, maxPrice, sortBy
        );

        return ResponseEntity.ok(products);
    }
}