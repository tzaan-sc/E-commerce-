package com.ecommerce.backend.controller.product;

import com.ecommerce.backend.dto.product.ProductVariantDTO;
import com.ecommerce.backend.service.product.ProductVariantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/variants")
@RequiredArgsConstructor
public class VariantController {

    private final ProductVariantService variantService;

    // Lấy tất cả (Cho trang Kho)
    @GetMapping
    public ResponseEntity<List<ProductVariantDTO>> getAll() {
        return ResponseEntity.ok(variantService.getAllVariants());
    }

    // Lấy theo Product ID (Cho trang Quản lý SP)
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductVariantDTO>> getByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(variantService.getVariantsByProduct(productId));
    }

    // Tạo mới hoặc update
    @PostMapping
    public ResponseEntity<?> save(@RequestBody ProductVariantDTO dto) {
        try {
            return ResponseEntity.ok(variantService.saveVariant(dto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Xóa
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        variantService.deleteVariant(id);
        return ResponseEntity.ok("Đã xóa thành công");
    }
}