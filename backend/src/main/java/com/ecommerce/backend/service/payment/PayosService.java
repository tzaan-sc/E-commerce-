package com.ecommerce.backend.service.payment;

import vn.payos.model.webhooks.Webhook;

public interface PayosService {
    // Trả về url trỏ qua cổng thanh toán của PayOS
    String createPaymentLink(String email, Long orderId);

    // Xử lý callback của PayOS gửi về khi thanh toán thành công
    boolean handleWebhook(Webhook webhookBody);
}
