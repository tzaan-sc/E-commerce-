package com.ecommerce.backend.service.payment;

import com.ecommerce.backend.dto.order.CreateOrderRequest;
import com.ecommerce.backend.dto.order.OrderResponse;
import java.util.List;

/**
 * Service xử lý đơn hàng (tạo mới, xem, cập nhật trạng thái)
 */
public interface OrderService {

    /**
     * Tạo đơn hàng COD mới từ danh sách sản phẩm
     * @param email Email của user đã đăng nhập
     * @param request Thông tin đơn hàng
     * @return OrderResponse chứa thông tin đơn hàng vừa tạo
     */
    OrderResponse createOrder(String email, CreateOrderRequest request);

    /**
     * Lấy danh sách đơn hàng của user hiện tại
     * @param email Email user
     */
    List<OrderResponse> getMyOrders(String email);

    /**
     * Lấy chi tiết một đơn hàng theo ID (user chỉ xem được đơn của mình)
     * @param email Email user
     * @param orderId ID đơn hàng
     */
    OrderResponse getOrderById(String email, Long orderId);

    /**
     * Admin: Cập nhật trạng thái đơn hàng
     * @param orderId ID đơn hàng
     * @param newStatus Trạng thái mới (PROCESSING, SHIPPING, COMPLETED, CANCELLED...)
     */
    OrderResponse updateOrderStatus(Long orderId, String newStatus);

    /**
     * Admin: Lấy tất cả đơn hàng, có thể filter theo trạng thái
     * @param status "all" hoặc tên trạng thái cụ thể
     */
    List<OrderResponse> getAllOrders(String status);

    /**
     * User: Hủy đơn hàng (chỉ được hủy khi trạng thái là PENDING)
     * @param email Email user
     * @param orderId ID đơn hàng
     */
    OrderResponse cancelOrder(String email, Long orderId);
}
