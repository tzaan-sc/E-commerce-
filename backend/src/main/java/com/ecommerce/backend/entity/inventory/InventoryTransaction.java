package com.ecommerce.backend.entity.inventory;

import com.ecommerce.backend.entity.product.ProductVariant;
import com.ecommerce.backend.enums.TransactionType;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_transactions")
@Data
public class InventoryTransaction {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "variant_id")
    private ProductVariant variant;

    @Enumerated(EnumType.STRING)
    private TransactionType type; // Nhập, Xuất, Kiểm kê...

    private Integer quantityChange; // Số lượng thay đổi (VD: +10 hoặc -5)
    private Integer balanceAfter;   // Tồn kho SAU khi giao dịch (Snapshot)

    private Long referenceId;       // ID tham chiếu (ID Phiếu nhập hoặc ID Đơn hàng)
    private String note;            // Ghi chú (VD: Đơn hàng #123, Nhập hàng Tết...)

    private String createdBy;       // Người thực hiện (Admin A)
    private LocalDateTime createdAt = LocalDateTime.now();
}