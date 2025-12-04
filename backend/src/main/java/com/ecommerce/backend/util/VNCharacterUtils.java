package com.ecommerce.backend.util;

import java.text.Normalizer;
import java.util.regex.Pattern;

public class VNCharacterUtils {

    public static String removeAccent(String s) {
        if (s == null) return "";
        // Chuyển về dạng chuẩn hóa để tách dấu ra khỏi ký tự
        String temp = Normalizer.normalize(s, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        // Xóa dấu và chuyển về chữ thường
        return pattern.matcher(temp).replaceAll("").toLowerCase().replaceAll("đ", "d");
    }
}