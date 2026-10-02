package com.ecommerce.backend.dto.inventory;

import lombok.Data;

@Data
public class AdjustmentDTO {
    private Long variantId;       // ID của biến thể cần kiểm kê
    private Integer actualQuantity; // Số lượng thực tế đếm được
    private String reason;        // Lý do (VD: Mất, Hỏng, Tìm thấy...)
}