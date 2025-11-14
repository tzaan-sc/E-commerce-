package com.ecommerce.backend.dto.product.usagepurpose;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateUsagePurposeRequest {
    @NotBlank(message = "Tên nhu cầu sử dụng không được để trống")
    @Size(max = 100, message = "Tên nhu cầu không được vượt quá 100 ký tự")
    private String name;
}