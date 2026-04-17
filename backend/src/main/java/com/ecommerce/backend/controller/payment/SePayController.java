package com.ecommerce.backend.controller.payment;

import com.ecommerce.backend.dto.payment.SePayWebhookRequest;
import com.ecommerce.backend.service.payment.SePayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/sepay")
@CrossOrigin("*")
@RequiredArgsConstructor
public class SePayController {

    private final SePayService sePayService;

    // Thay đổi key này cho khớp với cấu hình URL Webhook trên trang quản trị SePay
    // Ví dụ URL Webhook setup trên SePay: https://domain.com/api/sepay/webhook?apikey=SEPAY_TOKEN_ECOMMERCE_2026
    private static final String SECRET_API_KEY = "SEPAY_TOKEN_ECOMMERCE_2026";

    @PostMapping("/webhook")
    public ResponseEntity<Map<String, Object>> handleWebhook(
            @RequestParam(required = false) String apikey,
            @RequestBody SePayWebhookRequest request) {
        
        Map<String, Object> response = new HashMap<>();

        // Bảo mật: Validate API Key
        if (apikey == null || !apikey.equals(SECRET_API_KEY)) {
            response.put("success", false);
            response.put("message", "Invalid API Key");
            return ResponseEntity.status(403).body(response);
        }

        boolean result = sePayService.handleWebhook(request);
        
        response.put("success", result);
        return ResponseEntity.ok(response);
    }
}
