package com.ecommerce.backend.controller.payment;

import com.ecommerce.backend.dto.payment.PaymentResponse;
import com.ecommerce.backend.dto.payment.WebhookRequest;
import com.ecommerce.backend.service.payment.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/vietqr/{orderId}")
    public ResponseEntity<PaymentResponse> getVietQR(@PathVariable Long orderId) {
        return ResponseEntity.ok(paymentService.getPaymentInfo(orderId));
    }

    // 👇 Sửa: trả về Map<String, String> chứa cả status lẫn paymentStatus
    @GetMapping("/status/{orderId}")
    public ResponseEntity<Map<String, String>> checkStatus(@PathVariable Long orderId) {
        return ResponseEntity.ok(paymentService.checkPaymentStatus(orderId));
    }

    @PostMapping("/webhook")
public ResponseEntity<String> receivePaymentWebhook(@Valid @RequestBody WebhookRequest payload) {
    paymentService.processWebhook(payload.getOrderId(), payload.getPaymentStatus()); // 👈
    return ResponseEntity.ok("Webhook received successfully!");
}    
}
