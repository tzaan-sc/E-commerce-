package com.ecommerce.backend.service.inventory;

import com.ecommerce.backend.dto.inventory.ImportPreviewDTO;
import com.ecommerce.backend.dto.inventory.ImportRequestDTO;
import com.ecommerce.backend.entity.inventory.InventoryTransaction;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface InventoryService {
    // 1. Nhập hàng từ nhà cung cấp
    void importGoods(ImportRequestDTO request);

    // 2. Kiểm kê / Điều chỉnh tồn kho thủ công (Khi số lượng thực tế sai lệch)
    void adjustStock(Long variantId, int actualQuantity, String reason);

    // 3. Xem lịch sử giao dịch của 1 sản phẩm
    List<InventoryTransaction> getHistory(Long variantId);
    List<ImportPreviewDTO> validateImportFile(MultipartFile file);
    // 1. Xuất báo cáo tổng hợp (giống file Excel bạn gửi)
    byte[] exportInventoryReport();
    byte[] exportInventorySummary();

    // 2. Xuất thẻ kho cho 1 mã SKU cụ thể
    byte[] exportStockCard(Long variantId);

    // 3. Xuất thẻ kho cho tất cả các mã SKU (Gộp chung 1 file, mỗi SKU 1 Sheet hoặc nối tiếp nhau)
    byte[] exportAllStockCards();
}
