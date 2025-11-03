package com.ecommerce.backend.entity.product;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "screen_sizes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScreenSize {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Double value; // Ví dụ: 13.3, 14.0, 15.6, 17.3 inch


    @OneToMany(mappedBy = "screenSize")
    private List<Product> products;
}
