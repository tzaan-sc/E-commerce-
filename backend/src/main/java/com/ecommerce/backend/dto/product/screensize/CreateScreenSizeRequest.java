package com.ecommerce.backend.dto.product.screensize;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CreateScreenSizeRequest {
    @NotNull(message = "Kích thước màn hình không được để trống")
    @Positive(message = "Kích thước màn hình phải là số dương")
    private Double value;
}