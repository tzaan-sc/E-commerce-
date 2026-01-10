package com.ecommerce.backend.enums;

public enum TransactionType {
    IMPORT,           // Nhập hàng
    SALE,             // Bán hàng
    RETURN,           // Khách trả hàng
    ADJUSTMENT_UP,    // Kiểm kê: Thừa (Tăng kho)
    ADJUSTMENT_DOWN   // Kiểm kê: Thiếu (Giảm kho)
}