package com.ecommerce.backend.dto.product;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariantDTO {
    private Long id;
    private Long productId;
    private String productName;
    private String sku;
    private Double price;
    private Double importPrice;
    private Integer stockQuantity;
    private String image;

    // --- CÁC TRƯỜNG MỚI ĐÃ ĐỒNG BỘ VỚI ENTITY ---
    private String ramCapacity;      // Dòng này sẽ fix lỗi getRamCapacity()
    private String storageCapacity;
    private String color;
}