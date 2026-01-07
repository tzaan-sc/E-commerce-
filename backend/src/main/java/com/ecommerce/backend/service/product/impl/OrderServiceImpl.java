package com.ecommerce.backend.service.product.impl;

import com.ecommerce.backend.dto.product.order.OrderDTO;
import com.ecommerce.backend.dto.product.order.OrderItemDTO;
import com.ecommerce.backend.entity.auth.User;
import com.ecommerce.backend.entity.product.Order;
import com.ecommerce.backend.entity.product.OrderItem;
import com.ecommerce.backend.entity.product.Product;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.repository.auth.UserRepository;
import com.ecommerce.backend.repository.product.OrderRepository;
import com.ecommerce.backend.repository.product.ProductRepository;
import com.ecommerce.backend.service.product.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    public List<OrderDTO> getOrdersByUsername(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        List<Order> orders = orderRepository.findByUser(user);
        return orders.stream().map(this::mapOrderToDTO).collect(Collectors.toList());
    }

    // --- KHÁCH HÀNG HỦY ĐƠN ---
    @Override
    @Transactional
    public OrderDTO cancelOrder(String email, Long orderId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        // Check quyền sở hữu
        if (order.getUser() == null || !order.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Bạn không có quyền hủy đơn hàng này");
        }

        // Chỉ cho hủy khi đang chờ xác nhận
        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            throw new IllegalStateException("Không thể hủy đơn hàng đang ở trạng thái: " + order.getStatus());
        }

        // 👇 HOÀN LẠI KHO VÌ ĐƠN BỊ HỦY
        restoreStock(order);

        order.setStatus("CANCELLED");
        return mapOrderToDTO(orderRepository.save(order));
    }

    @Override
    public OrderDTO getOrderDetail(String email, Long orderId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        boolean isOwner = order.getUser() != null && order.getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == com.ecommerce.backend.entity.auth.Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new ResourceNotFoundException("Order", "id", orderId);
        }
        return mapOrderToDTO(order);
    }

    // --- ADMIN CẬP NHẬT TRẠNG THÁI ---
    @Override
    @Transactional
    public OrderDTO updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        String newStatus = status.toUpperCase();
        String oldStatus = order.getStatus();

        // ⚠️ Lưu ý: Không trừ kho ở đây nữa vì đã trừ lúc đặt hàng (Checkout) rồi.

        // 👇 Nếu Admin chuyển sang CANCELLED thì mới HOÀN LẠI KHO
        if ("CANCELLED".equals(newStatus) && !"CANCELLED".equals(oldStatus)) {
            restoreStock(order);
        }

        order.setStatus(newStatus);
        return mapOrderToDTO(orderRepository.save(order));
    }

    @Override
    public List<OrderDTO> getAllOrdersForAdmin(String status) {
        List<Order> orders;
        if (status == null || status.equals("all") || status.isEmpty()) {
            orders = orderRepository.findAllByOrderByCreatedAtDesc();
        } else {
            orders = orderRepository.findByStatusOrderByCreatedAtDesc(status.toUpperCase());
        }
        return orders.stream().map(this::mapOrderToDTO).collect(Collectors.toList());
    }

    // --- HÀM PHỤ TRỢ ---

    // Hàm cộng lại kho (Dùng khi hủy đơn)
    private void restoreStock(Order order) {
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            if (product != null) {
                int quantityToRestore = (item.getQuantity() != null) ? item.getQuantity() : 0;
                product.setStockQuantity(product.getStockQuantity() + quantityToRestore);
                productRepository.save(product);
            }
        }
    }

    private OrderDTO mapOrderToDTO(Order order) {
        List<OrderItemDTO> itemDTOs = order.getOrderItems().stream()
                .map(item -> {
                    String productImageUrl = null;
                    if (item.getProduct() != null
                            && item.getProduct().getImages() != null
                            && !item.getProduct().getImages().isEmpty()) {
                        productImageUrl = item.getProduct().getImages().get(0).getUrlImage();
                    }
                    return OrderItemDTO.builder()
                            .productName(item.getProductName())
                            .quantity(item.getQuantity())
                            .price(item.getPrice())
                            .imageUrl(productImageUrl)
                            .build();
                })
                .collect(Collectors.toList());

        return OrderDTO.builder()
                .id(order.getId())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .createdAt(order.getCreatedAt())
                .items(itemDTOs)
                .userOrderNumber(order.getUserOrderNumber())
                .customerName(order.getCustomerName())
                .phone(order.getPhone())
                .shippingAddress(order.getShippingAddress())
                .build();
    }
}