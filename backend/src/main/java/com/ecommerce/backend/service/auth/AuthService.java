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
import com.ecommerce.backend.entity.auth.PasswordResetToken;
import com.ecommerce.backend.entity.auth.Role;
import com.ecommerce.backend.entity.auth.User;
import com.ecommerce.backend.repository.auth.PasswordResetTokenRepository;
import com.ecommerce.backend.repository.auth.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    /**
     * Đăng ký tài khoản mới (CUSTOMER hoặc ADMIN)
     */
    public User register(String username, String email, String password, String phone, String address, String role) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        // Xác định role
        Role userRole = Role.CUSTOMER;
        if (role != null && role.equalsIgnoreCase("ADMIN")) {
            userRole = Role.ADMIN;
        }

        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(userRole)
                .phone(phone)
                .address(address)
                .isActive(true)
                .build();

        return userRepository.save(user);
    }

    /**
     * Đăng nhập tài khoản
     */
    public AuthResponse login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!user.isActive()) {
            throw new RuntimeException("Account is not active");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(
                token,
                user.getUsername(),
                user.getEmail(),
                user.getRole()
        );
    }

    /**
     * Tạo token reset mật khẩu
     */
    @Transactional
    public String createPasswordResetToken(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with this email"));

        tokenRepository.deleteByUser(user);

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusHours(24))
                .used(false)
                .build();

        tokenRepository.save(resetToken);

        return token;
    }

    /**
     * Reset mật khẩu bằng token
     */
    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid reset token"));

        if (resetToken.isExpired()) {
            throw new RuntimeException("Reset token has expired");
        }

        if (resetToken.isUsed()) {
            throw new RuntimeException("Reset token has already been used");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    @Transactional
    public void cleanupExpiredTokens() {
        tokenRepository.deleteByExpiryDateBefore(LocalDateTime.now());
    }
}
