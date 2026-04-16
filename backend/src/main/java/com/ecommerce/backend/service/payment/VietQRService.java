package com.ecommerce.backend.service.payment;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * Tạo URL hình ảnh VietQR từ Quick Link API.
 * Không cần API key – chỉ cần ghép đúng format URL.
 */
@Service
public class VietQRService {

    @Value("${vietqr.bank-id}")
    private String bankId;

    @Value("${vietqr.account-no}")
    private String accountNo;

    @Value("${vietqr.account-name}")
    private String accountName;

    @Value("${vietqr.template}")
    private String template;

    /**
     * Generates a VietQR image URL.
     * Format: https://img.vietqr.io/image/{BANK_ID}-{ACCOUNT_NO}-{TEMPLATE}.png
     *         ?amount={AMOUNT}&addInfo={DESCRIPTION}&accountName={ACCOUNT_NAME}
     *
     * @param orderId  Mã đơn hàng – dùng tạo nội dung chuyển khoản
     * @param amount   Số tiền cần thanh toán
     * @return URL ảnh QR
     */
    public String generateQRCodeUrl(Long orderId, Double amount) {
        String description = "ORDER_" + orderId;
        String encodedAccountName = URLEncoder.encode(accountName, StandardCharsets.UTF_8);
        String encodedDescription = URLEncoder.encode(description, StandardCharsets.UTF_8);

        return String.format(
                "https://img.vietqr.io/image/%s-%s-%s.png?amount=%.0f&addInfo=%s&accountName=%s",
                bankId, accountNo, template, amount, encodedDescription, encodedAccountName
        );
    }
}
