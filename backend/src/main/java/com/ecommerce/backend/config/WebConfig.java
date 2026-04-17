package com.ecommerce.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir:uploads/products/}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 1. Lấy đường dẫn tuyệt đối của thư mục uploads
        File uploadFolder = new File(uploadDir);
        String absolutePath = uploadFolder.getAbsolutePath() + File.separator;

        // --- Giữ nguyên Debug logging của Hiển ---
        System.out.println("===========================================");
        System.out.println("📁 Upload directory: " + absolutePath);
        System.out.println("📁 Directory exists: " + uploadFolder.exists());

        if (!uploadFolder.exists()) {
            System.out.println("⚠️ WARNING: Thư mục không tồn tại, đang tạo mới...");
            uploadFolder.mkdirs();
        }

        File[] files = uploadFolder.listFiles();
        if (files != null && files.length > 0) {
            System.out.println("📸 Đang có " + files.length + " ảnh trong thư mục.");
        } else {
            System.out.println("⚠️ Thư mục đang rỗng!");
        }
        System.out.println("===========================================");

        // 2. ✅ CHỈNH SỬA QUAN TRỌNG NHẤT TẠI ĐÂY:
        // Đổi từ "/uploads/products/**" thành "/api/uploads/products/**" 
        // để khớp với link "/api/uploads/products/..." trong Database của bạn.
        registry.addResourceHandler("/api/uploads/products/**")
                .addResourceLocations("file:" + absolutePath);

        // Sơ cua thêm một handler nữa nếu bạn lỡ dùng link không có /api
        registry.addResourceHandler("/uploads/products/**")
                .addResourceLocations("file:" + absolutePath);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("*")
                .allowedHeaders("*");
    }
}