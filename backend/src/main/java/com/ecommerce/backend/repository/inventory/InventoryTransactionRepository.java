package com.ecommerce.backend.repository.inventory;

import com.ecommerce.backend.entity.inventory.InventoryTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {
    // Lấy lịch sử của 1 sản phẩm, sắp xếp mới nhất lên đầu
    List<InventoryTransaction> findByVariantIdOrderByCreatedAtDesc(Long variantId);
}