package com.ecommerce.backend.controller.payment;

import com.ecommerce.backend.service.payment.PayosService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import vn.payos.model.webhooks.Webhook;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin("*")
@RequiredArgsConstructor
public class PayosController {

    private final PayosService payosService;

    // Trả về { "checkoutUrl": "..." }
    @PostMapping("/create-payos")
    public ResponseEntity<?> createPayosLink(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam Long orderId
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        String username = userDetails.getUsername();

        try {
            String checkoutUrl = payosService.createPaymentLink(username, orderId);
            Map<String, String> response = new HashMap<>();
            response.put("checkoutUrl", checkoutUrl);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Webhook mở công khai cho server PayOS chọc vào
    @PostMapping("/payos-webhook")
    public ResponseEntity<Map<String, Object>> payosWebhook(@RequestBody Webhook webhookBody) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean success = payosService.handleWebhook(webhookBody);
            response.put("success", success);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
