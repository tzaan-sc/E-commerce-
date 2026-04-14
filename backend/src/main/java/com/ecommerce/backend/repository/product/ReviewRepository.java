package com.ecommerce.backend.repository.product;

import com.ecommerce.backend.entity.product.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProductIdAndApprovedTrue(Long productId);

    List<Review> findByProductIdAndStarAndApprovedTrue(Long productId, int star);

    List<Review> findByApprovedFalse();

    @Query("SELECT AVG(r.star) FROM Review r WHERE r.product.id = :productId AND r.approved = true")
    Double getAverageStar(@Param("productId") Long productId);

    // 🔥 CHUẨN: kiểm tra theo từng lần mua
    boolean existsByOrderItemId(Long orderItemId);
}