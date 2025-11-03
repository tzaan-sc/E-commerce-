package com.ecommerce.backend.repository.product;

import com.ecommerce.backend.entity.product.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Modifying // Báo hiệu đây là câu lệnh DML (Data Manipulation Language)
    @Query("UPDATE Product p SET p.brand = NULL WHERE p.brand.id = :brandId")
    void setBrandToNullByBrandId(Long brandId); // Thêm phương thức này
}