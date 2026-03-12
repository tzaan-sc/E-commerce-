package com.ecommerce.backend.controller.product;

import com.ecommerce.backend.dto.product.ProductVariantDTO;
import com.ecommerce.backend.service.product.ProductVariantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/variants")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class VariantController {

    private final ProductVariantService variantService;

    @GetMapping
    public ResponseEntity<List<ProductVariantDTO>> getAll() { return ResponseEntity.ok(variantService.getAllVariants()); }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductVariantDTO>> getVariantsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(variantService.getVariantsByProduct(productId));
    }

    @PostMapping
    public ResponseEntity<?> save(@RequestBody ProductVariantDTO dto) {
        try { return ResponseEntity.ok(variantService.saveVariant(dto)); }
        catch (RuntimeException e) { return ResponseEntity.badRequest().body(Map.of("message", e.getMessage())); }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try { variantService.deleteVariant(id); return ResponseEntity.ok(Map.of("message", "Đã xóa biến thể")); }
        catch (RuntimeException e) { return ResponseEntity.badRequest().body(Map.of("message", e.getMessage())); }
    }
}