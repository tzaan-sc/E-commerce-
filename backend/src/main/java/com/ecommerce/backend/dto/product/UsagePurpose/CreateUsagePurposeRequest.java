package com.ecommerce.backend.dto.product.usagepurpose;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data // ⚠️ BẮT BUỘC PHẢI CÓ ĐỂ SINH getter/setter
public class CreateUsagePurposeRequest {

    @NotBlank(message = "Tên nhu cầu sử dụng không được để trống")
    private String name;
}
