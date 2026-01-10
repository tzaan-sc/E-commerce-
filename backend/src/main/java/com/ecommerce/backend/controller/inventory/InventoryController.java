package com.ecommerce.backend.controller.inventory;

import com.ecommerce.backend.dto.inventory.ImportRequestDTO;
import com.ecommerce.backend.dto.inventory.AdjustmentDTO;
import com.ecommerce.backend.dto.inventory.ImportPreviewDTO;
import com.ecommerce.backend.service.inventory.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    /**
     * CẬP NHẬT: Hỗ trợ 3 dạng xuất file qua tham số "type"
     * type: SUMMARY (Tổng hợp), STOCK_CARD_SINGLE (1 SKU), STOCK_CARD_ALL (Tất cả thẻ kho)
     */
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportInventory(
            @RequestParam(defaultValue = "SUMMARY") String type,
            @RequestParam(required = false) Long variantId) {

        byte[] excelContent;
        String fileName;

        // Logic lựa chọn hàm xuất từ Service
        if ("STOCK_CARD_SINGLE".equals(type) && variantId != null) {
            excelContent = inventoryService.exportStockCard(variantId);
            fileName = "the_kho_sku_" + variantId + ".xlsx";
        } else if ("STOCK_CARD_ALL".equals(type)) {
            excelContent = inventoryService.exportAllStockCards();
            fileName = "tat_ca_the_kho.xlsx";
        } else {
            excelContent = inventoryService.exportInventorySummary();
            fileName = "bao_cao_kho_tong_hop.xlsx";
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excelContent);
    }

    /**
     * LOGIC HAY HO 1: DRY RUN (Xem trước file)
     * Thêm try-catch để báo lỗi dòng cụ thể nếu file hỏng
     */
    @PostMapping("/import/dry-run")
    public ResponseEntity<?> dryRunImport(@RequestParam("file") MultipartFile file) {
        try {
            List<ImportPreviewDTO> preview = inventoryService.validateImportFile(file);
            return ResponseEntity.ok(preview);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * LOGIC HAY HO 2: BULK IMPORT (Nhập hàng loạt)
     */
    @PostMapping("/import/bulk")
    public ResponseEntity<?> bulkImport(@RequestBody List<ImportRequestDTO.ImportItemDTO> items) {
        try {
            ImportRequestDTO bulkRequest = new ImportRequestDTO();
            bulkRequest.setSupplierName("Nhập hàng loạt từ File");
            bulkRequest.setNote("Nhập kho từ tệp Excel");
            bulkRequest.setItems(items);

            inventoryService.importGoods(bulkRequest);
            return ResponseEntity.ok(Map.of("message", "Nhập kho hàng loạt thành công!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // 3. Nhập kho lẻ qua Form
    @PostMapping("/import")
    public ResponseEntity<?> importGoods(@RequestBody ImportRequestDTO request) {
        try {
            inventoryService.importGoods(request);
            return ResponseEntity.ok(Map.of("message", "Nhập kho thành công!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // 4. Lịch sử thẻ kho (History)
    @GetMapping("/history/{variantId}")
    public ResponseEntity<?> getHistory(@PathVariable Long variantId) {
        return ResponseEntity.ok(inventoryService.getHistory(variantId));
    }

    // 5. Kiểm kê & Cân bằng kho (Blind Audit Logic)
    @PostMapping("/adjust")
    public ResponseEntity<?> adjustStock(@RequestBody AdjustmentDTO request) {
        try {
            inventoryService.adjustStock(
                    request.getVariantId(),
                    request.getActualQuantity(),
                    request.getReason()
            );
            return ResponseEntity.ok(Map.of("message", "Đã cân bằng kho!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}