package com.ecommerce.backend.controller.upload;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/api/uploads")
@CrossOrigin(origins = "*")
public class FileUploadController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    // API 1: Upload file từ máy tính (Giữ nguyên cái cũ của bạn)
    @PostMapping("/image")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "File không được để trống"));
            }
            // ... (Giữ nguyên logic cũ của bạn ở đây) ...
            // Để code gọn, mình viết tóm tắt lại phần xử lý lưu file
            return saveFile(file.getInputStream(), file.getOriginalFilename(), file.getSize(), file.getContentType());
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("error", "Lỗi upload: " + e.getMessage()));
        }
    }

    // 👇 API 2: Upload từ đường dẫn URL (MỚI THÊM)
    @PostMapping("/image-from-url")
    public ResponseEntity<Map<String, String>> uploadImageFromUrl(@RequestBody Map<String, String> payload) {
        String imageUrl = payload.get("url");

        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "URL không được để trống"));
        }

        try {
            URL url = new URL(imageUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            // Giả lập trình duyệt để tránh bị chặn bởi một số CDN (như CellphoneS)
            connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
            connection.connect();

            // Kiểm tra xem link có phải là ảnh không
            String contentType = connection.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body(Map.of("error", "URL không phải là file hình ảnh hợp lệ"));
            }

            // Lấy tên file gốc từ URL (xử lý cắt bỏ các tham số query ?...)
            String path = url.getPath();
            String originalFilename = path.substring(path.lastIndexOf('/') + 1);

            // Lưu file
            InputStream inputStream = connection.getInputStream();
            return saveFile(inputStream, originalFilename, connection.getContentLengthLong(), contentType);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Không thể tải ảnh từ URL: " + e.getMessage()));
        }
    }

    // Hàm phụ trợ để lưu file (Dùng chung cho cả 2 cách)
    private ResponseEntity<Map<String, String>> saveFile(InputStream inputStream, String originalFilename, long size, String contentType) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Xác định đuôi file
        String extension = ".jpg"; // Mặc định
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        } else if (contentType != null) {
            // Nếu URL không có đuôi, đoán qua content-type
            if (contentType.contains("png")) extension = ".png";
            else if (contentType.contains("webp")) extension = ".webp";
            else if (contentType.contains("gif")) extension = ".gif";
        }

        // Tạo tên file ngẫu nhiên
        String uniqueFilename = UUID.randomUUID().toString() + extension;
        Path filePath = uploadPath.resolve(uniqueFilename);

        // Copy dữ liệu vào ổ cứng
        Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);

        // Đóng luồng nếu cần (Files.copy tự động đóng, nhưng inputStream từ URL connection cần chú ý)
        inputStream.close();

        // URL trả về cho FE
        String fileUrl = "/uploads/products/" + uniqueFilename;

        Map<String, String> response = new HashMap<>();
        response.put("url", fileUrl);
        response.put("filename", uniqueFilename);
        response.put("originalFilename", originalFilename);
        response.put("message", "Upload thành công");

        return ResponseEntity.ok(response);
    }
}