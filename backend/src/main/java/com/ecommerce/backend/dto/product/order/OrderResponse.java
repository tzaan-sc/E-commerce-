package com.ecommerce.backend.dto.product.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private String orderCode;
    private String customerName;
    private Double totalAmount;
    private String status;
    private Integer itemCount;
}