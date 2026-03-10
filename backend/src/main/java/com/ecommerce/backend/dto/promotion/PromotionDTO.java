package com.ecommerce.backend.dto.promotion;

import com.ecommerce.backend.entity.promotion.DiscountType;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PromotionDTO {
    private Long id;
    private String name;
    private String description;
    private DiscountType discountType;
    private Double discountValue;

    // Sửa 2 trường này: Thêm @JsonFormat để khớp với toISOString() của React
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private LocalDateTime startDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private LocalDateTime endDate;

    private String status;
}