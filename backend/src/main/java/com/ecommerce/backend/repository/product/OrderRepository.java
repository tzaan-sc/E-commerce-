package com.ecommerce.backend.repository.product;

import com.ecommerce.backend.entity.auth.User;
import com.ecommerce.backend.entity.product.Order;
import com.ecommerce.backend.entity.product.PaymentStatus;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // ✅ PHẦN 1: CƠ BẢN (Dùng cho cả 2 bên)
    List<Order> findByUser(User user);

    // Fix lỗi "cannot find symbol findByUserId" cho ReviewService
    List<Order> findByUserId(Long userId);

    long countByUser(User user);

    List<Order> findAllByOrderByCreatedAtDesc();
    
    @EntityGraph(attributePaths = {"orderItems", "orderItems.product", "orderItems.product.images"})
List<Order> findByUserOrderByCreatedAtDesc(User user);

    List<Order> findByStatusOrderByCreatedAtDesc(String status);

    // ✅ PHẦN 2: THANH TOÁN (Chống Race Condition khi Ngrok bắn webhook nhiều lần)
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT o FROM Order o WHERE o.id = :id")
    Optional<Order> findByIdWithLock(@Param("id") Long id);

    // ✅ PHẦN 3: ĐÁNH GIÁ (Kiểm tra xem user đã mua và hoàn tất đơn hàng chưa)
    @Query("""
        SELECT COUNT(o) > 0
        FROM Order o
        JOIN o.orderItems i
        WHERE o.user.id = :userId
        AND i.product.id = :productId
        AND (o.status = 'COMPLETED' OR o.status = 'DELIVERED')
        """)
    boolean hasPurchased(@Param("userId") Long userId,
                         @Param("productId") Long productId);

@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("""
    SELECT o FROM Order o
    WHERE o.status = :status
      AND o.paymentStatus = :paymentStatus
      AND o.paymentMethod = :paymentMethod
      AND o.createdAt < :cutoff
""")
List<Order> findAbandonedVietQROrders(
        @Param("status") String status,
        @Param("paymentStatus") PaymentStatus paymentStatus,
        @Param("paymentMethod") String paymentMethod,
        @Param("cutoff") LocalDateTime cutoff
);
}