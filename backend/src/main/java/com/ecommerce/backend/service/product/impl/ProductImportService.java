package com.ecommerce.backend.service.product.impl;

import com.ecommerce.backend.entity.product.*;
import com.ecommerce.backend.repository.product.*;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ProductImportService {

    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final UsagePurposeRepository usagePurposeRepository;
    private final ScreenSizeRepository screenSizeRepository;

    @Transactional
    public void importProducts(MultipartFile file) throws IOException {
        List<Product> productList = new ArrayList<>();

        // Sử dụng try-with-resources để tự động đóng file sau khi đọc xong
        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(inputStream)) {

            Sheet sheet = workbook.getSheetAt(0);

            // Duyệt từ dòng 1 (bỏ qua dòng tiêu đề index 0)
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                // 👇 BIẾN TẠM: Để sửa lỗi "local variables must be final" trong Lambda
                int currentRow = i + 1;

                // ============================================================
                // 1. ĐỌC DỮ LIỆU TỪ EXCEL (CẤU TRÚC MỚI)
                // ============================================================

                // Cột A (0): Tên sản phẩm
                String name = getCellValue(row.getCell(0));
                if (name.isEmpty()) continue;

                // Cột B (1): Giá (Tự sửa 20.000 -> 20000)
                double price = parseDouble(getCellValue(row.getCell(1)));

                // Cột C (2): Số lượng
                int stockQuantity = (int) parseDouble(getCellValue(row.getCell(2)));

                // Cột D (3): Mô tả
                String description = getCellValue(row.getCell(3));

                // 👇👇👇 CỘT E (4): THÔNG SỐ KỸ THUẬT (MỚI) 👇👇👇
                String specifications = getCellValue(row.getCell(4));
                // 👆👆👆 -------------------------------------- 👆👆👆

                // --- CÁC CỘT SAU BỊ ĐẨY LÙI LẠI ---

                // Cột F (5): Hãng (Brand)
                String brandName = getCellValue(row.getCell(5));

                // Cột G (6): Nhu cầu (Purpose)
                String purposeName = getCellValue(row.getCell(6));

                // Cột H (7): Màn hình (Screen Size) - Tự sửa 15,6 -> 15.6
                double screenSizeValue = parseDouble(getCellValue(row.getCell(7)));

                // Cột I (8): Ảnh (Images) - Ngăn cách bằng dấu chấm phẩy ;
                String rawImages = getCellValue(row.getCell(8));


                // ============================================================
                // 2. TRA CỨU DỮ LIỆU (LOOKUP)
                // ============================================================

                Brand brand = brandRepository.findByName(brandName)
                        .orElseThrow(() -> new RuntimeException("Dòng " + currentRow + ": Không tìm thấy hãng '" + brandName + "'. Hãy kiểm tra lại tên trong Database."));

                UsagePurpose purpose = usagePurposeRepository.findByName(purposeName)
                        .orElseThrow(() -> new RuntimeException("Dòng " + currentRow + ": Không tìm thấy nhu cầu '" + purposeName + "'."));

                ScreenSize screenSize = screenSizeRepository.findByValue(screenSizeValue)
                        .orElseThrow(() -> new RuntimeException("Dòng " + currentRow + ": Không tìm thấy màn hình " + screenSizeValue + " inch."));


                // ============================================================
                // 3. XỬ LÝ LOGIC & TẠO PRODUCT
                // ============================================================

                // Tạo Slug
                String slug = generateSlug(name);
                if (productRepository.existsBySlug(slug)) {
                    slug = slug + "-" + System.currentTimeMillis();
                }

                Product product = Product.builder()
                        .name(name)
                        .slug(slug)
                        .price(price)
                        .stockQuantity(stockQuantity)
                        .description(description)
                        .specifications(specifications) // ✅ Gán thông số kỹ thuật
                        .brand(brand)
                        .usagePurpose(purpose)
                        .screenSize(screenSize)
                        // .imageUrl(...) // Nếu muốn gán ảnh đầu tiên làm ảnh đại diện luôn thì xử lý ở dưới
                        .build();

                // ============================================================
                // 4. XỬ LÝ ẢNH (LIST ẢNH PHỤ)
                // ============================================================

                List<ImageProduct> images = new ArrayList<>();
                if (!rawImages.isEmpty()) {
                    String[] urls = rawImages.split(";");

                    // Nếu có ảnh, lấy ảnh đầu tiên làm ảnh đại diện (imageUrl trong Product)
                    if (urls.length > 0) {
                        // product.setImageUrl(urls[0].trim()); // Uncomment dòng này nếu Entity Product có trường imageUrl riêng
                    }

                    for (String url : urls) {
                        if (!url.trim().isEmpty()) {
                            ImageProduct img = ImageProduct.builder()
                                    .name(name)
                                    .urlImage(url.trim())
                                    .product(product)
                                    .build();
                            images.add(img);
                        }
                    }
                }
                product.setImages(images);

                productList.add(product);
            }

            // ============================================================
            // 5. LƯU VÀO DATABASE
            // ============================================================
            if (!productList.isEmpty()) {
                productRepository.saveAll(productList);
            }
        }
    }

    // ==========================================
    // CÁC HÀM HỖ TRỢ (HELPER METHODS)
    // ==========================================

    private String getCellValue(Cell cell) {
        if (cell == null) return "";
        DataFormatter formatter = new DataFormatter();
        return formatter.formatCellValue(cell).trim();
    }

    // Hàm chuyển đổi số an toàn (Hỗ trợ dấu phẩy)
    private double parseDouble(String value) {
        try {
            if (value == null || value.trim().isEmpty()) {
                return 0;
            }
            // Thay dấu phẩy thành dấu chấm (Fix lỗi nhập liệu kiểu VN)
            String standardized = value.replace(",", ".").trim();
            return Double.parseDouble(standardized);
        } catch (NumberFormatException e) {
            System.err.println("Lỗi convert số: " + value);
            return 0;
        }
    }

    // Hàm tạo Slug
    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    public String generateSlug(String input) {
        if (input == null) return "";
        String nowhitespace = WHITESPACE.matcher(input).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH);
    }
}