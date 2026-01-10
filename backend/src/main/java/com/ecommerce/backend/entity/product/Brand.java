package com.ecommerce.backend.entity.product;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "brands")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Brand {
    @Id
    // Đánh dấu trường này là khóa chính (primary key).

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // Chiến lược sinh khóa chính: AUTO_INCREMENT (do database tự tăng giá trị ID).
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    // Cột name:
    // - không được để trống (nullable = false)
    // - không trùng lặp (unique = true)
    // - giới hạn tối đa 100 ký tự
    private String name;

    @Column(nullable = false,length = 500)
    private String logoUrl;
    @Transient // Đánh dấu để không tạo cột trong Database
    private long productCount;
    @OneToMany(mappedBy = "brand")
    @JsonBackReference
    // Thiết lập quan hệ 1-N (OneToMany) với bảng Product.
    // Một Brand có thể có nhiều Product.
    // mappedBy = "brand" nghĩa là khóa ngoại nằm bên lớp Product,
    // và bên đó có thuộc tính tên là "brand" trỏ ngược lại đây.
    private List<Product> products;
}