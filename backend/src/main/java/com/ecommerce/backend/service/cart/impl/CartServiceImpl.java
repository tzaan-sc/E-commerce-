package com.ecommerce.backend.service.cart.impl;

import com.ecommerce.backend.entity.auth.User;
import com.ecommerce.backend.entity.cart.CartItem;
import com.ecommerce.backend.entity.product.Order;
import com.ecommerce.backend.entity.product.OrderItem;
import com.ecommerce.backend.entity.product.Product;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.repository.auth.UserRepository;
import com.ecommerce.backend.repository.cart.CartItemRepository;
import com.ecommerce.backend.repository.product.ProductRepository;
import com.ecommerce.backend.repository.product.OrderRepository;
import com.ecommerce.backend.service.cart.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @Override
    @Transactional
    public CartItem addToCart(String email, Long productId, Integer quantity) {
        // 👇 SỬA: Dùng findByEmail thay vì findByUsername
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        CartItem cartItem = cartItemRepository.findByUserAndProduct(user, product)
                .orElse(CartItem.builder()
                        .user(user)
                        .product(product)
                        .quantity(0)
                        .build());

        cartItem.setQuantity(cartItem.getQuantity() + quantity);
        return cartItemRepository.save(cartItem);
    }

    @Override
    public List<CartItem> getCartItems(String email) {
        // 👇 SỬA: Dùng findByEmail
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        return cartItemRepository.findByUser(user);
    }

    @Override
    @Transactional
    public Order checkoutSelected(String email, List<Long> cartItemIds) {
        // 👇 SỬA: Dùng findByEmail
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        // 1. Lấy các món hàng được chọn
        List<CartItem> cartItems = cartItemRepository.findAllByIdInAndUser(cartItemIds, user);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("No selected items found in cart");
        }

        // 2. TẠO ORDER VÀ GÁN ĐỦ THÔNG TIN (ĐỂ KHÔNG BỊ NULL)
        Order order = new Order();

        // --- QUAN TRỌNG: GÁN USER VÀ THÔNG TIN ---
        order.setUser(user);
        order.setCustomerName(user.getUsername()); // Lưu tên thật (Nguyễn Thế Hiển)
        order.setPhone(user.getPhone());
        order.setShippingAddress(user.getAddress());
        order.setStatus("PENDING");
        // -----------------------------------------
        long currentOrderCount = orderRepository.countByUser(user);
        // Đơn hàng mới sẽ là (số lượng cũ + 1)
        order.setUserOrderNumber((int) currentOrderCount + 1);
        double total = 0;
        for (CartItem ci : cartItems) {
            OrderItem oi = OrderItem.builder()
                    .productName(ci.getProduct().getName())
                    .quantity(ci.getQuantity())
                    .price(ci.getProduct().getPrice())
                    .product(ci.getProduct())
                    .build();

            order.addItem(oi);
            total += ci.getQuantity() * ci.getProduct().getPrice();
        }
        order.setTotalAmount(total);

        // 3. Lưu Order
        Order savedOrder = orderRepository.save(order);

        // 4. Xóa các món đã mua khỏi giỏ hàng
        cartItemRepository.deleteAll(cartItems);

        return savedOrder;
    }

    @Override
    @Transactional
    public CartItem updateItemQuantity(String email, Long cartItemId, Integer quantity) {
        // 👇 SỬA: Dùng findByEmail
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", cartItemId));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new SecurityException("User does not own this cart item");
        }

        cartItem.setQuantity(quantity);
        return cartItemRepository.save(cartItem);
    }

    @Override
    @Transactional
    public void removeItemFromCart(String email, Long cartItemId) {
        // 👇 SỬA: Dùng findByEmail
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", cartItemId));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new SecurityException("User does not own this cart item");
        }

        cartItemRepository.delete(cartItem);
    }

    @Override
    @Transactional
    public void removeItemsFromCart(String email, List<Long> cartItemIds) {
        // 👇 SỬA: Dùng findByEmail
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        List<CartItem> itemsToDelete = cartItemRepository.findAllByIdInAndUser(cartItemIds, user);
        cartItemRepository.deleteAll(itemsToDelete);
    }
}