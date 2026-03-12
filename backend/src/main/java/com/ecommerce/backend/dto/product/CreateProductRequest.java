package com.ecommerce.backend.dto.product;

import com.ecommerce.backend.entity.product.ProductSpecification;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import java.util.List;

@Data
public class CreateProductRequest {
    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String name;

    private String slug;
    private String description;

    @NotNull(message = "Giá sản phẩm không được để trống")
    @PositiveOrZero(message = "Giá sản phẩm không được âm")
    private Double price = 0.0;

    private String status = "ACTIVE";

    @NotNull(message = "Số lượng tồn kho không được để trống")
    @PositiveOrZero(message = "Số lượng tồn kho không được âm")
    private Integer stockQuantity = 0;

    private String imageUrl;
    private List<String> imageUrls;

    // Khớp với các thẻ select ở ProductForm.js
    private Long brandId;
    private Long purposeId;
    private Long screenSizeId;
    private Long promotionId;

    // Gán trực tiếp Object thay vì chuỗi String
    private ProductSpecification specification;
}