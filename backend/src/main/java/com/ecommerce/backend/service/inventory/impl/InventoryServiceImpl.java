package com.ecommerce.backend.service.inventory.impl;

import com.ecommerce.backend.dto.inventory.ImportRequestDTO;
import com.ecommerce.backend.entity.inventory.ImportReceipt;
import com.ecommerce.backend.entity.inventory.ImportReceiptDetail;
import com.ecommerce.backend.entity.inventory.InventoryTransaction;
import com.ecommerce.backend.entity.product.ProductVariant;
import com.ecommerce.backend.enums.TransactionType;
import com.ecommerce.backend.repository.inventory.ImportReceiptDetailRepository;
import com.ecommerce.backend.repository.inventory.ImportReceiptRepository;
import com.ecommerce.backend.repository.inventory.InventoryTransactionRepository;
import com.ecommerce.backend.repository.product.ProductVariantRepository;
import com.ecommerce.backend.service.inventory.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    private final ImportReceiptRepository receiptRepo;
    private final ImportReceiptDetailRepository detailRepo;
    private final ProductVariantRepository variantRepo;
    private final InventoryTransactionRepository transactionRepo; // Repo để lưu lịch sử

    /**
     * CHỨC NĂNG 1: NHẬP HÀNG (IMPORT)
     * - Tạo phiếu nhập
     * - Lưu chi tiết
     * - Gọi updateStock để tăng kho và ghi lịch sử
     */
    @Override
    @Transactional
    public void importGoods(ImportRequestDTO request) {
        // 1. Tạo Header phiếu nhập
        ImportReceipt receipt = new ImportReceipt();
        receipt.setSupplierName(request.getSupplierName());
        receipt.setNote(request.getNote());
        receipt.setTotalAmount(0.0); // Tính sau
        receipt = receiptRepo.save(receipt);

        double totalAmount = 0;

        // 2. Duyệt từng dòng hàng
        for (ImportRequestDTO.ImportItemDTO item : request.getItems()) {
            ProductVariant variant = variantRepo.findById(item.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy SKU ID: " + item.getVariantId()));

            // a. Lưu chi tiết phiếu (Chứng từ)
            ImportReceiptDetail detail = new ImportReceiptDetail();
            detail.setReceipt(receipt);
            detail.setVariant(variant);
            detail.setQuantity(item.getQuantity());
            detail.setImportPrice(item.getImportPrice());
            detailRepo.save(detail);

            // b. CẬP NHẬT KHO & GHI LỊCH SỬ (Quan trọng)
            // Thay vì setStockQuantity thủ công, ta gọi hàm chung updateStock
            updateStock(
                    variant,
                    item.getQuantity(),
                    TransactionType.IMPORT,
                    receipt.getId(),
                    "Nhập kho từ phiếu #" + receipt.getId()
            );

            // c. Cộng tiền
            totalAmount += (item.getQuantity() * item.getImportPrice());
        }

        // 3. Update tổng tiền
        receipt.setTotalAmount(totalAmount);
        receiptRepo.save(receipt);
    }

    /**
     * CHỨC NĂNG 2: KIỂM KÊ / ĐIỀU CHỈNH KHO (ADJUSTMENT)
     * Dùng khi kho thực tế bị lệch so với phần mềm (Mất mát, hư hỏng...)
     */
    @Override
    @Transactional
    public void adjustStock(Long variantId, int actualQuantity, String reason) {
        ProductVariant variant = variantRepo.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy biến thể ID: " + variantId));

        int currentStock = variant.getStockQuantity() == null ? 0 : variant.getStockQuantity();
        int diff = actualQuantity - currentStock;

        // Nếu không lệch thì không làm gì
        if (diff == 0) return;

        // Xác định loại giao dịch: Thừa (UP) hay Thiếu (DOWN)
        TransactionType type = diff > 0 ? TransactionType.ADJUSTMENT_UP : TransactionType.ADJUSTMENT_DOWN;

        // Gọi hàm updateStock để xử lý
        updateStock(
                variant,
                diff,
                type,
                null, // Không có ID tham chiếu
                "Kiểm kê: " + reason + " (Trước: " + currentStock + ", Thực tế: " + actualQuantity + ")"
        );
    }

    /**
     * CHỨC NĂNG 3: XEM LỊCH SỬ GIAO DỊCH
     */
    @Override
    public List<InventoryTransaction> getHistory(Long variantId) {
        return transactionRepo.findByVariantIdOrderByCreatedAtDesc(variantId);
    }

    /**
     * HÀM DÙNG CHUNG (CORE LOGIC): CẬP NHẬT KHO AN TOÀN
     * Tất cả các thao tác (Nhập, Bán, Trả, Kiểm kê) đều phải đi qua hàm này.
     * * @param variant: Sản phẩm cần sửa
     * @param qtyChange: Số lượng thay đổi (dương là tăng, âm là giảm)
     * @param type: Loại giao dịch (IMPORT, SALE...)
     * @param refId: ID tham chiếu (ID đơn hàng hoặc ID phiếu nhập)
     * @param note: Ghi chú diễn giải
     */
    private void updateStock(ProductVariant variant, int qtyChange, TransactionType type, Long refId, String note) {
        // 1. Tính toán tồn mới
        int oldStock = (variant.getStockQuantity() == null) ? 0 : variant.getStockQuantity();
        int newStock = oldStock + qtyChange;

        // 2. Validate: Kho không được phép âm (Trừ trường hợp cho phép bán âm)
        if (newStock < 0) {
            throw new RuntimeException("Lỗi kho: Tồn kho không đủ để xuất! (Hiện tại: " + oldStock + ", Cần xuất: " + Math.abs(qtyChange) + ")");
        }

        // 3. Cập nhật vào bảng Master (ProductVariant)
        variant.setStockQuantity(newStock);
        variantRepo.save(variant);

        // 4. Ghi log lịch sử (InventoryTransaction)
        InventoryTransaction trans = new InventoryTransaction();
        trans.setVariant(variant);
        trans.setType(type);
        trans.setQuantityChange(qtyChange); // Lưu số thay đổi (+10 hoặc -5)
        trans.setBalanceAfter(newStock);    // Lưu số dư sau khi đổi (Snapshot)
        trans.setReferenceId(refId);
        trans.setNote(note);
        trans.setCreatedBy("Admin");        // Sau này thay bằng SecurityContextHolder.getContext()...

        transactionRepo.save(trans);
    }
}