package com.ecommerce.backend.controller.auth;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

// CustomerController.java
@RestController
@RequestMapping("/api/customer")
@PreAuthorize("hasRole('CUSTOMER')")
class CustomerController {

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        Map<String, Object> profile = new HashMap<>();
        profile.put("message", "Customer Profile");
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getOrders() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Customer Orders");
        return ResponseEntity.ok(response);
    }
}