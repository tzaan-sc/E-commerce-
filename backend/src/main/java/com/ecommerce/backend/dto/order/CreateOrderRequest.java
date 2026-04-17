package com.ecommerce.backend.dto.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;

/**
 * Request DTO để tạo đơn hàng trực tiếp (không qua giỏ hàng)
 * Dùng cho API: POST /api/orders
 */
@Data
public class CreateOrderRequest {

    @NotEmpty(message = "Danh sách sản phẩm không được để trống")
    @Valid
    private List<OrderItemRequest> items;

    /**
     * Phương thức thanh toán: COD (Thanh toán khi nhận hàng) hoặc ONLINE
     * Mặc định: COD
     */
    private String paymentMethod = "COD";

    @NotBlank(message = "Vui lòng nhập họ tên người nhận")
    private String fullName;

    @NotBlank(message = "Vui lòng nhập số điện thoại")
    private String phone;

    @NotBlank(message = "Vui lòng nhập địa chỉ giao hàng")
    private String address;

    private String note;

    @Data
    public static class OrderItemRequest {
        private Long productId;
        private Integer quantity = 1;
    }
}
