package com.ecommerce.backend.dto.inventory;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ImportPreviewDTO {
    private String sku;
    private String productName;
    private Integer quantity;
    private Double importPrice;
    private boolean isValid;
    private String error; // Ví dụ: "SKU không tồn tại", "Số lượng âm"
}