package com.ecommerce.backend.repository.inventory;

import com.ecommerce.backend.entity.inventory.ImportReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImportReceiptRepository extends JpaRepository<ImportReceipt, Long> {
    // Có thể thêm các hàm tìm kiếm tùy chỉnh sau này nếu cần
}