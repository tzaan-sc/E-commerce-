package com.ecommerce.backend.dto.order;

import com.ecommerce.backend.entity.product.Order;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class OrderResponse {

    private Long id;
    private Integer userOrderNumber;
    private String customerName;
    private String phone;
    private String shippingAddress;
    private String note;
    private String status;
    private String paymentMethod;
    private Double totalAmount;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;

    /**
     * Chuyển đổi từ Order entity sang OrderResponse DTO
     */
    public static OrderResponse from(Order order) {
        OrderResponse dto = new OrderResponse();
        dto.setId(order.getId());
        dto.setUserOrderNumber(order.getUserOrderNumber());
        dto.setCustomerName(order.getCustomerName());
        dto.setPhone(order.getPhone());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setNote(order.getNote());
        dto.setStatus(order.getStatus());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setCreatedAt(order.getCreatedAt());

        if (order.getOrderItems() != null) {
            dto.setItems(
                order.getOrderItems().stream()
                    .map(OrderItemResponse::from)
                    .collect(Collectors.toList())
            );
        }
        return dto;
    }
}
