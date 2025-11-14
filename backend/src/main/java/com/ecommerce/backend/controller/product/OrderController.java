package com.ecommerce.backend.controller.product;

import com.ecommerce.backend.dto.product.order.CreateOrderRequest;
import com.ecommerce.backend.dto.product.order.OrderItemResponse;
import com.ecommerce.backend.dto.product.order.OrderResponse;
import com.ecommerce.backend.dto.product.order.OrderDetailResponse;
import com.ecommerce.backend.entity.product.Order;
import com.ecommerce.backend.service.product.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders(
            @RequestParam(required = false) String status) {

        List<Order> orders = orderService.getAllOrders();

        if (status != null && !status.equalsIgnoreCase("all")) {
            orders = orders.stream()
                    .filter(order -> order.getStatus().equalsIgnoreCase(status))
                    .collect(Collectors.toList());
        }

        List<OrderResponse> response = orders.stream()
                .map(this::convertToSummaryResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<OrderDetailResponse> createOrder(@RequestBody CreateOrderRequest request) {
        Order order = orderService.createOrder(request);
        OrderDetailResponse response = convertToDetailResponse(order);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDetailResponse> getOrderById(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        OrderDetailResponse response = convertToDetailResponse(order);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    private OrderResponse convertToSummaryResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .customerName(order.getCustomerName())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .itemCount(order.getItems() != null ? order.getItems().size() : 0)
                .build();
    }

    private OrderDetailResponse convertToDetailResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .productName(item.getProductName())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .subtotal(item.getQuantity() * item.getPrice())
                        .build())
                .collect(Collectors.toList());

        return OrderDetailResponse.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .customerName(order.getCustomerName())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .items(itemResponses)
                .build();
    }
}