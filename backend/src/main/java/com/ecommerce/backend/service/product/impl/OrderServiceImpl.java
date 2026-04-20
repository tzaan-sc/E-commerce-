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
import com.ecommerce.backend.entity.product.PaymentStatus; // 👈 thêm dòng này

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional(readOnly = true)
    public List<OrderDTO> getOrdersByUsername(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        List<Order> orders = orderRepository.findByUser(user);
        return orders.stream().map(this::mapOrderToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderDTO switchToCod(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        // Chỉ cho đổi khi đơn còn PENDING + UNPAID
        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            throw new IllegalStateException("Không thể đổi phương thức thanh toán ở trạng thái: " + order.getStatus());
        }
        if (order.getPaymentStatus() != null &&
                order.getPaymentStatus() != PaymentStatus.UNPAID) {
            throw new IllegalStateException("Đơn hàng đã được thanh toán, không thể đổi sang COD.");
        }

        order.setPaymentMethod("COD");
        order.setStatus("CONFIRMED"); // Xác nhận luôn vì khách đã chọn COD
        return mapOrderToDTO(orderRepository.save(order));
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
    @Transactional
    public OrderDTO confirmReceived(String email, Long orderId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        if (order.getUser() == null || !order.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Bạn không có quyền thao tác đơn hàng này");
        }

        // Yêu cầu: Khách hàng chỉ được xác nhận khi đơn đang ở SHIPPING
        if (!"SHIPPING".equalsIgnoreCase(order.getStatus())) {
            throw new IllegalStateException(
                    "Chỉ có thể xác nhận nhận hàng khi đơn ở trạng thái 'Đang giao'. Trạng thái hiện tại: "
                            + order.getStatus());
        }

        // Chuyển từ SHIPPING -> DELIVERED
        order.setStatus("DELIVERED");

        // Cập nhật PaymentStatus thành PAID (vì khách đã thanh toán cho Shipper)
        order.setPaymentStatus(com.ecommerce.backend.entity.product.PaymentStatus.PAID);

        return mapOrderToDTO(orderRepository.save(order));
    }

    // --- KHÁCH HÀNG XÁC NHẬN THANH TOÁN (VIETQR) ---
    @Override
    @Transactional
    public OrderDTO confirmPayment(String email, Long orderId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        if (order.getUser() == null || !order.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Bạn không có quyền thao tác đơn hàng này");
        }

        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            throw new IllegalStateException("Đơn hàng không ở trạng thái chờ thanh toán.");
        }

        order.setStatus("CONFIRMED");
        return mapOrderToDTO(orderRepository.save(order));
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDTO getOrderDetail(String email, Long orderId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        boolean isOwner = order.getUser() != null && order.getUser().getId().equals(user.getId());
        boolean isAdminOrStaff = user.getRole() == com.ecommerce.backend.entity.auth.Role.ADMIN
                || user.getRole() == com.ecommerce.backend.entity.auth.Role.STAFF;

        if (!isOwner && !isAdminOrStaff) {
            throw new ResourceNotFoundException("Order", "id", orderId);
        }
        return mapOrderToDTO(order);
    }

    @Override
    @Transactional
    public OrderDTO updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        String newStatus = status.toUpperCase();
        String oldStatus = order.getStatus() != null ? order.getStatus().toUpperCase() : "PENDING";

        // Admin BỊ CẤM chuyển trạng thái sang DELIVERED (hoặc COMPLETED)
        if ("DELIVERED".equals(newStatus) || "COMPLETED".equals(newStatus)) {
            throw new IllegalStateException("Admin không được phép chuyển trạng thái sang " + newStatus);
        }

        if (!"CANCELLED".equals(newStatus)) {
            // Kiểm tra trạng thái cũ trước khi update. Không cho phép nhảy cóc.
            java.util.List<String> validFlow = java.util.Arrays.asList("PENDING", "CONFIRMED", "PROCESSING", "SHIPPING",
                    "DELIVERED", "COMPLETED", "CANCELLED");
            int oldIdx = validFlow.indexOf(oldStatus);
            int newIdx = validFlow.indexOf(newStatus);

            if (newIdx != oldIdx + 1) {
                throw new IllegalStateException(
                        "Chuyển trạng thái không hợp lệ: " + oldStatus + " -> " + newStatus + ". Không được nhảy cóc.");
            }
        }

        // Nếu trạng thái mới là CANCELLED, bắt buộc gọi restoreStock
        if ("CANCELLED".equals(newStatus) && !"CANCELLED".equals(oldStatus)) {
            restoreStock(order);
        }

        order.setStatus(newStatus);
        return mapOrderToDTO(orderRepository.save(order));
    }

    // cap nhat trang thai thanh toan
    // NEWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
    @Override
    @Transactional
    public OrderDTO updatePaymentStatus(Long orderId, String paymentStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        String newStatus = paymentStatus.toUpperCase();

        // Fix: dùng .name() thay vì .toUpperCase() vì getPaymentStatus() trả về enum
        String currentStatus = order.getPaymentStatus() != null
                ? order.getPaymentStatus().name() // ✅ thay .toUpperCase() bằng .name()
                : "UNPAID";

        if ("REFUNDED".equals(currentStatus)) {
            throw new IllegalStateException("Đơn hàng đã hoàn tiền, không thể thay đổi trạng thái thanh toán.");
        }
        if ("PAID".equals(currentStatus) && "UNPAID".equals(newStatus)) {
            throw new IllegalStateException("Không thể chuyển từ PAID về UNPAID.");
        }

        order.setPaymentStatus(PaymentStatus.valueOf(newStatus)); // dùng newStatus đã uppercase
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

    private void restoreStock(Order order) {
        java.util.List<Product> productsToUpdate = new java.util.ArrayList<>();
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            if (product != null) {
                int quantityToRestore = (item.getQuantity() != null) ? item.getQuantity() : 0;
                product.setStockQuantity(product.getStockQuantity() + quantityToRestore);
                productsToUpdate.add(product);
            }
        }
        if (!productsToUpdate.isEmpty()) {
            productRepository.saveAll(productsToUpdate);
        }
    }

    private OrderDTO mapOrderToDTO(Order order) {
        List<OrderItemDTO> itemDTOs = order.getOrderItems().stream()
                .map(item -> {
                    String productImageUrl = null;
                    if (item.getProduct() != null) {
                        productImageUrl = item.getProduct().getImageUrl(); // Lấy trực tiếp từ imageUrl của Product
                                                                           // (tránh N+1)
                    }
                    return OrderItemDTO.builder()
                            .productName(item.getProductName())
                            .quantity(item.getQuantity())
                            .price(item.getPrice())
                            .imageUrl(productImageUrl)
                            .productId(item.getProduct().getId())
                            .build();
                })
                .collect(Collectors.toList());

        // 👇 Sửa đoạn này — thêm paymentStatus và note
        return OrderDTO.builder()
                .id(order.getId())
                .status(order.getStatus())
                .paymentStatus(order.getPaymentStatus() != null
                        ? order.getPaymentStatus().name()
                        : "UNPAID")
                .totalAmount(order.getTotalAmount())
                .createdAt(order.getCreatedAt())
                .items(itemDTOs)
                .userOrderNumber(order.getUserOrderNumber())
                .customerName(order.getCustomerName())
                .phone(order.getPhone())
                .shippingAddress(order.getShippingAddress())
                .paymentMethod(order.getPaymentMethod())
                .note(order.getNote()) // 👈
                .build();
    }
}
