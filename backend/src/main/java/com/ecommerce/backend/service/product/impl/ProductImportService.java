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

    // ✅ Chốt chặn quan trọng: Nếu 1 dòng lỗi, toàn bộ quá trình sẽ Rollback (không lưu dòng nào cả)
    @Transactional(rollbackFor = Exception.class)
    public void importProducts(MultipartFile file) throws IOException {
        List<Product> productList = new ArrayList<>();

        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(inputStream)) {

            Sheet sheet = workbook.getSheetAt(0);

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                // ✅ currentRowNumber xác định vị trí chính xác trong Excel để báo lỗi
                int currentRowNumber = i + 1;

                // 1. ĐỌC DỮ LIỆU TỪ EXCEL
                String name = getCellValue(row.getCell(0));
                if (name.isEmpty()) continue;

                // ✅ KIỂM TRA TRÙNG TÊN: Kiểm tra ngay trước khi tạo Object
                if (productRepository.existsByName(name)) {
                    throw new RuntimeException("Dòng " + currentRowNumber + ": Tên sản phẩm '" + name + "' đã tồn tại trong hệ thống.");
                }

                // ✅ VALIDATE GIÁ & KHO: Kiểm tra số âm hoặc định dạng không phải số
                double price = parseDoubleWithValidation(getCellValue(row.getCell(1)), currentRowNumber, "Giá");
                int stockQuantity = (int) parseDoubleWithValidation(getCellValue(row.getCell(2)), currentRowNumber, "Số lượng kho");

                String description = getCellValue(row.getCell(3));
                String rawSpecifications = getCellValue(row.getCell(4));
                String brandName = getCellValue(row.getCell(5));
                String purposeName = getCellValue(row.getCell(6));

                String screenSizeRaw = getCellValue(row.getCell(7));
                double screenSizeValue = parseDoubleWithValidation(screenSizeRaw, currentRowNumber, "Kích thước màn hình");

                String rawImages = getCellValue(row.getCell(8));

                // 2. TRA CỨU DỮ LIỆU DANH MỤC
                Brand brand = brandRepository.findByName(brandName)
                        .orElseThrow(() -> new RuntimeException("Dòng " + currentRowNumber + ": Không tìm thấy hãng '" + brandName + "'."));

                UsagePurpose purpose = usagePurposeRepository.findByName(purposeName)
                        .orElseThrow(() -> new RuntimeException("Dòng " + currentRowNumber + ": Không tìm thấy nhu cầu '" + purposeName + "'."));

                ScreenSize screenSize = screenSizeRepository.findByValue(screenSizeValue)
                        .orElseThrow(() -> new RuntimeException("Dòng " + currentRowNumber + ": Không tìm thấy màn hình " + screenSizeValue + " inch."));

                // 3. XỬ LÝ LOGIC & TẠO PRODUCT
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
                        .brand(brand)
                        .usagePurpose(purpose)
                        .screenSize(screenSize)
                        .build();

                // XỬ LÝ BÓC TÁCH THÔNG SỐ KỸ THUẬT
                ProductSpecification spec = parseSpecifications(rawSpecifications);
                spec.setProduct(product);
                product.setSpecification(spec);

                // 4. XỬ LÝ ẢNH
                List<ImageProduct> images = new ArrayList<>();
                if (!rawImages.isEmpty()) {
                    String[] urls = rawImages.split(";");
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

            if (!productList.isEmpty()) {
                productRepository.saveAll(productList);
            }
        }
    }

    /**
     * ✅ Hàm parse Double tích hợp Validation để báo lỗi dòng cụ thể
     */
    private double parseDoubleWithValidation(String value, int row, String fieldName) {
        try {
            if (value == null || value.trim().isEmpty()) return 0;
            String standardized = value.replace(",", ".").trim();
            double result = Double.parseDouble(standardized);

            if (result < 0) {
                throw new RuntimeException("Dòng " + row + ": " + fieldName + " không được là số âm.");
            }
            return result;
        } catch (NumberFormatException e) {
            throw new RuntimeException("Dòng " + row + ": " + fieldName + " không đúng định dạng số.");
        }
    }

    private ProductSpecification parseSpecifications(String rawText) {
        ProductSpecification spec = new ProductSpecification();
        spec.setCpu(extractValue(rawText, "Loại CPU", "Cổng giao tiếp"));
        spec.setVga(extractValue(rawText, "Loại card đồ họa", "Dung lượng RAM"));
        spec.setScreenDetail(extractValue(rawText, "Kích thước màn hình", "Công nghệ màn hình"));
        spec.setResolution(extractValue(rawText, "Độ phân giải màn hình", "Loại CPU"));
        spec.setStorageType(extractValue(rawText, "Ổ cứng", "Kích thước màn hình"));
        spec.setOtherSpecs(rawText);
        return spec;
    }

    private String extractValue(String text, String startKey, String endKey) {
        if (text == null || !text.contains(startKey)) return "N/A";
        try {
            int start = text.indexOf(startKey) + startKey.length();
            int end = text.indexOf(endKey);
            if (end == -1 || end < start) return text.substring(start).trim();
            return text.substring(start, end).trim();
        } catch (Exception e) { return "N/A"; }
    }

    private String getCellValue(Cell cell) {
        if (cell == null) return "";
        DataFormatter formatter = new DataFormatter();
        return formatter.formatCellValue(cell).trim();
    }

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