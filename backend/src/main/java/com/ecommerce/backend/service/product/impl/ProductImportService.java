package com.ecommerce.backend.service.product.impl;

import com.ecommerce.backend.entity.product.*;
import com.ecommerce.backend.entity.product.variant.*; // Import toàn bộ variant entities
import com.ecommerce.backend.repository.product.*;
import com.ecommerce.backend.repository.product.*;
import com.ecommerce.backend.util.SlugUtil;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ProductImportService {

    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final UsagePurposeRepository usagePurposeRepository;
    private final ScreenSizeRepository screenSizeRepository;

    private final RamRepository ramRepository;
    private final GpuRepository gpuRepository;
    private final ChipRepository chipRepository;
    private final StorageRepository storageRepository;
    private final ColorRepository colorRepository;

    @Transactional(rollbackFor = Exception.class)
    public void importProducts(MultipartFile file) throws IOException {
        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(inputStream)) {

            Sheet sheet = workbook.getSheetAt(0);
            Map<String, Product> productMap = new LinkedHashMap<>();

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null || getCellValue(row.getCell(0)).isEmpty()) continue;

                int rowNum = i + 1;
                String productName = getCellValue(row.getCell(0));

                Product product;
                if (!productMap.containsKey(productName)) {
                    if (productRepository.existsByName(productName)) {
                        throw new RuntimeException("Dòng " + rowNum + ": Sản phẩm '" + productName + "' đã có trong hệ thống.");
                    }
                    product = createNewProductHeader(row, rowNum);
                    productMap.put(productName, product);
                } else {
                    product = productMap.get(productName);
                }

                // 1. ĐỌC GIÁ VÀ KHO BIẾN THỂ (Cột Q, R)
                double vPrice = parseDouble(getCellValue(row.getCell(16)), rowNum, "Giá biến thể");
                int vStock = (int) parseDouble(getCellValue(row.getCell(17)), rowNum, "Kho biến thể");

                // 2. TRA CỨU LINH KIỆN (S, T, U, V, W)
                Ram ram = ramRepository.findByRamSize(getCellValue(row.getCell(18))).orElse(null);
                Gpu gpu = gpuRepository.findByGpuName(getCellValue(row.getCell(19))).orElse(null);
                Chip chip = chipRepository.findByCpuName(getCellValue(row.getCell(20))).orElse(null);
                Storage storage = storageRepository.findByCapacity(getCellValue(row.getCell(21))).orElse(null);

                // ✅ FIX LỖI AMBIGUOUS COLOR: Gọi đích danh class Color trong package của bạn
                com.ecommerce.backend.entity.product.variant.Color color = colorRepository.findByColorName(getCellValue(row.getCell(22))).orElse(null);

                // 3. TẠO BIẾN THỂ
                ProductVariant variant = ProductVariant.builder()
                        .sku(getCellValue(row.getCell(15)))
                        .price(vPrice)
                        .stockQuantity(vStock)
                        .ram(ram)
                        .gpu(gpu)
                        .chip(chip)
                        .storage(storage)
                        .color(color)
                        .ramCapacity(getCellValue(row.getCell(23))) // Cột X: RAM Text
                        .storageCapacity(getCellValue(row.getCell(21)))
                        .colorName(getCellValue(row.getCell(22)))
                        .image(product.getImageUrl()) // Ảnh đại diện biến thể lấy từ ảnh chính SP
                        .product(product)
                        .isActive(true)
                        .images(new ArrayList<>()) // Khởi tạo list ảnh phụ cho biến thể
                        .build();

                // 4. ✅ XỬ LÝ ẢNH PHỤ CHO BIẾN THỂ (Cột Y - Index 24)
                String rawVariantImages = getCellValue(row.getCell(24));
                if (!rawVariantImages.isEmpty()) {
                    for (String url : rawVariantImages.split(";")) {
                        if (!url.trim().isEmpty()) {
                            VariantImage vImg = new VariantImage();
                            vImg.setImageUrl(url.trim());
                            vImg.setProductVariant(variant);
                            variant.getImages().add(vImg);
                        }
                    }
                }

                if (product.getVariants() == null) product.setVariants(new ArrayList<>());
                product.getVariants().add(variant);

                // 5. CẬP NHẬT THÔNG TIN TỔNG CHO CHA
                if (product.getPrice() == 0.0) product.setPrice(vPrice);
                product.setStockQuantity(product.getStockQuantity() + vStock);
            }
            productRepository.saveAll(productMap.values());
        }
    }

    private Product createNewProductHeader(Row row, int rowNum) {
        Product product = Product.builder()
                .name(getCellValue(row.getCell(0)))
                .description(getCellValue(row.getCell(1)))
                .imageUrl(getCellValue(row.getCell(5)))
                .slug(SlugUtil.toSlug(getCellValue(row.getCell(0))))
                .status("ACTIVE")
                .price(0.0)
                .stockQuantity(0)
                .build();

        brandRepository.findByName(getCellValue(row.getCell(2))).ifPresent(product::setBrand);
        usagePurposeRepository.findByName(getCellValue(row.getCell(3))).ifPresent(product::setUsagePurpose);
        double ss = parseDouble(getCellValue(row.getCell(4)), rowNum, "Màn hình");
        screenSizeRepository.findByValue(ss).ifPresent(product::setScreenSize);

        ProductSpecification spec = ProductSpecification.builder()
                .resolution(getCellValue(row.getCell(6))).refreshRate(getCellValue(row.getCell(7)))
                .panelType(getCellValue(row.getCell(8))).battery(getCellValue(row.getCell(9)))
                .weight(getCellValue(row.getCell(10))).os(getCellValue(row.getCell(11)))
                .wifi(getCellValue(row.getCell(12))).bluetooth(getCellValue(row.getCell(13)))
                .ports(getCellValue(row.getCell(14))).product(product).build();
        product.setSpecification(spec);

        return product;
    }

    private double parseDouble(String val, int row, String field) {
        try {
            if (val == null || val.isEmpty()) return 0;
            return Double.parseDouble(val.replace(",", "."));
        } catch (Exception e) {
            throw new RuntimeException("Dòng " + row + ": " + field + " không hợp lệ.");
        }
    }

    private String getCellValue(Cell cell) {
        if (cell == null) return "";
        return new DataFormatter().formatCellValue(cell).trim();
    }
}