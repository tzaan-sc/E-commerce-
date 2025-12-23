    package com.ecommerce.backend.repository.product;
    import com.ecommerce.backend.entity.auth.User;
    import com.ecommerce.backend.entity.product.Order;
    import org.springframework.data.jpa.repository.JpaRepository;
    import java.util.List;

    public interface OrderRepository extends JpaRepository<Order, Long> {
        // 2. THÊM DÒNG NÀY VÀO
        List<Order> findByUser(User user);
        long countByUser(User user);
        List<Order> findAllByOrderByCreatedAtDesc();

        // 2. Lấy theo trạng thái (Ví dụ: PENDING), sắp xếp mới nhất lên đầu
        List<Order> findByStatusOrderByCreatedAtDesc(String status);
    }
