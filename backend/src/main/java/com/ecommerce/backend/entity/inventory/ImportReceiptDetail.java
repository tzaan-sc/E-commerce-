package com.ecommerce.backend.entity.inventory;

import com.ecommerce.backend.entity.product.ProductVariant;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "import_receipt_details")
@Data
public class ImportReceiptDetail {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "receipt_id")
    private ImportReceipt receipt;

    @ManyToOne
    @JoinColumn(name = "variant_id")
    private ProductVariant variant; // Biến thể được nhập (SKU)

    private Integer quantity;    // Số lượng nhập
    private Double importPrice;  // Giá vốn (Quan trọng để tính lãi)
}