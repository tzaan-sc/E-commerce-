//package com.ecommerce.backend.entity.auth;
//
//import jakarta.persistence.*;
//import lombok.*;
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "password_reset_tokens")
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class PasswordResetToken {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(nullable = false, unique = true)
//    private String token;
//
//    @Column(nullable = false)
//    private String otp; // 👇 Lưu mã 6 số (VD: "123456")
//
//    @OneToOne(fetch = FetchType.EAGER)
//    @JoinColumn(name = "user_id", nullable = false)
//    private User user;
//
//    @Column(nullable = false)
//    private LocalDateTime expiryDate;
//
//    public boolean isExpired() {
//        return LocalDateTime.now().isAfter(expiryDate);
//    }
//}