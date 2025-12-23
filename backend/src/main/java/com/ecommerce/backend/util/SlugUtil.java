package com.ecommerce.backend.util;
import java.text.Normalizer;
import java.util.regex.Pattern;

public class SlugUtil {

    // Hàm chuyển đổi sang slug (ví dụ: "Sản phẩm mới" -> "san-pham-moi")
    public static String toSlug(String text) {
        // 1. Loại bỏ dấu
        String slug = removeDiacritics(text);

        // 2. Chuyển sang chữ thường
        slug = slug.toLowerCase();

        // 3. Thay thế khoảng trắng và ký tự đặc biệt bằng dấu gạch ngang
        slug = slug.replaceAll("[^a-z0-9\\s-]", ""); // Giữ lại chữ, số, khoảng trắng, gạch ngang
        slug = slug.replaceAll("[\\s]+", "-");       // Thay thế nhiều khoảng trắng thành 1 dấu gạch ngang
        slug = slug.replaceAll("^-|-$", "");          // Loại bỏ dấu gạch ngang ở đầu/cuối

        return slug;
    }

    // ⭐ HÀM MỚI: Loại bỏ dấu tiếng Việt (được sử dụng trong toSlug và search)
    public static String removeDiacritics(String text) {
        if (text == null) return null;

        // Bước 1: Chuẩn hóa Unicode (NFD) để tách dấu khỏi chữ
        String temp = Normalizer.normalize(text, Normalizer.Form.NFD);

        // Bước 2: Xóa các ký tự dấu (CombiningDiacriticalMarks)
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        String result = pattern.matcher(temp).replaceAll("");

        // Bước 3: Thay thế riêng ký tự 'Đ'/'đ'
        result = result.replaceAll("Đ", "D").replaceAll("đ", "d");

        return result;
    }
}