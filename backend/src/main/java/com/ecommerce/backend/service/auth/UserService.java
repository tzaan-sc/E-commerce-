package com.ecommerce.backend.service.auth;

import com.ecommerce.backend.dto.auth.ChangePasswordRequest;
import com.ecommerce.backend.dto.auth.UpdateProfileRequest;
import com.ecommerce.backend.entity.auth.User;
import com.ecommerce.backend.repository.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    // ❌ ĐÃ XÓA: private final PasswordResetTokenRepository tokenRepository; (Không cần nữa)

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    @Transactional
    public User updateProfile(String email, UpdateProfileRequest request) {
        User user = getUserByEmail(email);

        if (request.getUsername() != null && !request.getUsername().isEmpty()) {
            user.setUsername(request.getUsername());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        if (request.getAvatarUrl() != null && !request.getAvatarUrl().isEmpty()) {
            user.setAvatarUrl(request.getAvatarUrl());
        }

        if (request.getEmail() != null && !request.getEmail().isEmpty() && !request.getEmail().equals(email)) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email này đã được sử dụng!");
            }
            user.setEmail(request.getEmail());
        }

        return userRepository.save(user);
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = getUserByEmail(email);

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu cũ không chính xác!");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    // ============================================================
    // 👇 PHẦN ĐÃ SỬA: DÙNG OTP TRONG BẢNG USER (KHÔNG DÙNG TOKEN REPO)
    // ============================================================

    // 1. GỬI MÃ OTP
    @Transactional
    public void sendOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email này chưa được đăng ký!"));

        // Tạo OTP 6 số ngẫu nhiên
        String otp = String.format("%06d", new Random().nextInt(999999));

        // ✅ LƯU TRỰC TIẾP VÀO USER
        user.setOtpCode(otp);
        user.setOtpExpiration(LocalDateTime.now().plusMinutes(5)); // Hết hạn sau 5 phút

        userRepository.save(user); // Lưu user để cập nhật OTP vào DB

        // Gửi email
        String subject = "Mã xác thực (OTP) đặt lại mật khẩu";
        String text = "Xin chào " + user.getUsername() + ",\n\n"
                + "Mã xác thực (OTP) của bạn là: " + otp + "\n\n"
                + "Mã này có hiệu lực trong 5 phút. Vui lòng không chia sẻ cho ai.\n";

        emailService.sendEmail(user.getEmail(), subject, text);
    }

    // 2. XÁC NHẬN OTP VÀ ĐỔI MẬT KHẨU MỚI
    @Transactional
    public void resetPasswordWithOtp(String email, String otp, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại!"));

        // ✅ KIỂM TRA OTP TỪ TRONG USER
        if (user.getOtpCode() == null || !user.getOtpCode().equals(otp)) {
            throw new RuntimeException("Mã OTP không chính xác hoặc bạn chưa yêu cầu gửi mã!");
        }

        // ✅ KIỂM TRA THỜI GIAN HẾT HẠN
        if (user.getOtpExpiration() == null || user.getOtpExpiration().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Mã OTP đã hết hạn, vui lòng lấy mã mới!");
        }

        // Đổi mật khẩu
        user.setPassword(passwordEncoder.encode(newPassword));

        // Xóa OTP và thời gian hết hạn sau khi dùng xong (để không dùng lại được)
        user.setOtpCode(null);
        user.setOtpExpiration(null);

        userRepository.save(user);
    }
}