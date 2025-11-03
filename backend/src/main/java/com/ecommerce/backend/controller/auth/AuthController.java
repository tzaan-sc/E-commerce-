package com.ecommerce.backend.controller.auth;

import com.ecommerce.backend.dto.auth.*;
import com.ecommerce.backend.entity.auth.User;
import com.ecommerce.backend.service.auth.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = authService.register(
                    request.getUsername(),
                    request.getEmail(),
                    request.getPassword(),
                    request.getPhone(),
                    request.getAddress(),
                    request.getRole()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    new MessageResponse("User registered successfully")
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    new MessageResponse(e.getMessage())
            );
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        // Log request để debug
        System.out.println("Login request received: " + request.getEmail() + " / " + request.getPassword());

        AuthResponse response = authService.login(request.getEmail(), request.getPassword());

        // Log response để debug
        System.out.println("Login response: " + response);

        return ResponseEntity.ok(response);
    }



    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            String token = authService.createPasswordResetToken(request.getEmail());

            // In production, send email with reset link
            // For now, return the token (ONLY FOR DEVELOPMENT)
            return ResponseEntity.ok(new MessageResponse(
                    "Password reset token sent to email. Token: " + token
            ));
        } catch (RuntimeException e) {
            // Don't reveal if email exists or not for security
            return ResponseEntity.ok(new MessageResponse(
                    "If the email exists, a password reset link will be sent"
            ));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            authService.resetPassword(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok(new MessageResponse(
                    "Password has been reset successfully"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    new MessageResponse(e.getMessage())
            );
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken() {
        return ResponseEntity.ok(new MessageResponse("Token is valid"));
    }
}