package com.ecommerce.backend.service.product.impl;

import com.ecommerce.backend.dto.product.order.CreateOrderRequest;
import com.ecommerce.backend.entity.product.Order;
import com.ecommerce.backend.entity.product.OrderItem;
import com.ecommerce.backend.repository.product.OrderRepository;
import com.ecommerce.backend.service.product.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    @Override
    public Order createOrder(CreateOrderRequest request) {
        Order order = Order.builder()
                .orderCode(request.getOrderCode())
                .customerName(request.getCustomerName())
                .totalAmount(request.getTotalAmount())
                .status(request.getStatus())
                .build();

        if (request.getItems() != null) {
            List<OrderItem> orderItems = request.getItems().stream().map(i ->
                    OrderItem.builder()
                            .productName(i.getProductName())
                            .quantity(i.getQuantity())
                            .price(i.getPrice())
                            .order(order)
                            .build()
            ).toList();
            order.setItems(orderItems);
        }

        return orderRepository.save(order);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
    }

    @Override
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}
