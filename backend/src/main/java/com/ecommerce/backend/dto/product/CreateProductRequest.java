package com.ecommerce.backend.dto.product;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import java.util.List;

@Data
public class CreateProductRequest {
    private String name;
    private String description;
    @NotNull(message = "Giá sản phẩm không được để trống")
    @PositiveOrZero(message = "Giá sản phẩm không được âm")
    private Double price;

    @NotNull(message = "Số lượng tồn kho không được để trống")
    @PositiveOrZero(message = "Số lượng tồn kho không được âm")
    private Integer stockQuantity;
    private String imageUrl;
    private List<String> imageUrls;
    private Long brandId;
    private Long usagePurposeId;
    private Long screenSizeId;
    private String specifications;
    private String slug;
}