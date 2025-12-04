package com.ecommerce.backend.controller.upload;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/api/uploads")
@CrossOrigin(origins = "*")
public class FileUploadController {

    // Quy định cứng thư mục lưu là "uploads" nằm ngay tại thư mục gốc dự án
    private final Path rootLocation = Paths.get("uploads");

    public FileUploadController() {
        try {
            // Tạo thư mục gốc và thư mục con products nếu chưa có
            Files.createDirectories(rootLocation.resolve("products"));
        } catch (IOException e) {
            throw new RuntimeException("Không thể khởi tạo thư mục lưu trữ!", e);
        }
    }

    // ========================================================================
    // 1. API XEM ẢNH (MỚI - Thay thế cho cấu hình WebMvcConfig)
    // Đường dẫn gọi: http://localhost:8080/api/uploads/products/{filename}
    // ========================================================================
    @GetMapping("/products/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path file = rootLocation.resolve("products").resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG) // Hoặc tự động nhận diện loại file
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ========================================================================
    // 2. API UPLOAD TỪ FILE (MÁY TÍNH)
    // ========================================================================
    @PostMapping("/image")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "File trống"));
            }
            return saveFile(file.getInputStream(), file.getOriginalFilename(), file.getContentType());
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("error", "Lỗi upload: " + e.getMessage()));
        }
    }

    // ========================================================================
    // 3. API UPLOAD TỪ URL (LINK ONLINE)
    // ========================================================================
    @PostMapping("/image-from-url")
    public ResponseEntity<Map<String, String>> uploadImageFromUrl(@RequestBody Map<String, String> payload) {
        String imageUrl = payload.get("url");
        if (imageUrl == null || imageUrl.trim().isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "URL trống"));

        // Nếu là link nội bộ của hệ thống mình thì trả về luôn
        if (imageUrl.contains("/api/uploads/products/")) {
            String relativePath = imageUrl.substring(imageUrl.indexOf("/api/uploads/"));
            return ResponseEntity.ok(Map.of("url", relativePath, "message", "Link nội bộ"));
        }

        try {
            URL url = new URL(imageUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestProperty("User-Agent", "Mozilla/5.0"); // Giả lập trình duyệt
            connection.setConnectTimeout(5000);
            connection.setReadTimeout(5000);
            connection.connect();

            String contentType = connection.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Link không phải ảnh"));
            }

            String path = url.getPath();
            String originalFilename = path.substring(path.lastIndexOf('/') + 1);
            if (originalFilename.isEmpty()) originalFilename = "image_downloaded";

            return saveFile(connection.getInputStream(), originalFilename, contentType);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Lỗi tải ảnh: " + e.getMessage()));
        }
    }

    // ========================================================================
    // HÀM LƯU FILE CHUNG
    // ========================================================================
    private ResponseEntity<Map<String, String>> saveFile(InputStream inputStream, String originalFilename, String contentType) throws IOException {
        // 1. Xác định đuôi file
        String extension = ".jpg";
        if (originalFilename != null && originalFilename.contains(".")) {
            String ext = originalFilename.substring(originalFilename.lastIndexOf("."));
            if (ext.matches("^\\.[a-zA-Z0-9]+$")) extension = ext;
            else extension = getExtensionFromMimeType(contentType);
        } else {
            extension = getExtensionFromMimeType(contentType);
        }

        // 2. Tạo tên file mới
        String uniqueFilename = UUID.randomUUID().toString() + extension;

        // 3. Lưu vào thư mục: uploads/products/
        Path destinationFile = rootLocation.resolve("products").resolve(uniqueFilename);

        try (inputStream) {
            Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
        }

        // 4. Trả về đường dẫn API xem ảnh (Thay đổi hướng tại đây)
        // Cũ: /uploads/products/... (cần WebMvcConfig)
        // Mới: /api/uploads/products/... (đi qua Controller này)
        String fileUrl = "/api/uploads/products/" + uniqueFilename;

        return ResponseEntity.ok(Map.of(
                "url", fileUrl,
                "message", "Upload thành công"
        ));
    }

    private String getExtensionFromMimeType(String mimeType) {
        if (mimeType == null) return ".jpg";
        switch (mimeType.toLowerCase()) {
            case "image/png": return ".png";
            case "image/gif": return ".gif";
            case "image/webp": return ".webp";
            default: return ".jpg";
        }
    }
}