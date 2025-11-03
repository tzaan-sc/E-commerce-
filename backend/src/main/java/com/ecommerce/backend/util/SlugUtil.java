package com.ecommerce.backend.util;

public class SlugUtil {
    public static String toSlug(String input) {
        if (input == null) return null;
        return input.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "") // xoá ký tự đặc biệt
                .replaceAll("\\s+", "-");        // đổi space → dấu -
    }
}
