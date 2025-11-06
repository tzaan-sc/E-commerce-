package com.ecommerce.backend.dto.product.order;

import lombok.Data;

@Data
public class OrderItemRequest {
    private String productName;
    private Integer quantity;
    private Double price;
}
