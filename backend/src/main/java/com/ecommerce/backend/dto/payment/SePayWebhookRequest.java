package com.ecommerce.backend.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SePayWebhookRequest {
    private Long id;
    private String gateway;
    private String transactionDate;
    private String accountNumber;
    private String subAccount;
    private Double amountIn;
    private Double amountOut;
    private Double accumulated;
    private String code;
    private String transactionContent;
    private String referenceNumber;
    private String body;
    private String transferType;
}
