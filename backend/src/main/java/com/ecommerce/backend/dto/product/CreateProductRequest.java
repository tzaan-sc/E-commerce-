package com.ecommerce.backend.dto.product;

import lombok.Data;
import java.util.List;
@Data
public class CreateProductRequest {
    private String name;
    private String description;
    private Double price;
    private Integer stockQuantity;
    private String imageUrl;
    private List<String> imageUrls;
    private Long brandId;
    private Long usagePurposeId;
    private Long screenSizeId;
    private String specifications;
    private String slug;
}