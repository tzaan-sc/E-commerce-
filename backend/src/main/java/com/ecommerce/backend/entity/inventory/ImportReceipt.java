package com.ecommerce.backend.entity.inventory;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "import_receipts")
@Data
public class ImportReceipt {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String supplierName; // Nhà cung cấp (VD: FPT, Digiworld)
    private String note;         // Ghi chú
    private Double totalAmount;  // Tổng tiền của phiếu nhập

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Quan hệ 1-N với chi tiết phiếu
    @OneToMany(mappedBy = "receipt", cascade = CascadeType.ALL)
    private List<ImportReceiptDetail> details;
}