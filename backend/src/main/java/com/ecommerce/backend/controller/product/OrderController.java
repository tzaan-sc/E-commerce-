package com.ecommerce.backend.controller.product;

import com.ecommerce.backend.dto.product.order.OrderDTO;
import com.ecommerce.backend.service.product.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(
        origins = "*",
        methods = {
                RequestMethod.GET,
                RequestMethod.POST,
                RequestMethod.PATCH, // <-- Cho phép PATCH
                RequestMethod.DELETE, // (Thêm luôn cho các hàm xóa sau này)
                RequestMethod.PUT    // (Thêm luôn cho các hàm cập nhật sau này)
        }
)
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getMyOrders(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        String username = userDetails.getUsername();
        List<OrderDTO> orders = orderService.getOrdersByUsername(username);
        return ResponseEntity.ok(orders);
    }
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO> getOrderDetail(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long orderId
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        String username = userDetails.getUsername();

        // Gọi service mới mà bạn vừa tạo ở Bước 2
        OrderDTO orderDetail = orderService.getOrderDetail(username, orderId);

        return ResponseEntity.ok(orderDetail);
    }
    //huy don
    @PatchMapping("/{orderId}/cancel") // Dùng PATCH để cập nhật 1 phần
    public ResponseEntity<OrderDTO> cancelOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long orderId
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        String username = userDetails.getUsername();

        OrderDTO updatedOrder = orderService.cancelOrder(username, orderId);
        return ResponseEntity.ok(updatedOrder);
    }
    @GetMapping("/admin")
    public ResponseEntity<List<OrderDTO>> getAllOrdersForAdmin(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "all") String status
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        // (Tuỳ chọn) Kiểm tra quyền ADMIN chặt chẽ hơn tại đây nếu muốn
        // if (!userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
        //    return ResponseEntity.status(403).build();
        // }

        List<OrderDTO> orders = orderService.getAllOrdersForAdmin(status);
        return ResponseEntity.ok(orders);
    }
    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status
    ) {
        // Gọi service
        OrderDTO updatedOrder = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(updatedOrder);
    }
}