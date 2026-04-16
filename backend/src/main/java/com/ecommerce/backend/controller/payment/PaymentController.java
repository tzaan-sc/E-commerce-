package com.ecommerce.backend.controller.payment;

import com.ecommerce.backend.dto.payment.PaymentResponse;
import com.ecommerce.backend.dto.payment.WebhookRequest;
import com.ecommerce.backend.service.payment.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST endpoints for VietQR payment flow.
 *
 *  GET  /api/payment/vietqr/{orderId}  → generate QR info (read-only)
 *  GET  /api/payment/status/{orderId}  → poll payment status (lightweight)
 *  POST /api/payment/webhook           → receive webhook from Macrodroid/Ngrok
 *
 * NOTE: CORS được cấu hình tập trung ở SecurityConfig — KHÔNG dùng @CrossOrigin ở đây.
 */
@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * Lấy thông tin QR để hiển thị cho user.
     * Đổi từ POST → GET vì đây là read-only operation.
     */
    @GetMapping("/vietqr/{orderId}")
    public ResponseEntity<PaymentResponse> getVietQR(@PathVariable Long orderId) {
        return ResponseEntity.ok(paymentService.getPaymentInfo(orderId));
    }

    /**
     * Polling endpoint — Frontend gọi mỗi 3 giây.
     * Trả về { "status": "PENDING" | "PAID" | "FAILED" | "CONFIRMED" | "COMPLETED" }
     */
    @GetMapping("/status/{orderId}")
    public ResponseEntity<Map<String, String>> checkStatus(@PathVariable Long orderId) {
        String status = paymentService.checkPaymentStatus(orderId);
        return ResponseEntity.ok(Map.of("status", status));
    }

    /**
     * Webhook từ Macrodroid (qua Ngrok). Public endpoint — không cần JWT.
     * @Valid kích hoạt Bean Validation trên WebhookRequest để chặn input xấu.
     */
    @PostMapping("/webhook")
    public ResponseEntity<String> receivePaymentWebhook(@Valid @RequestBody WebhookRequest payload) {
        paymentService.processWebhook(payload.getOrderId(), payload.getStatus());
        return ResponseEntity.ok("Webhook received successfully!");
    }
}
