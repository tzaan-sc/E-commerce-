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
        // 1. Tìm User
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        // 2. Tìm Product
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        // 3. Kiểm tra xem sản phẩm đã có trong giỏ của user chưa
        CartItem cartItem = cartItemRepository.findByUserAndProduct(user, product)
                .orElse(null);

        if (cartItem != null) {
            // === TRƯỜNG HỢP 1: SẢN PHẨM ĐÃ CÓ TRONG GIỎ ===
            // Logic cộng dồn: Số lượng cũ + Số lượng mới thêm
            int newQuantity = cartItem.getQuantity() + quantity;

            // Kiểm tra tồn kho trước khi cộng dồn
            if (newQuantity > product.getStockQuantity()) {
                throw new RuntimeException("Số lượng yêu cầu vượt quá tồn kho (Còn lại: " + product.getStockQuantity() + ")");
            }

            cartItem.setQuantity(newQuantity);
        } else {
            // === TRƯỜNG HỢP 2: SẢN PHẨM CHƯA CÓ ===
            // Kiểm tra tồn kho cho lần thêm đầu tiên
            if (quantity > product.getStockQuantity()) {
                throw new RuntimeException("Số lượng yêu cầu vượt quá tồn kho (Còn lại: " + product.getStockQuantity() + ")");
            }

            // Tạo item mới
            cartItem = CartItem.builder()
                    .user(user)
                    .product(product)
                    .quantity(quantity)
                    .build();
        }

        // 4. Lưu vào Database
        return cartItemRepository.save(cartItem);
    }
    @Override
    public Long countCartItems(String username) {
        // 1. Tìm User
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", username));

        // 2. Gọi Repository để đếm số dòng (SELECT COUNT(*))
        // Hàm này trả về số loại sản phẩm (VD: 2 dòng), KHÔNG cộng dồn quantity
        return cartItemRepository.countByUser(user);
    }
    @Override
    public List<CartItem> getCartItems(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return cartItemRepository.findByUser(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Order checkoutSelected(String username, CheckoutRequest request) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CartItem> selectedItems = cartItemRepository.findAllById(request.getSelectedItemIds());

        if (selectedItems.isEmpty()) {
            throw new RuntimeException("Chưa có sản phẩm nào được chọn để thanh toán");
        }

        double totalAmount = 0;
        Order order = new Order(); // Khởi tạo trước để dùng addItem

        // Duyệt qua từng item để kiểm tra và trừ kho ngay lập tức
        for (CartItem ci : selectedItems) {
            Product product = ci.getProduct();

            // KIỂM TRA VÀ TRỪ KHO TỨC THỜI
            int remainStock = product.getStockQuantity() - ci.getQuantity();
            if (remainStock < 0) {
                throw new RuntimeException("Sản phẩm " + product.getName() + " không đủ số lượng trong kho (Còn: " + product.getStockQuantity() + ")");
            }

            // Cập nhật số lượng mới vào sản phẩm
            product.setStockQuantity(remainStock);
            productRepository.save(product);

            // Tính tổng tiền
            totalAmount += product.getPrice() * ci.getQuantity();

            // Tạo OrderItem
            OrderItem oi = OrderItem.builder()
                    .productName(product.getName())
                    .quantity(ci.getQuantity())
                    .price(product.getPrice())
                    .product(product)
                    .build();

            order.addItem(oi);
        }

        // Thiết lập thông tin đơn hàng
        order.setUser(user);
        order.setStatus("PENDING");
        order.setTotalAmount(totalAmount);
        order.setNote(request.getNote());
        order.setShippingAddress(request.getAddress());
        order.setPhone(request.getPhone());
        order.setCustomerName(request.getFullName());

        long currentOrderCount = orderRepository.countByUser(user);
        order.setUserOrderNumber((int) currentOrderCount + 1);

        Order savedOrder = orderRepository.save(order);
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