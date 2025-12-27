//package com.ecommerce.backend.service.auth;
//
//import com.ecommerce.backend.dto.auth.AuthResponse;
//import com.ecommerce.backend.entity.auth.PasswordResetToken;
//import com.ecommerce.backend.entity.auth.Role;
//import com.ecommerce.backend.entity.auth.User;
//import com.ecommerce.backend.repository.auth.PasswordResetTokenRepository;
//import com.ecommerce.backend.repository.auth.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDateTime;
//import java.util.UUID;
//
//@Service
//public class AuthService {
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private PasswordResetTokenRepository tokenRepository;
//
//    @Autowired
//    private PasswordEncoder passwordEncoder;
//
//    @Autowired
//    private JwtService jwtService;
//
//    public User register(String username, String email, String password, String phone, String address, String role) {
//        if (userRepository.existsByUsername(username)) {
//            throw new RuntimeException("Username already exists");
//        }
//
//        if (userRepository.existsByEmail(email)) {
//            throw new RuntimeException("Email already exists");
//        }
//
//        // Xác định role
//        Role userRole = Role.CUSTOMER;
//        if (role != null && role.equalsIgnoreCase("ADMIN")) {
//            userRole = Role.ADMIN;
//        }
//
//        User user = User.builder()
//                .username(username)
//                .email(email)
//                .password(passwordEncoder.encode(password))
//                .role(userRole)
//                .phone(phone)
//                .address(address)
//                .isActive(true)
//                .build();
//
//        return userRepository.save(user);
//    }
//
//    // Login
//    public AuthResponse login(String email, String password) {
//        User user = userRepository.findByEmail(email)
//                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
//
//        if (!user.isActive())
//            throw new RuntimeException("Account is not active");
//
//        if (!passwordEncoder.matches(password, user.getPassword()))
//            throw new RuntimeException("Invalid credentials");
//
//        String token = jwtService.generateToken(user.getEmail());
//
//        return new AuthResponse(
//                token,
//                user.getUsername(),
//                user.getEmail(),
//                user.getRole()
//        );
//    }
//
//    @Transactional
//    public String createPasswordResetToken(String email) {
//        User user = userRepository.findByEmail(email)
//                .orElseThrow(() -> new RuntimeException("User not found with this email"));
//
//        // Delete old tokens for this user
//        tokenRepository.deleteByUser(user);
//
//        // Create new token
//        String token = UUID.randomUUID().toString();
//        PasswordResetToken resetToken = PasswordResetToken.builder()
//                .token(token)
//                .user(user)
//                .expiryDate(LocalDateTime.now().plusHours(24))
//                .used(false)
//                .build();
//
//        tokenRepository.save(resetToken);
//
//        // In production, send email with token here
//        // For now, return the token
//        return token;
//    }
//
//    @Transactional
//    public void resetPassword(String token, String newPassword) {
//        PasswordResetToken resetToken = tokenRepository.findByToken(token)
//                .orElseThrow(() -> new RuntimeException("Invalid reset token"));
//
//        if (resetToken.isExpired()) {
//            throw new RuntimeException("Reset token has expired");
//        }
//
//        if (resetToken.isUsed()) {
//            throw new RuntimeException("Reset token has already been used");
//        }
//
//        User user = resetToken.getUser();
//        user.setPassword(passwordEncoder.encode(newPassword));
//        userRepository.save(user);
//
//        resetToken.setUsed(true);
//        tokenRepository.save(resetToken);
//    }
//
////    public User getUserByUsername(String username) {
////        return userRepository.findByUsername(username)
////                .orElseThrow(() -> new RuntimeException("User not found"));
////    }
//
//    public User getUserByEmail(String email) {
//        return userRepository.findByEmail(email)
//                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
//    }
//
//    @Transactional
//    public void cleanupExpiredTokens() {
//        tokenRepository.deleteByExpiryDateBefore(LocalDateTime.now());
//    }
//}


package com.ecommerce.backend.service.auth;

import com.ecommerce.backend.dto.auth.AuthResponse;
import com.ecommerce.backend.entity.auth.Role;
import com.ecommerce.backend.entity.auth.User;
import com.ecommerce.backend.repository.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // ❌ Đã xóa PasswordResetTokenRepository vì bạn dùng OTP lưu trong User

    /**
     * Đăng ký tài khoản mới
     */
    public User register(String username, String email, String password, String phone, String address, String role) {
        // 1. Kiểm tra trùng lặp
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại!");
        }
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email đã được sử dụng!");
        }

        // 2. Xác định Role (Mặc định là CUSTOMER)
        Role userRole = Role.CUSTOMER;
        if (role != null && role.equalsIgnoreCase("ADMIN")) {
            userRole = Role.ADMIN;
        }

        // 3. Tạo User (Sử dụng Builder chuẩn theo Entity User của bạn)
        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password)) // Mã hóa mật khẩu
                .phone(phone)
                .address(address)
                .role(userRole)
                .isActive(true) // Mặc định kích hoạt
                // .otpCode(null) // OTP mặc định là null
                .build();

        return userRepository.save(user);
    }

    /**
     * Đăng nhập tài khoản
     */
    public AuthResponse login(String email, String password) {
        // 1. Tìm user theo email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Sai email hoặc mật khẩu!"));

        // 2. Kiểm tra active
        if (!user.isActive()) {
            throw new RuntimeException("Tài khoản đã bị khóa hoặc chưa kích hoạt!");
        }

        // 3. Kiểm tra mật khẩu
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Sai email hoặc mật khẩu!");
        }

        // 4. Tạo JWT Token
        String token = jwtService.generateToken(user);

        return new AuthResponse(
                token,
                user.getUsername(),
                user.getEmail(),
                user.getRole()
        );
    }

    /**
     * Đăng nhập bằng Google
     */
    public AuthResponse loginWithGoogle(String email, String fullName) {

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    // Nếu chưa có user → tạo mới
                    User newUser = User.builder()
                            .email(email)
                            .username(fullName)
                            .password(null) // Google không cần password
                            .role(Role.CUSTOMER)
                            .isActive(true)
                            .build();

                    return userRepository.save(newUser);
                });

        // Tạo JWT
        String token = jwtService.generateToken(user);

        return new AuthResponse(
                token,
                user.getUsername(),
                user.getEmail(),
                user.getRole()
        );
    }

}