package com.ecommerce.backend.service.product;
import com.ecommerce.backend.dto.product.order.OrderDTO;


import java.util.List;

public interface OrderService {
    List<OrderDTO> getOrdersByUsername(String username);
    OrderDTO cancelOrder(String username, Long orderId);
    OrderDTO getOrderDetail(String username, Long orderId);
    List<OrderDTO> getAllOrdersForAdmin(String status);
    OrderDTO updateOrderStatus(Long orderId, String status);
}
