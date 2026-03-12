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
    private Boolean isActive; // Khớp với form.isActive ở Frontend

    // --- CÁC TRƯỜNG MỚI ĐÃ ĐỒNG BỘ VỚI FRONTEND (VariantFormModal.js) ---

    // RAM
    private Long ramId;
    private String ramSize;

    // GPU
    private Long gpuId;
    private String gpuName;

    // CPU / Chip
    private Long chipId;
    private String chipName;

    // Storage (Ổ cứng)
    private Long storageId;
    private String storageDisplay;

    // Màu sắc
    private Long colorId;
    private String colorName;
}