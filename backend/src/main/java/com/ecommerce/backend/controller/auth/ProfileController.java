//package com.ecommerce.backend.controller.auth;
//
//import com.ecommerce.backend.dto.auth.ChangePasswordRequest; // Nhớ import DTO này
//import com.ecommerce.backend.dto.auth.UpdateProfileRequest;
//import com.ecommerce.backend.entity.auth.User;
//import com.ecommerce.backend.service.auth.UserService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/profile")
//@CrossOrigin(origins = "*")
//@RequiredArgsConstructor
//public class ProfileController {
//
//    private final UserService userService;
//
//    // API Cập nhật thông tin cá nhân
//    @PutMapping("/update")
//    public ResponseEntity<?> updateProfile(
//            @AuthenticationPrincipal UserDetails userDetails,
//            @RequestBody UpdateProfileRequest request
//    ) {
//        if (userDetails == null) return ResponseEntity.status(401).body("Unauthorized");
//        User updatedUser = userService.updateProfile(userDetails.getUsername(), request);
//        return ResponseEntity.ok(updatedUser);
//    }
//
//    // 👇 BỔ SUNG API NÀY ĐỂ HẾT LỖI 404
////    @PutMapping("/change-password")
////    public ResponseEntity<?> changePassword(
////            @AuthenticationPrincipal UserDetails userDetails,
////            @RequestBody ChangePasswordRequest request
////    ) {
////        if (userDetails == null) {
////            return ResponseEntity.status(401).body("Unauthorized");
////        }
////
////        try {
////            userService.changePassword(userDetails.getUsername(), request);
////            return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công!"));
////        } catch (RuntimeException e) {
////            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
////        }
//    }
//}