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
import com.ecommerce.backend.entity.product.OrderItem;
import com.ecommerce.backend.entity.product.Product;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.repository.auth.UserRepository;
import com.ecommerce.backend.repository.product.OrderRepository;
import com.ecommerce.backend.repository.product.ProductRepository; // Import
import com.ecommerce.backend.service.product.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository; // Inject để thao tác với kho

    @Override
    public List<OrderDTO> getOrdersByUsername(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        List<Order> orders = orderRepository.findByUser(user);
        return orders.stream().map(this::mapOrderToDTO).collect(Collectors.toList());
    }

    // ==============================================================
    // 1. TRƯỜNG HỢP KHÁCH HÀNG HỦY ĐƠN
    // ==============================================================
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

        // 👇 CỘNG LẠI KHO
        restoreStock(order);

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

    // ==============================================================
    // 2. TRƯỜNG HỢP ADMIN CẬP NHẬT TRẠNG THÁI (BAO GỒM HỦY)
    // ==============================================================
    @Override
    @Transactional
    public OrderDTO updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        String oldStatus = order.getStatus();

        // Danh sách các trạng thái CẦN TRỪ KHO
        List<String> stockDeductedStatuses = Arrays.asList("PROCESSING", "SHIPPING", "COMPLETED", "CONFIRMED");

        // Kiểm tra xem trạng thái Cũ và Mới có thuộc nhóm phải trừ kho không?
        boolean isNewStatusDeducted = stockDeductedStatuses.contains(newStatus);
        boolean isOldStatusDeducted = stockDeductedStatuses.contains(oldStatus);

        // -----------------------------------------------------------------
        // 👇 LOGIC 1: TRỪ KHO (Khi chuyển từ "Chưa trừ" -> "Đã trừ")
        // (Ví dụ: PENDING -> PROCESSING, hoặc PENDING -> SHIPPING)
        // -----------------------------------------------------------------
        if (isNewStatusDeducted && !isOldStatusDeducted) {
            System.out.println("--> BẮT ĐẦU TRỪ KHO CHO ĐƠN: " + orderId);
            for (OrderItem item : order.getOrderItems()) {
                Product product = item.getProduct();

                // Trừ số lượng
                int newStock = product.getStockQuantity() - item.getQuantity();

                // Chặn nếu hết hàng
                if (newStock < 0) {
                    throw new RuntimeException("Sản phẩm '" + product.getName() + "' không đủ hàng (Còn: " + product.getStockQuantity() + ", Cần: " + item.getQuantity() + ")");
                }

                product.setStockQuantity(newStock);
                productRepository.save(product);
                System.out.println("   Đã trừ: " + product.getName() + " | Còn lại: " + newStock);
            }
        }

        // -----------------------------------------------------------------
        // 👇 LOGIC 2: HOÀN KHO (Khi Hủy đơn mà trước đó đã trừ kho rồi)
        // -----------------------------------------------------------------
        if ("CANCELLED".equals(newStatus) && isOldStatusDeducted) {
            System.out.println("--> HOÀN KHO CHO ĐƠN HỦY: " + orderId);
            for (OrderItem item : order.getOrderItems()) {
                Product product = item.getProduct();

                int newStock = product.getStockQuantity() + item.getQuantity();

                product.setStockQuantity(newStock);
                productRepository.save(product);
                System.out.println("   Đã hoàn: " + product.getName() + " | Mới: " + newStock);
            }
        }

        // Lưu trạng thái mới
        order.setStatus(newStatus);
        Order updatedOrder = orderRepository.save(order);

        return mapOrderToDTO(updatedOrder);
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

    // ==============================================================
    // HÀM PHỤ TRỢ
    // ==============================================================

    // Hàm cộng lại kho (Dùng chung cho cả Admin và Customer)
    private void restoreStock(Order order) {
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            if (product != null) {
                // Đảm bảo không có lỗi dữ liệu nếu quantity bị null
                int quantityToRestore = (item.getQuantity() != null) ? item.getQuantity() : 0;
                product.setStockQuantity(product.getStockQuantity() + quantityToRestore);
                productRepository.save(product);
            }
        }
    }

    private OrderDTO mapOrderToDTO(Order order) {
        List<OrderItemDTO> itemDTOs = order.getOrderItems().stream()
                .map(item -> {
                    // Logic lấy ảnh (giữ nguyên)
                    String productImageUrl = null;
                    if (item.getProduct() != null
                            && item.getProduct().getImages() != null
                            && !item.getProduct().getImages().isEmpty()) {
                        productImageUrl = item.getProduct().getImages().get(0).getUrlImage();
                    }

                    // 👇👇👇 THÊM DÒNG NÀY: LẤY ID SẢN PHẨM AN TOÀN 👇👇👇
                    Long productId = (item.getProduct() != null) ? item.getProduct().getId() : null;

                    return OrderItemDTO.builder()
                            .productName(item.getProductName())
                            .quantity(item.getQuantity())
                            .price(item.getPrice())
                            .imageUrl(productImageUrl)
                            .productId(productId) // 👈 GÁN VÀO ĐÂY
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