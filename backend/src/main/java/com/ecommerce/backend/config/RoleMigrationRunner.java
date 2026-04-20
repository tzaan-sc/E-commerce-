package com.ecommerce.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class RoleMigrationRunner implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public RoleMigrationRunner(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            // Thay đổi kiểu dữ liệu cột role từ ENUM('ADMIN','CUSTOMER') thành VARCHAR(50) 
            // để có thể chứa được giá trị 'STAFF'
            jdbcTemplate.execute("ALTER TABLE users MODIFY COLUMN role VARCHAR(50)");
            System.out.println("✅ [Database Migration] Đã chuyển đổi cột 'role' trong bảng 'users' thành VARCHAR(50) thành công!");
        } catch (Exception e) {
            System.out.println("⚠️ [Database Migration] Bỏ qua chuyển đổi cột role: " + e.getMessage());
        }
    }
}
