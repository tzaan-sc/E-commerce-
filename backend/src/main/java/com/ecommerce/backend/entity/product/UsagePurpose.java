package com.ecommerce.backend.entity.product;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "usage_purposes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsagePurpose {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name; // Ví dụ: Gaming, Văn phòng, Đồ họa, Học tập

    @Transient
    private long productCount;
    @OneToMany(mappedBy = "usagePurpose")

    private List<Product> products;
}
