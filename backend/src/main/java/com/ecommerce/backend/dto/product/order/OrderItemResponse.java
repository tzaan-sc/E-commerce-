package com.ecommerce.backend.dto.product.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    private Long id;
    private String productName;
    private Integer quantity;
    private Double price;
    private Double subtotal; // quantity * price
}
