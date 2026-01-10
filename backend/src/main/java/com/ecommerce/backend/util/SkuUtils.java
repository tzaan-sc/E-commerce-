package com.ecommerce.backend.util;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public class SkuUtils {

    // Danh sách từ viết tắt (Giữ nguyên logic của bạn)
    private static String abbreviate(String input) {
        String u = input.toUpperCase();
        if (u.contains("INSPIRON")) return "INS";
        if (u.contains("VOSTRO")) return "VOS";
        if (u.contains("MACBOOK AIR")) return "MBA";
        if (u.contains("MACBOOK PRO")) return "MBP";
        if (u.contains("THINKPAD")) return "TP";
        if (u.contains("GAMING")) return "GM";
        return null;
    }

    // Danh sách Mã màu (Giữ nguyên logic của bạn)
    private static String getColorCode(String color) {
        if (color == null || color.isEmpty()) return "";
        String c = removeAccents(color).toUpperCase();
        if (c.contains("DEN") || c.contains("BLACK")) return "BLK";
        if (c.contains("TRANG") || c.contains("WHITE")) return "WHT";
        if (c.contains("BAC") || c.contains("SILVER")) return "SLV";
        if (c.contains("XAM") || c.contains("GRAY") || c.contains("GREY")) return "GRY";
        if (c.contains("DO") || c.contains("RED")) return "RED";
        if (c.contains("XANH") || c.contains("BLUE")) return "BLU";
        if (c.contains("VANG") || c.contains("GOLD")) return "GLD";
        return slugify(c);
    }

    // --- HÀM CHÍNH: TẠO SKU (ĐÃ CHỈNH SỬA ĐẦU VÀO) ---
    // Thay vì String attributesJson, ta truyền trực tiếp các trường đã tách
    public static String generateSku(String productName, String ram, String storage, String color) {
        StringBuilder sku = new StringBuilder();

        // 1. XỬ LÝ TÊN SẢN PHẨM (Thương hiệu - Dòng - Model)
        String cleanName = removeAccents(productName).toUpperCase();
        String abbr = abbreviate(cleanName);

        if (abbr != null) {
            String[] parts = cleanName.split("\\s+");
            if (parts.length > 0) sku.append(parts[0]).append("-");
            sku.append(abbr).append("-");
            for (String p : parts) {
                if (p.matches(".*\\d.*")) {
                    sku.append(p).append("-");
                }
            }
        } else {
            String[] parts = cleanName.split("\\s+");
            int limit = Math.min(parts.length, 3);
            for (int i = 0; i < limit; i++) {
                sku.append(slugify(parts[i])).append("-");
            }
        }

        // 2. XỬ LÝ CẤU HÌNH (Lấy trực tiếp từ tham số, không parse JSON nữa)
        if (ram != null && !ram.isEmpty()) {
            sku.append(ram.toUpperCase().replace("GB", "G").replace(" ", "")).append("-");
        }

        if (storage != null && !storage.isEmpty()) {
            // Tách lấy số từ SSD/HDD (VD: 512GB SSD -> 512)
            String st = storage.toUpperCase().replace("GB", "").replace("TB", "T").replace(" ", "");
            sku.append(st).append("-");
        }

        // 3. XỬ LÝ MÀU SẮC
        String colorCode = getColorCode(color);
        if (!colorCode.isEmpty()) {
            sku.append(colorCode);
        }

        // Xóa dấu gạch ngang thừa ở cuối
        String result = sku.toString();
        if (result.endsWith("-")) {
            result = result.substring(0, result.length() - 1);
        }

        return result.toUpperCase();
    }

    // --- CÁC HÀM PHỤ TRỢ (Giữ nguyên) ---
    public static String removeAccents(String input) {
        if (input == null) return "";
        String nfd = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(nfd).replaceAll("").replace("đ", "d").replace("Đ", "D");
    }

    private static String slugify(String input) {
        return input.replaceAll("[^a-zA-Z0-9]", "");
    }
}