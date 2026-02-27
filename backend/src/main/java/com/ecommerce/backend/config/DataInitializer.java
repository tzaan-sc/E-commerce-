package com.ecommerce.backend.config;

import com.ecommerce.backend.entity.auth.User;
import com.ecommerce.backend.entity.auth.Role;
import com.ecommerce.backend.repository.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Kiểm tra xem email admin đã tồn tại chưa để tránh tạo trùng
        String adminEmail = "adt.ecommerce@gmail.com";

        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail(adminEmail);

            // Mã hóa mật khẩu "admin123" theo chuẩn BCrypt
            admin.setPassword(passwordEncoder.encode("admin123"));

            // Gán quyền ADMIN (Đảm bảo khớp với @PreAuthorize trong AdminController)
            admin.setRole(Role.ADMIN); // Đúng vì gọi trực tiếp từ Enum

            admin.setPhone("0123456789");
            admin.setAddress("Hệ thống cửa hàng Laptop");

            userRepository.save(admin);

            System.out.println("------------------------------------------");
            System.out.println("Tài khoản ADMIN khởi tạo thành công!");
            System.out.println("Email: " + adminEmail);
            System.out.println("Password: admin123");
            System.out.println("------------------------------------------");
        }
    }
}