package com.ecommerce.backend.enums;

public enum TransactionType {
    IMPORT,         // Nhập hàng từ NCC (+ Tăng)
    SALE,           // Bán hàng (- Giảm)
    RETURN,         // Khách trả hàng (+ Tăng)
    ADJUSTMENT_UP,  // Kiểm kê: Thấy thừa (+ Tăng)
    ADJUSTMENT_DOWN // Kiểm kê: Thấy thiếu/Hỏng (- Giảm)
}