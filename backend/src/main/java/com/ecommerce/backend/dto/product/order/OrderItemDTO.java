package com.ecommerce.backend.dto.product.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDTO {
    private String productName;
    private Integer quantity;
    private Double price;
    private Double originalPrice;
    private Double discountAmount;
    private String promotionName;
    private String imageUrl; // <-- SỬA: THÊM TRƯỜNG NÀY
    // 👇👇👇 THÊM DÒNG NÀY 👇👇👇
    private Long productId;
}