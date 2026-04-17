package com.ecommerce.backend.repository.product;

import com.ecommerce.backend.entity.auth.User;
import com.ecommerce.backend.entity.product.Order;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUser(User user);

    long countByUser(User user);

    List<Order> findAllByOrderByCreatedAtDesc();

    List<Order> findByStatusOrderByCreatedAtDesc(String status);

    /**
     * Lấy Order kèm DB-level PESSIMISTIC WRITE lock.
     * Dùng trong processWebhook() để chống Race Condition khi Ngrok
     * bắn nhiều request đồng thời cho cùng một orderId.
     * Lock được giữ đến khi @Transactional kết thúc.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT o FROM Order o WHERE o.id = :id")
    Optional<Order> findByIdWithLock(@Param("id") Long id);
}
