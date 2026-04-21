package com.ecommerce.backend.dto.order;

import com.ecommerce.backend.entity.product.OrderItem;
import lombok.Data;

@Data
public class OrderItemResponse {

    private Long id;
    private String productName;
    private Integer quantity;
    private Double price;
    private Long productId;
    private String imageUrl; // Ảnh sản phẩm để hiển thị trên frontend

    public static OrderItemResponse from(OrderItem item) {
        OrderItemResponse dto = new OrderItemResponse();
        dto.setId(item.getId());
        dto.setProductName(item.getProductName());
        dto.setQuantity(item.getQuantity());
        dto.setPrice(item.getPrice());

        // 1. Gán productId
        if (item.getProduct() != null) {
            dto.setProductId(item.getProduct().getId());
        }

        // 2. 🔥 QUY TẮC CHỐT HẠ CHO ẢNH (Fix lỗi hiện ảnh cha):
        // Ưu tiên 1: Lấy đúng giá trị từ cột image_url của chính OrderItem (Đây là ảnh biến thể lúc mua)
        if (item.getImageUrl() != null && !item.getImageUrl().isBlank()) {
            dto.setImageUrl(item.getImageUrl());
        }
        // Ưu tiên 2: Nếu đơn hàng cũ k có imageUrl, mới tìm trong Product cha
        else if (item.getProduct() != null) {
            if (item.getProduct().getImageUrl() != null) {
                dto.setImageUrl(item.getProduct().getImageUrl());
            } else if (item.getProduct().getImages() != null && !item.getProduct().getImages().isEmpty()) {
                dto.setImageUrl(item.getProduct().getImages().get(0).getUrlImage());
            }
        }

        return dto;
    }
}