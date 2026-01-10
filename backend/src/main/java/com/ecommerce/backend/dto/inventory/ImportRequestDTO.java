package com.ecommerce.backend.dto.inventory;

import lombok.Data;
import java.util.List;

@Data
public class ImportRequestDTO {
    private String supplierName;
    private String note;
    private List<ImportItemDTO> items; // Danh sách hàng muốn nhập

    @Data
    public static class ImportItemDTO {
        private Long variantId;
        private Integer quantity;
        private Double importPrice;
    }
}