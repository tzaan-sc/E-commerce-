package com.ecommerce.backend.service.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.from}")  // email đã verify trên SendGrid
    private String fromEmail;

    public void sendPasswordResetEmail(String toEmail, String token) {
        String subject = "Đặt lại mật khẩu của bạn";
        String resetLink = "http://localhost:3000/reset-password?token=" + token;

        String body = "Xin chào,\n\n"
                + "Bạn vừa yêu cầu đặt lại mật khẩu.\n"
                + "Vui lòng nhấp vào liên kết sau để đặt lại mật khẩu của bạn:\n"
                + resetLink + "\n\n"
                + "Nếu bạn không yêu cầu, vui lòng bỏ qua email này.";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }
}