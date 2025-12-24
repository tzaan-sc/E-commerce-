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
    boolean existsBySlug(String slug);

    //thêm các hàm đếm số lượng sản phẩm theo từng danh mục để kiểm tra nhanh
    long countByBrandId(Long brandId);
    long countByUsagePurposeId(Long usagePurposeId);
    long countByScreenSizeId(Long screenSizeId);
    // 👇 THÊM HÀM NÀY: Kiểm tra tồn tại theo tên
    boolean existsByName(String name);

    // 👇 THÊM HÀM NÀY: Kiểm tra tồn tại theo tên NHƯNG trừ ID hiện tại ra (Dùng cho Update)
    boolean existsByNameAndIdNot(String name, Long id);

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

    // Trong ProductRepository.java
    @Query(value = "SELECT * FROM products p WHERE " +
            "MATCH(p.name, p.description) AGAINST (:keyword IN BOOLEAN MODE)",
            nativeQuery = true)
    List<Product> fullTextSearch(@Param("keyword") String keyword);

    //// Ghi chú: Logic sắp xếp (sortBy) sẽ được giữ lại trong Service Impl như bạn đã code.
    @Query("SELECT DISTINCT p FROM Product p " +
            "LEFT JOIN p.brand b " +
            "LEFT JOIN p.usagePurpose up " +
            "LEFT JOIN p.screenSize ss " +
            "WHERE (:keyword IS NULL OR :keyword = '' OR " +
            "   LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "   LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))" + // <== THÊM DÒNG NÀY
            ") " +
            "AND (:brandIds IS NULL OR b.id IN :brandIds) " +
            "AND (:purposeId IS NULL OR up.id = :purposeId) " +
            "AND (:screenSizeId IS NULL OR ss.id = :screenSizeId) " +
            "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
            "AND (:maxPrice IS NULL OR p.price <= :maxPrice)")
    List<Product> advancedFilter(
            @Param("keyword") String keyword,
            @Param("brandIds") List<Long> brandIds,
            @Param("purposeId") Long purposeId,
            @Param("screenSizeId") Long screenSizeId,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice
    );
}