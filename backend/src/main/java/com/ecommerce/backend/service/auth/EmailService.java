package com.ecommerce.backend.service.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    // ✅ Đã bật lại JavaMailSender
    private final JavaMailSender javaMailSender;

    public void sendEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("nthiencntt2311089@student.ctuet.edu.vn"); // Email người gửi (chỉ để hiển thị)
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);

            // Gửi mail thật
            javaMailSender.send(message);
            System.out.println("✅ Đã gửi email thành công đến: " + to);

        } catch (Exception e) {
            System.err.println("❌ Lỗi khi gửi email: " + e.getMessage());
            e.printStackTrace();
            // Ném lỗi ra để Controller biết đường trả về 400
            throw new RuntimeException("Không thể gửi email, vui lòng kiểm tra lại cấu hình!");
        }
    }
}