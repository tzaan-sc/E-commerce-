package com.ecommerce.backend.dto.product.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailResponse {
    private Long id;
    private String orderCode;
    private String customerName;
    private Double totalAmount;
    private String status;
    private List<OrderItemResponse> items;
}
