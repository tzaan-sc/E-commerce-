package com.ecommerce.backend.dto.payment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

/**
 * DTO để nhận payload từ Macrodroid (qua Ngrok).
 * Tên field phải khớp 100% với tên bạn cấu hình trong Macrodroid.
 */
@Data
public class WebhookRequest {

    @NotNull(message = "orderId không được để trống")
    private Long orderId;

    @NotBlank(message = "paymentStatus không được để trống")
    @Pattern(regexp = "PAID|FAILED", flags = Pattern.Flag.CASE_INSENSITIVE,
             message = "paymentStatus chỉ được là PAID hoặc FAILED")
    private String paymentStatus; // 👈 đổi từ status → paymentStatus
}