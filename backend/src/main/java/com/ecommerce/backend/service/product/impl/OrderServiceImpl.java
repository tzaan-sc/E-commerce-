//package com.ecommerce.backend.service.product.impl;
//import org.springframework.transaction.annotation.Transactional;
//import com.ecommerce.backend.dto.product.order.OrderDTO;
//import com.ecommerce.backend.dto.product.order.OrderItemDTO;
//import com.ecommerce.backend.entity.auth.User;
//import com.ecommerce.backend.entity.product.Order;
//import com.ecommerce.backend.exception.ResourceNotFoundException;
//import com.ecommerce.backend.repository.auth.UserRepository;
//import com.ecommerce.backend.repository.product.OrderRepository;
//import com.ecommerce.backend.service.product.OrderService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class OrderServiceImpl implements OrderService {
//
//    private final OrderRepository orderRepository;
//    private final UserRepository userRepository;
//
//    @Override
//    public List<OrderDTO> getOrdersByUsername(String username) {
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
//
//        List<Order> orders = orderRepository.findByCustomerName(user.getUsername());
//
//        // Map từ Entity sang DTO
//        return orders.stream().map(this::mapOrderToDTO).collect(Collectors.toList());
//    }
//
//    @Override
//    @Transactional
//    public OrderDTO cancelOrder(String username, Long orderId) {
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
//
//        Order order = orderRepository.findById(orderId)
//                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
//
//        // 1. Kiểm tra bảo mật: Đơn hàng này có phải của user này không?
//        if (!order.getCustomerName().equals(user.getUsername())) {
//            throw new SecurityException("User does not own this order");
//        }
//
//        // 2. Chỉ cho phép hủy nếu đang "Chờ xác nhận" (PENDING)
//        if (!"PENDING".equalsIgnoreCase(order.getStatus())) { // Đổi .equals thành .equalsIgnoreCase
//            throw new IllegalStateException("Order cannot be cancelled in its current state: " + order.getStatus());
//        }
//
//        // 3. Cập nhật trạng thái
//        order.setStatus("CANCELLED"); // (Nên lưu chữ hoa)
//        Order savedOrder = orderRepository.save(order);
//
//        return mapOrderToDTO(savedOrder);
//    }
//
//    // --- SỬA HÀM NÀY ---
//    private OrderDTO mapOrderToDTO(Order order) {
//
//        List<OrderItemDTO> itemDTOs = order.getOrderItems().stream()
//                .map(item -> OrderItemDTO.builder()
//                        .productName(item.getProductName())
//                        .quantity(item.getQuantity())
//                        .price(item.getPrice())
//                        // Sửa: Kiểm tra null an toàn
//                        .imageUrl(item.getProduct() != null ? item.getProduct().getImageUrl() : null)
//                        .build())
//                .collect(Collectors.toList());
//
//        // Sửa: Thêm createdAt
//        return OrderDTO.builder()
//                .id(order.getId())
//                .status(order.getStatus())
//                .totalAmount(order.getTotalAmount())
//                .createdAt(order.getCreatedAt()) // Gán ngày tạo
//                .items(itemDTOs)
//                .build();
//    }
//
//        @Override
//        public OrderDTO getOrderDetail(String username, Long orderId) {
//            // 1. Tìm user (để đảm bảo user tồn tại)
//            User user = userRepository.findByUsername(username)
//                    .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
//
//            // 2. Tìm đơn hàng
//            Order order = orderRepository.findById(orderId)
//                    .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
//
//            // 3. Kiểm tra bảo mật: User này có phải là chủ của đơn hàng không?
//            if (!order.getCustomerName().equals(user.getUsername())) {
//                // Ném lỗi 403 (Forbidden) hoặc 404 (Not Found) để user không biết
//                // là đơn hàng này tồn tại
//                throw new ResourceNotFoundException("Order", "id", orderId);
//            }
//
//            // 4. Nếu mọi thứ OK, map sang DTO và trả về
//            return mapOrderToDTO(order);
//        }
//}
package com.ecommerce.backend.service.product.impl;

import com.ecommerce.backend.dto.product.order.OrderDTO;
import com.ecommerce.backend.dto.product.order.OrderItemDTO;
import com.ecommerce.backend.entity.auth.User;
import com.ecommerce.backend.entity.product.Order;
import com.ecommerce.backend.entity.product.OrderItem; // Import
import com.ecommerce.backend.entity.product.Product;   // Import
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.repository.auth.UserRepository;
import com.ecommerce.backend.repository.product.OrderRepository;
import com.ecommerce.backend.repository.product.ProductRepository; // Import Repository
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

    // 👇 BỔ SUNG ĐỂ CỘNG KHO
    private final ProductRepository productRepository;

    @Override
    public List<OrderDTO> getOrdersByUsername(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        List<Order> orders = orderRepository.findByUser(user);
        return orders.stream().map(this::mapOrderToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderDTO cancelOrder(String email, Long orderId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        if (order.getUser() == null || !order.getUser().getId().equals(user.getId())) {
            throw new SecurityException("User does not own this order");
        }

        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            throw new IllegalStateException("Order cannot be cancelled in its current state: " + order.getStatus());
        }

        // --- LOGIC CỘNG LẠI KHO (+) ---
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            if (product != null) {
                int oldStock = product.getStockQuantity();
                int quantityToRestore = item.getQuantity();

                // Cộng dồn lại kho
                product.setStockQuantity(oldStock + quantityToRestore);

                // Lưu xuống DB
                productRepository.save(product);
            }
        }
        // ------------------------------

        order.setStatus("CANCELLED");
        Order savedOrder = orderRepository.save(order);

        return mapOrderToDTO(savedOrder);
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

    // Các hàm bên dưới giữ nguyên
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

    @Override
    @Transactional // Bắt buộc có để đảm bảo dữ liệu đồng nhất
    public OrderDTO updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        String newStatus = status.toUpperCase();
        String oldStatus = order.getStatus();

        // 👇 LOGIC CỘNG KHO KHI ADMIN HỦY ĐƠN
        // Chỉ thực hiện khi trạng thái MỚI là CANCELLED và trạng thái CŨ CHƯA PHẢI là CANCELLED
        if ("CANCELLED".equals(newStatus) && !"CANCELLED".equals(oldStatus)) {
            for (OrderItem item : order.getOrderItems()) {
                Product product = item.getProduct();
                if (product != null) {
                    int currentStock = product.getStockQuantity();
                    int quantityToRestore = item.getQuantity();

                    // Cộng lại số lượng vào kho
                    product.setStockQuantity(currentStock + quantityToRestore);
                    productRepository.save(product);
                }
            }
        }

        // Cập nhật trạng thái đơn hàng
        order.setStatus(newStatus);
        Order savedOrder = orderRepository.save(order);

        return mapOrderToDTO(savedOrder);
    }
}