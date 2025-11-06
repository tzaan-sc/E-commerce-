package com.ecommerce.backend.service.product;

import com.ecommerce.backend.dto.product.order.CreateOrderRequest;
import com.ecommerce.backend.entity.product.Order;

import java.util.List;

public interface OrderService {
    Order createOrder(CreateOrderRequest request);
    List<Order> getAllOrders();
    Order getOrderById(Long id);
    void deleteOrder(Long id);
}
