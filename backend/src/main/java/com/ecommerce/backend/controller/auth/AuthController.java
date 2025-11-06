package com.ecommerce.backend.controller.auth;

import com.ecommerce.backend.dto.auth.*;
import com.ecommerce.backend.entity.auth.User;
import com.ecommerce.backend.service.auth.AuthService;
import com.ecommerce.backend.service.auth.EmailService;
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

    @Autowired
    private EmailService emailService; // <-- đặt ở đây, là field của class

    /**
     * Đăng ký tài khoản
     */
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

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new MessageResponse("User registered successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    /**
     * Đăng nhập
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(response);
    }

    /**
     * Quên mật khẩu - gửi token reset
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            // Tạo token reset
            String token = authService.createPasswordResetToken(request.getEmail());

            // Gửi email thật
            emailService.sendPasswordResetEmail(request.getEmail(), token);

            return ResponseEntity.ok(new MessageResponse("Đã gửi liên kết đặt lại mật khẩu đến email của bạn."));
        } catch (RuntimeException e) {
            // Không tiết lộ email tồn tại hay không để tránh lộ thông tin
            return ResponseEntity.ok(new MessageResponse("Nếu email tồn tại, liên kết đặt lại mật khẩu đã được gửi."));
        }
    }

    /**
     * Đặt lại mật khẩu
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            authService.resetPassword(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok(new MessageResponse("Mật khẩu đã được đặt lại thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    /**
     * Kiểm tra token hợp lệ
     */
    @GetMapping("/validate")
    public ResponseEntity<?> validateToken() {
        return ResponseEntity.ok(new MessageResponse("Token is valid"));
    }
}