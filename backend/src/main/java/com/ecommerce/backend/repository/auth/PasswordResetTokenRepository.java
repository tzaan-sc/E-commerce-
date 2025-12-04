package com.ecommerce.backend.repository.auth;

import com.ecommerce.backend.entity.auth.PasswordResetToken;
import com.ecommerce.backend.entity.auth.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token); // Giữ lại nếu cần

    // 👇 Dùng cho cách OTP: Tìm token của user cụ thể
    Optional<PasswordResetToken> findByUser(User user);

    void deleteByUser(User user);
}