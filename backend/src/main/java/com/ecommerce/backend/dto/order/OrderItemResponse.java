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

        if (item.getProduct() != null) {
            dto.setProductId(item.getProduct().getId());
            // Lấy ảnh: ưu tiên imageUrl trực tiếp, sau đó lấy từ danh sách images
            if (item.getProduct().getImageUrl() != null) {
                dto.setImageUrl(item.getProduct().getImageUrl());
            } else if (item.getProduct().getImages() != null && !item.getProduct().getImages().isEmpty()) {
                dto.setImageUrl(item.getProduct().getImages().get(0).getUrlImage());
            }
        }
        return dto;
    }
}
