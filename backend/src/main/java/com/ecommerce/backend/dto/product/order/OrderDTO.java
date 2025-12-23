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
    private Double totalAmount;
    private LocalDateTime createdAt; // <-- SỬA: THÊM TRƯỜNG NÀY
    private List<OrderItemDTO> items;
    private String customerName;    // Tên (Lấy từ order.getCustomerName())
    private String phone;           // SĐT (Lấy từ order.getPhone())
    private String shippingAddress;
}