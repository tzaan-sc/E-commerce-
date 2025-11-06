package com.ecommerce.backend.dto.product;

import lombok.Data;

@Data
public class CreateProductRequest {
    private String name;
    private String description;
    private Double price;
    private Integer stockQuantity;
    private String imageUrl;

    private Long brandId;
    private Long usagePurposeId;
    private Long screenSizeId;

    private String slug;
}
