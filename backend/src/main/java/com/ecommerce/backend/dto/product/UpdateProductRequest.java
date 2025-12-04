package com.ecommerce.backend.dto.product;


import lombok.Data;
import java.util.List;

@Data
public class UpdateProductRequest {
    private String name;
    private String description;
    private Double price;
    private Integer stockQuantity;
    private List<String> imageUrls;
    private String specifications;
    private Long brandId;
    private Long usagePurposeId;
    private Long screenSizeId;
}