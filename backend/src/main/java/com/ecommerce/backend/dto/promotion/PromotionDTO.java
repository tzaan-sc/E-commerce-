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

    /// Sửa lại pattern thành "yyyy-MM-dd'T'HH:mm" (bỏ hết phần giây đi)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime startDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime endDate;

    private String status;
}