//package com.ecommerce.backend.controller.auth;
//
//import com.ecommerce.backend.dto.auth.*;
//import com.ecommerce.backend.entity.auth.User;
//import com.ecommerce.backend.service.auth.AuthService;
//import com.ecommerce.backend.service.auth.EmailService;
//import jakarta.validation.Valid;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import java.util.Map;
//import com.ecommerce.backend.dto.auth.ChangePasswordRequest;
//
//@RestController
//@RequestMapping("/api/auth")
//public class AuthController {
//
//    @Autowired
//    private AuthService authService;
//
//    @Autowired
//    private EmailService emailService; // <-- đặt ở đây, là field của class
//
//    /**
//     * Đăng ký tài khoản
//     */
//    @PostMapping("/register")
//    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
//        try {
//            User user = authService.register(
//                    request.getUsername(),
//                    request.getEmail(),
//                    request.getPassword(),
//                    request.getPhone(),
//                    request.getAddress(),
//                    request.getRole()
//            );
//
//            return ResponseEntity.status(HttpStatus.CREATED)
//                    .body(new MessageResponse("User registered successfully"));
//        } catch (RuntimeException e) {
//            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
//        }
//    }
//
//    /**
//     * Đăng nhập
//     */
//    @PostMapping("/login")
//    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
//        AuthResponse response = authService.login(request.getEmail(), request.getPassword());
//        return ResponseEntity.ok(response);
//    }
//
//    /**
//     * Quên mật khẩu - gửi token reset
//     */
//    @PostMapping("/forgot-password")
//    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
//        try {
//            // Tạo token reset
//            String token = authService.createPasswordResetToken(request.getEmail());
//
//            // Gửi email thật
//            emailService.sendPasswordResetEmail(request.getEmail(), token);
//
//            return ResponseEntity.ok(new MessageResponse("Đã gửi liên kết đặt lại mật khẩu đến email của bạn."));
//        } catch (RuntimeException e) {
//            // Không tiết lộ email tồn tại hay không để tránh lộ thông tin
//            return ResponseEntity.ok(new MessageResponse("Nếu email tồn tại, liên kết đặt lại mật khẩu đã được gửi."));
//        }
//    }
//
//    /**
//     * Đặt lại mật khẩu
//     */
//    @PostMapping("/reset-password")
//    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
//        try {
//            authService.resetPassword(request.getToken(), request.getNewPassword());
//            return ResponseEntity.ok(new MessageResponse("Mật khẩu đã được đặt lại thành công"));
//        } catch (RuntimeException e) {
//            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
//        }
//    }
//
//    /**
//     * Kiểm tra token hợp lệ
//     */
//    @GetMapping("/validate")
//    public ResponseEntity<?> validateToken() {
//        return ResponseEntity.ok(new MessageResponse("Token is valid"));
//    }
//}
////@PutMapping("/change-password/{userId}")
////public ResponseEntity<?> changePassword(
////        @PathVariable Long userId,
////        @RequestBody ChangePasswordRequest request) {
////    try {
////        authService.changePassword(userId, request);
////        return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công!"));
////    } catch (RuntimeException e) {
////        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
////    }
////}

package com.ecommerce.backend.controller.auth;

import com.ecommerce.backend.dto.auth.*;
import com.ecommerce.backend.entity.auth.User;
import com.ecommerce.backend.service.auth.AuthService;
import com.ecommerce.backend.service.auth.UserService; // 👇 Import UserService
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor // Sử dụng Lombok để inject dependency (thay vì @Autowired thủ công)
public class AuthController {

    private final AuthService authService;
    private final UserService userService; // 👇 Inject UserService để dùng logic OTP

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
                    .body(new MessageResponse("Đăng ký thành công!"));
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

    // ============================================================
    // 👇 TÍNH NĂNG QUÊN MẬT KHẨU BẰNG OTP (MỚI)
    // ============================================================

    /**
     * Bước 1: Gửi mã OTP về email
     */
    @PostMapping("/forgot-password-otp")
    public ResponseEntity<?> sendOtp(@RequestParam String email) {
        try {
            // Gọi hàm sendOtp trong UserService
            userService.sendOtp(email);
            return ResponseEntity.ok(Map.of("message", "Mã OTP đã được gửi đến email của bạn!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Bước 2: Xác thực OTP và Đặt lại mật khẩu mới
     */
    @PostMapping("/reset-password-otp")
    public ResponseEntity<?> resetPasswordOtp(@RequestBody ResetPasswordOtpRequest request) {
        try {
            // Gọi hàm resetPasswordWithOtp trong UserService
            userService.resetPasswordWithOtp(request.getEmail(), request.getOtp(), request.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công! Vui lòng đăng nhập lại."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ============================================================
    // 👇 CÁC API CŨ (Token qua Link) - Có thể giữ lại hoặc xóa nếu không dùng
    // ============================================================

    /**
     * Kiểm tra token hợp lệ
     */
    @GetMapping("/validate")
    public ResponseEntity<?> validateToken() {
        return ResponseEntity.ok(new MessageResponse("Token is valid"));
    }

    /* * Lưu ý về changePassword:
     * Chức năng đổi mật khẩu (khi đã đăng nhập) đã được chuyển sang ProfileController
     * để đảm bảo bảo mật (sử dụng Token thay vì truyền ID trên URL).
     */
}