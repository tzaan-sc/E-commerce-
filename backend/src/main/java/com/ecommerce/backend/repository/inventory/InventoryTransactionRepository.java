package com.ecommerce.backend.repository.inventory;

import com.ecommerce.backend.entity.inventory.InventoryTransaction;
import com.ecommerce.backend.enums.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {

    // ✅ Thêm hàm này để lấy lịch sử sắp xếp từ cũ đến mới (cho Thẻ kho)
    List<InventoryTransaction> findByVariantIdOrderByCreatedAtAsc(Long variantId);

    // ✅ Thêm hàm này để lấy lịch sử sắp xếp từ mới đến cũ (cho giao diện History)
    List<InventoryTransaction> findByVariantIdOrderByCreatedAtDesc(Long variantId);

    // ✅ Đây là phương thức đang bị báo lỗi "cannot find symbol"
    // Logic: Tính tổng lượng biến động theo từng loại (Nhập hoặc Xuất)
    @Query("SELECT COALESCE(SUM(t.quantityChange), 0) FROM InventoryTransaction t " +
            "WHERE t.variant.id = :vId AND t.type = :type")
    int sumQtyByType(@Param("vId") Long vId, @Param("type") TransactionType type);
}