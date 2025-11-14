package com.ecommerce.backend.repository.product;

import com.ecommerce.backend.entity.product.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Modifying
    @Query("UPDATE Product p SET p.brand = NULL WHERE p.brand.id = :brandId")
    void setBrandToNullByBrandId(Long brandId);

    @Modifying
    @Query("UPDATE Product p SET p.screenSize = NULL WHERE p.screenSize.id = :screenSizeId")
    void setScreenSizeToNullByScreenSizeId(Long screenSizeId);

    // 👈 THÊM PHƯƠNG THỨC MỚI CHO USAGE PURPOSE
    @Modifying
    @Query("UPDATE Product p SET p.usagePurpose = NULL WHERE p.usagePurpose.id = :usagePurposeId")
    void setUsagePurposeToNullByUsagePurposeId(Long usagePurposeId);
}