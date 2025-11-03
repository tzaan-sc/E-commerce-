package com.ecommerce.backend.dto.product.brand;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateBrandRequest {
    @NotNull(message = "ID thương hiệu không được để trống")
    private Long id;

    @NotBlank(message = "Tên thương hiệu không được để trống")
    @Size(max = 100, message = "Tên thương hiệu không được vượt quá 100 ký tự")
    private String name;

    @NotBlank(message = "Logo URL không được để trống")
    @Size(max = 500, message = "Logo URL không được vượt quá 500 ký tự")
    private String logoUrl;
}
