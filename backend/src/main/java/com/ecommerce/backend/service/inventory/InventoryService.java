package com.ecommerce.backend.service.inventory;

import com.ecommerce.backend.dto.inventory.ImportRequestDTO;
import com.ecommerce.backend.entity.inventory.InventoryTransaction;
import java.util.List;

public interface InventoryService {
    // 1. Nhập hàng từ nhà cung cấp
    void importGoods(ImportRequestDTO request);

    // 2. Kiểm kê / Điều chỉnh tồn kho thủ công (Khi số lượng thực tế sai lệch)
    void adjustStock(Long variantId, int actualQuantity, String reason);

    // 3. Xem lịch sử giao dịch của 1 sản phẩm
    List<InventoryTransaction> getHistory(Long variantId);
}