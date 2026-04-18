package com.ecommerce.backend.dto.product.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime; // <-- SỬA: THÊM IMPORT
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private Integer userOrderNumber;
    private String status;
    private String paymentStatus;   // 👈 thêm
    private String paymentMethod;
    private Double totalAmount;
    private LocalDateTime createdAt;
    private List<OrderItemDTO> items;
    private String customerName;
    private String phone;
    private String shippingAddress;
    private String note;            // 👈 thêm
}
