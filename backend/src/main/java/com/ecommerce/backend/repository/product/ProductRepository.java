package com.ecommerce.backend.repository.product;

import com.ecommerce.backend.entity.product.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Modifying
    @Query("UPDATE Product p SET p.brand = NULL WHERE p.brand.id = :brandId")
    void setBrandToNullByBrandId(Long brandId);

    @Modifying
    @Query("UPDATE Product p SET p.screenSize = NULL WHERE p.screenSize.id = :screenSizeId")
    void setScreenSizeToNullByScreenSizeId(Long screenSizeId);

    @Modifying
    @Query("UPDATE Product p SET p.usagePurpose = NULL WHERE p.usagePurpose.id = :usagePurposeId")
    void setUsagePurposeToNullByUsagePurposeId(Long usagePurposeId);
    List<Product> findByBrandId(Long brandId);
    @Query("SELECT p FROM Product p WHERE p.usagePurpose.id = :id")
    List<Product> findByUsagePurposeId(@Param("id") Long usagePurposeId);
    // Tìm sản phẩm theo ID nhu cầu VÀ ID thương hiệu
    @Query("SELECT p FROM Product p WHERE p.usagePurpose.id = :purposeId AND p.brand.id = :brandId")
    List<Product> findByUsagePurposeIdAndBrandId(
            @Param("purposeId") Long purposeId,
            @Param("brandId") Long brandId
    );
}
