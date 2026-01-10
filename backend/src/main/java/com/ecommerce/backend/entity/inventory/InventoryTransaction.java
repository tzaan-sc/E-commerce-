package com.ecommerce.backend.entity.inventory;

import com.ecommerce.backend.entity.product.ProductVariant;
import com.ecommerce.backend.enums.TransactionType;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_transactions")
@Data
public class InventoryTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "variant_id")
    private ProductVariant variant;

    // 👇 DÒNG NÀY QUAN TRỌNG: Lưu dạng chữ (IMPORT) thay vì số (0)
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private TransactionType type;

    @Column(name = "quantity_change")
    private Integer quantityChange; // +10 hoặc -5

    @Column(name = "balance_after")
    private Integer balanceAfter;   // Tồn kho lúc đó (Snapshot)

    @Column(name = "reference_id")
    private Long referenceId;       // ID phiếu nhập hoặc ID đơn hàng

    private String note;

    @Column(name = "created_by")
    private String createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}