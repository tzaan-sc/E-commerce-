//package com.ecommerce.backend.config;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//import java.nio.file.Paths;
//
//@Configuration
//public class WebConfig implements WebMvcConfigurer {
//
//    @Value("${file.upload-dir}")
//    private String uploadDir;
//
//    @Override
//    public void addResourceHandlers(ResourceHandlerRegistry registry) {
//        registry.addResourceHandler("/uploads/**")
//                .addResourceLocations("file:uploads/");
//    }
//}
package com.ecommerce.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir:uploads/products/}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Chuyển thành đường dẫn tuyệt đối
        File uploadFolder = new File(uploadDir);
        String absolutePath = uploadFolder.getAbsolutePath() + File.separator;

        // Debug logging
        System.out.println("===========================================");
        System.out.println("📁 Upload directory: " + absolutePath);
        System.out.println("📁 Directory exists: " + uploadFolder.exists());
        System.out.println("📁 Directory is absolute: " + uploadFolder.isAbsolute());

        if (!uploadFolder.exists()) {
            System.out.println("⚠️ WARNING: Upload directory does not exist!");
            System.out.println("⚠️ Creating directory...");
            uploadFolder.mkdirs();
        }

        // List files in directory
        File[] files = uploadFolder.listFiles();
        if (files != null && files.length > 0) {
            System.out.println("📸 Files in upload directory:");
            for (File file : files) {
                System.out.println("  - " + file.getName());
            }
        } else {
            System.out.println("⚠️ No files found in upload directory!");
        }
        System.out.println("===========================================");

        // Map resource handler
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
