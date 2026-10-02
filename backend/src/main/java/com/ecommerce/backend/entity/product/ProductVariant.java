package com.ecommerce.backend.entity.product;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "product_variants")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Liên kết với bảng Products (Sản phẩm cha)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnore // Ngăn chặn vòng lặp vô tận khi convert sang JSON
    private Product product;

    // Mã SKU (VD: DELL-XPS-BLACK) - Phải là duy nhất
    @Column(unique = true, nullable = false)
    private String sku;

    // Giá riêng cho biến thể này (VD: Màu vàng đắt hơn màu đen)
    private Double price;

    // Số lượng tồn kho
    @Column(name = "stock_quantity")
    private Integer stockQuantity;

    // Ảnh riêng cho biến thể (Để hiển thị khi chọn màu)
    private String image;

    // Lưu các thuộc tính dạng JSON string cho đơn giản
    // Ví dụ: [{"k": "Màu", "v": "Đen"}, {"k": "RAM", "v": "16GB"}]
    @Column(name = "attributes_json", columnDefinition = "TEXT")
    private String attributesJson;
}