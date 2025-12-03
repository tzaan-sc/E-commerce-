package com.ecommerce.backend.service.cart;

import com.ecommerce.backend.entity.cart.CartItem;
import com.ecommerce.backend.dto.cart.CheckoutRequest;
import com.ecommerce.backend.entity.product.Order;
import java.util.List;

public interface CartService {

    // Hàm thêm vào giỏ
    CartItem addToCart(String username, Long productId, Integer quantity);

    // Hàm lấy giỏ hàng
    List<CartItem> getCartItems(String username);

    // Hàm checkout các món đã chọn
//    Order checkoutSelected(String username, List<Long> cartItemIds);
    Order checkoutSelected(String email, CheckoutRequest request);

    // Hàm cập nhật số lượng
    CartItem updateItemQuantity(String username, Long cartItemId, Integer quantity);

    // Hàm xóa 1 món (Đây là hàm bị sai/thiếu trong file của bạn)
    void removeItemFromCart(String username, Long cartItemId);

    // Hàm xóa nhiều món
    void removeItemsFromCart(String username, List<Long> cartItemIds);
}