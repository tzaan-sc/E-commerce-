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
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.repository.auth.UserRepository;
import com.ecommerce.backend.repository.product.OrderRepository;
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

    /**
     * Lấy danh sách đơn hàng
     * Param: email (lấy từ userDetails.getUsername())
     */
    @Override
    public List<OrderDTO> getOrdersByUsername(String email) {
        // 1. Tìm user bằng EMAIL (Thay vì findByUsername)
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        // 2. Tìm đơn hàng dựa trên User ID (Thay vì findByCustomerName)
        // Lưu ý: Bạn cần đảm bảo OrderRepository đã có hàm findByUser(User user)
        List<Order> orders = orderRepository.findByUser(user);

        // 3. Chuyển đổi sang DTO
        return orders.stream().map(this::mapOrderToDTO).collect(Collectors.toList());
    }

    /**
     * Hủy đơn hàng
     * Param: email, orderId
     */
    @Override
    @Transactional
    public OrderDTO cancelOrder(String email, Long orderId) {
        // 1. Tìm user bằng EMAIL
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        // 2. Tìm đơn hàng
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        // 3. KIỂM TRA BẢO MẬT: ID người dùng có khớp với chủ đơn hàng không?
        if (order.getUser() == null || !order.getUser().getId().equals(user.getId())) {
            throw new SecurityException("User does not own this order");
        }

        // 4. Kiểm tra trạng thái (Chỉ cho hủy khi đang PENDING)
        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            throw new IllegalStateException("Order cannot be cancelled in its current state: " + order.getStatus());
        }

        // 5. Cập nhật và lưu
        order.setStatus("CANCELLED");
        Order savedOrder = orderRepository.save(order);

        return mapOrderToDTO(savedOrder);
    }

    /**
     * Xem chi tiết đơn hàng
     * Param: email, orderId
     */
    @Override
    public OrderDTO getOrderDetail(String email, Long orderId) {
        // 1. Tìm user đang đăng nhập
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        // 2. Tìm đơn hàng
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        // 3. KIỂM TRA QUYỀN (SỬA LẠI)
        // Cho phép nếu: User là chủ đơn hàng HOẶC User là ADMIN
        boolean isOwner = order.getUser() != null && order.getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == com.ecommerce.backend.entity.auth.Role.ADMIN; // Hoặc user.getRole().name().equals("ADMIN")

        if (!isOwner && !isAdmin) {
            throw new ResourceNotFoundException("Order", "id", orderId);
        }

        // 4. Trả về dữ liệu
        return mapOrderToDTO(order);
    }

    /**
     * Hàm chuyển đổi từ Entity sang DTO
     * Đã cập nhật đầy đủ các trường cho Frontend
     */
    private OrderDTO mapOrderToDTO(Order order) {
        List<OrderItemDTO> itemDTOs = order.getOrderItems().stream()
                .map(item -> {
                    // Logic mới: Lấy ảnh đầu tiên từ danh sách ảnh (vì Product không còn imageUrl)
                    String productImageUrl = null;
                    if (item.getProduct() != null
                            && item.getProduct().getImages() != null
                            && !item.getProduct().getImages().isEmpty()) {
                        // Lấy ảnh đầu tiên trong list (index 0)
                        productImageUrl = item.getProduct().getImages().get(0).getUrlImage();
                    }

                    return OrderItemDTO.builder()
                            .productName(item.getProductName())
                            .quantity(item.getQuantity())
                            .price(item.getPrice())
                            .imageUrl(productImageUrl) // Gán URL tìm được vào DTO
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
            // Nếu không chọn trạng thái -> Lấy tất cả
            orders = orderRepository.findAllByOrderByCreatedAtDesc();
        } else {
            // Nếu chọn trạng thái -> Lọc (Lưu ý chuyển sang chữ hoa: pending -> PENDING)
            orders = orderRepository.findByStatusOrderByCreatedAtDesc(status.toUpperCase());
        }

        // Map sang DTO (Dùng lại hàm mapOrderToDTO có sẵn)
        return orders.stream().map(this::mapOrderToDTO).collect(Collectors.toList());
    }
    @Override
    @Transactional // 👈 QUAN TRỌNG: Bắt buộc có để update dữ liệu
    public OrderDTO updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        order.setStatus(status.toUpperCase());

        Order savedOrder = orderRepository.save(order);
        return mapOrderToDTO(savedOrder);
    }
}