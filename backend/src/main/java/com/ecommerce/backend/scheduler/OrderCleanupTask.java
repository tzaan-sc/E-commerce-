package com.ecommerce.backend.scheduler;

import com.ecommerce.backend.entity.product.Order;
import com.ecommerce.backend.entity.product.OrderItem;
import com.ecommerce.backend.entity.product.PaymentStatus;
import com.ecommerce.backend.entity.product.Product;
import com.ecommerce.backend.repository.product.OrderRepository;
import com.ecommerce.backend.repository.product.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderCleanupTask {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    // Chạy mỗi 10 phút
    @Scheduled(fixedDelay = 10 * 60 * 1000)
    @Transactional
    public void cancelAbandonedOrders() {
        // Đơn quá 30 phút, còn PENDING + UNPAID + phương thức VIETQR
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(30);

        List<Order> abandonedOrders = orderRepository
                .findAbandonedVietQROrders("PENDING", PaymentStatus.UNPAID, "VIETQR", cutoff);

        for (Order order : abandonedOrders) {
            log.info("Tự động hủy đơn bị bỏ quên: {}", order.getId());
            restoreStock(order);
            order.setStatus("CANCELLED");
            orderRepository.save(order);
        }

        if (!abandonedOrders.isEmpty()) {
            log.info("Đã hủy {} đơn hàng bị bỏ quên.", abandonedOrders.size());
        }
    }

    private void restoreStock(Order order) {
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            if (product != null) {
                int qty = item.getQuantity() != null ? item.getQuantity() : 0;
                product.setStockQuantity(product.getStockQuantity() + qty);
                productRepository.save(product);
            }
        }
    }
}