package com.ecommerce.backend.controller.inventory;

import com.ecommerce.backend.dto.inventory.ImportRequestDTO;
import com.ecommerce.backend.service.inventory.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ecommerce.backend.dto.inventory.AdjustmentDTO; // <--- Thêm dòng này
@RestController
@RequestMapping("/api/admin/inventory")
@RequiredArgsConstructor // Tự động inject bean (InventoryService)
public class InventoryController {

    // Inject Interface (Spring Boot sẽ tự tìm class Impl tương ứng để chạy)
    private final InventoryService inventoryService;

    // API Nhập kho: POST /api/admin/inventory/import
    @PostMapping("/import")
    public ResponseEntity<?> importGoods(@RequestBody ImportRequestDTO request) {
        inventoryService.importGoods(request);
        return ResponseEntity.ok("Nhập kho thành công! Đã cập nhật số lượng.");
    }
    @GetMapping("/history/{variantId}")
    public ResponseEntity<?> getHistory(@PathVariable Long variantId) {
        // Bạn cần viết hàm này trong Service để gọi repo.findByVariantIdOrderByCreatedAtDesc
        // return ResponseEntity.ok(inventoryService.getHistory(variantId));
        return ResponseEntity.ok("Chức năng xem lịch sử (Bạn tự nối service nhé)");
    }

    @PostMapping("/adjust")
    public ResponseEntity<?> adjustStock(@RequestBody AdjustmentDTO request) {
        // AdjustmentDTO gồm: variantId, actualQuantity, reason
        // inventoryService.adjustStock(request.getVariantId(), request.getActualQuantity(), request.getReason());
        return ResponseEntity.ok("Đã cân bằng kho!");
    }
}