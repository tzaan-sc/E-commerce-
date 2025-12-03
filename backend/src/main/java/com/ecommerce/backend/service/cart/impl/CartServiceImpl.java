package com.ecommerce.backend.service.cart.impl;

import com.ecommerce.backend.entity.auth.User;
import com.ecommerce.backend.entity.cart.CartItem;
import com.ecommerce.backend.entity.product.Order;
import com.ecommerce.backend.entity.product.OrderItem;
import com.ecommerce.backend.entity.product.Product;
import com.ecommerce.backend.dto.cart.CheckoutRequest;
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
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return cartItemRepository.findByUser(user);
    }

    @Override
    @Transactional
    public Order checkoutSelected(String username, CheckoutRequest request) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CartItem> selectedItems = cartItemRepository.findAllById(request.getSelectedItemIds());

        if (selectedItems.isEmpty()) {
            throw new RuntimeException("No items selected");
        }

        // 1. Tính tổng tiền & Kiểm tra tồn kho trước khi trừ
        double totalAmount = 0;
        for (CartItem ci : selectedItems) {
            if (ci.getProduct().getStockQuantity() < ci.getQuantity()) {
                throw new RuntimeException("Sản phẩm " + ci.getProduct().getName() + " không đủ hàng!");
            }
            totalAmount += ci.getProduct().getPrice() * ci.getQuantity();
        }

        // 2. Tạo đơn hàng mới
        Order order = new Order();
        order.setUser(user);
        order.setStatus("PENDING");
        order.setTotalAmount(totalAmount);
        order.setNote(request.getNote());
        order.setShippingAddress(request.getAddress());
        order.setPhone(request.getPhone());
        order.setCustomerName(request.getFullName());

        long currentOrderCount = orderRepository.countByUser(user);
        order.setUserOrderNumber((int) currentOrderCount + 1);

        // 3. CHUYỂN TỪ GIỎ HÀNG SANG CHI TIẾT ĐƠN HÀNG & TRỪ KHO
        for (CartItem ci : selectedItems) {
            Product product = ci.getProduct();

            // --- LOGIC TRỪ KHO (-) ---
            int newStock = product.getStockQuantity() - ci.getQuantity();
            product.setStockQuantity(newStock);
            productRepository.save(product); // Lưu số lượng mới
            // ------------------------

            OrderItem oi = OrderItem.builder()
                    .productName(product.getName())
                    .quantity(ci.getQuantity())
                    .price(product.getPrice())
                    .product(product)
                    .build();
            order.addItem(oi);
        }

        // 4. Lưu đơn hàng
        Order savedOrder = orderRepository.save(order);

        // 5. Xóa các món đã mua khỏi giỏ hàng
        cartItemRepository.deleteAll(selectedItems);

        return savedOrder;
    }

    @Override
    @Transactional
    public CartItem updateItemQuantity(String email, Long cartItemId, Integer quantity) {
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
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        List<CartItem> itemsToDelete = cartItemRepository.findAllByIdInAndUser(cartItemIds, user);
        cartItemRepository.deleteAll(itemsToDelete);
    }
}