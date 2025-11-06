package com.ecommerce.backend.dto.product.order;

import lombok.Data;
import java.util.List;

@Data
public class CreateOrderRequest {
    private String orderCode;
    private String customerName;
    private Double totalAmount;
    private String status;
    private List<OrderItemRequest> items;
}
