    package com.ecommerce.backend.repository.product;
    import com.ecommerce.backend.entity.auth.User;
    import com.ecommerce.backend.entity.product.Order;
    import org.springframework.data.jpa.repository.JpaRepository;
    import org.springframework.data.jpa.repository.Query;
    import org.springframework.data.repository.query.Param;
    import java.util.List;

    public interface OrderRepository extends JpaRepository<Order, Long> {
        // 2. THÊM DÒNG NÀY VÀO
        List<Order> findByUser(User user);
        long countByUser(User user);
        List<Order> findAllByOrderByCreatedAtDesc();

        // 2. Lấy theo trạng thái (Ví dụ: PENDING), sắp xếp mới nhất lên đầu
        List<Order> findByStatusOrderByCreatedAtDesc(String status);
        // ⭐ KIỂM TRA USER ĐÃ MUA PRODUCT CHƯA
        @Query("""
            SELECT COUNT(o) > 0
            FROM Order o
            JOIN o.orderItems i
            WHERE o.user.id = :userId
            AND i.product.id = :productId
            AND o.status = 'COMPLETED'
            """)
        boolean hasPurchased(@Param("userId") Long userId,
                             @Param("productId") Long productId);
    }
