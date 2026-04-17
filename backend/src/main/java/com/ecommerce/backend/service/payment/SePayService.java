package com.ecommerce.backend.service.payment;

import com.ecommerce.backend.dto.payment.SePayWebhookRequest;

public interface SePayService {
    boolean handleWebhook(SePayWebhookRequest request);
}
