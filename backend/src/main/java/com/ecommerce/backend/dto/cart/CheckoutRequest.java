package com.ecommerce.backend.dto.cart;
import lombok.Data;
import java.util.List;

@Data
public class CheckoutRequest {
    private List<Long> selectedItemIds; // Danh sách ID giỏ hàng muốn mua
    private String note;                // Ghi chú
    private String address;             // Địa chỉ giao hàng (Lưu riêng cho đơn này)
    private String phone;               // SĐT giao hàng (Lưu riêng cho đơn này)
    private String fullName;            // Tên người nhận
}
