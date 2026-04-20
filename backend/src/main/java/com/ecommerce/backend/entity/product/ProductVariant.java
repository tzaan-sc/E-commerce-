package com.ecommerce.backend.entity.product;

import com.ecommerce.backend.entity.product.variant.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

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

    @NotBlank(message = "SKU không được để trống")
    @Column(unique = true, nullable = false)
    private String sku;

    @NotNull(message = "Giá không được để trống")
    @PositiveOrZero(message = "Giá tiền phải lớn hơn hoặc bằng 0")
    private Double price;

    // ✅ Từ code Đánh giá: Giá nhập để tính toán lợi nhuận
    private Double importPrice;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 0, message = "Số lượng phải lớn hơn hoặc bằng 0")
    @Column(name = "stock_quantity")
    @Builder.Default
    private Integer stockQuantity = 0;

    @Builder.Default
    private Boolean isActive = true;

    // ✅ Từ code Đánh giá: Ghi chú kho/bảo hành
    @Column(columnDefinition = "TEXT")
    private String note;

    // ✅ Từ code Đánh giá: Ảnh đại diện đơn giản
    private String image;

    // ✅ Từ code Khuyến mãi: Danh sách ảnh chi tiết (Sửa lỗi getImages())
    @OneToMany(mappedBy = "productVariant", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<VariantImage> images = new ArrayList<>();

    // ✅ Từ code Đánh giá: Chống Race Condition (Cực quan trọng khi thanh toán)
    @Version
    private Long version;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonBackReference // Giữ cái này để tránh vòng lặp vô tận khi trả JSON
    @ToString.Exclude
    private Product product;

    // --- PHẦN 1: CẤU HÌNH THEO BẢNG (Từ code Thanh toán - Dùng cho lọc SP) ---
    @ManyToOne @JoinColumn(name = "ram_id") private Ram ram;
    @ManyToOne @JoinColumn(name = "gpu_id") private Gpu gpu;
    @ManyToOne @JoinColumn(name = "chip_id") private Chip chip;
    @ManyToOne @JoinColumn(name = "storage_id") private Storage storage;
    @ManyToOne @JoinColumn(name = "color_id") private Color color;

    // --- PHẦN 2: CẤU HÌNH THEO CHUỖI (Từ code Đánh giá - Dùng cho Excel/Frontend nhanh) ---
    private String ramCapacity;   // Ví dụ: 16GB
    private String storageCapacity; // Ví dụ: 512GB SSD
    private String colorName;       // Đổi tên chút để tránh trùng với Object Color ở trên
}