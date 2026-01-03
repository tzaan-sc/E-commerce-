package com.ecommerce.backend.service.cart.impl;

import com.ecommerce.backend.dto.cart.CheckoutRequest;
import com.ecommerce.backend.entity.auth.User;
import com.ecommerce.backend.entity.cart.CartItem;
import com.ecommerce.backend.entity.product.Order;
import com.ecommerce.backend.entity.product.OrderItem;
import com.ecommerce.backend.entity.product.Product;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.repository.auth.UserRepository;
import com.ecommerce.backend.repository.cart.CartItemRepository;
import com.ecommerce.backend.repository.product.OrderRepository;
import com.ecommerce.backend.repository.product.ProductRepository;
import com.ecommerce.backend.service.cart.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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

        // Kiểm tra tồn kho ngay khi thêm vào giỏ
        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException("Sản phẩm " + product.getName() + " không đủ số lượng tồn kho!");
        }

        // Kiểm tra xem sản phẩm đã có trong giỏ chưa
        CartItem cartItem = cartItemRepository.findByUserAndProduct(user, product)
                .orElse(CartItem.builder()
                        .user(user)
                        .product(product)
                        .quantity(0)
                        .build());

        // Kiểm tra tổng số lượng sau khi cộng dồn
        int newQuantity = cartItem.getQuantity() + quantity;
        if (product.getStockQuantity() < newQuantity) {
            throw new RuntimeException("Tổng số lượng trong giỏ vượt quá tồn kho!");
        }

        cartItem.setQuantity(newQuantity);
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
    public Order checkoutSelected(String email, CheckoutRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        // 1. Lấy danh sách sản phẩm được chọn (Dùng hàm InAndUser để bảo mật)
        List<CartItem> selectedItems = cartItemRepository.findAllByIdInAndUser(request.getSelectedItemIds(), user);

        if (selectedItems.isEmpty()) {
            throw new RuntimeException("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
        }

        // 2. Tạo đơn hàng (Order)
        Order order = Order.builder()
                .user(user)
                .customerName(request.getFullName())
                .phone(request.getPhone())
                .shippingAddress(request.getAddress())
                .note(request.getNote())
                .status("PENDING") // Trạng thái chờ xác nhận
                .totalAmount(0.0)
                .build();

        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0;

        // 3. Duyệt qua từng món hàng để xử lý
        for (CartItem cartItem : selectedItems) {
            Product product = cartItem.getProduct();

            // 👇 QUAN TRỌNG: KIỂM TRA VÀ TRỪ KHO NGAY TẠI ĐÂY 👇
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Sản phẩm " + product.getName() + " đã hết hàng hoặc không đủ số lượng!");
            }

            // Trừ số lượng tồn kho
            int remainStock = product.getStockQuantity() - cartItem.getQuantity();
            product.setStockQuantity(remainStock);
            productRepository.save(product); // Lưu lại số lượng mới vào DB ngay lập tức

            // Tạo chi tiết đơn hàng (Snapshot giá và tên tại thời điểm mua)
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .productName(product.getName())
                    .quantity(cartItem.getQuantity())
                    .price(product.getPrice())
                    .build();

            orderItems.add(orderItem);
            totalAmount += product.getPrice() * cartItem.getQuantity();
        }

        order.setTotalAmount(totalAmount);
        order.setOrderItems(orderItems);

        // 4. Xóa các món đã mua khỏi giỏ hàng
        cartItemRepository.deleteAll(selectedItems);

        // 5. Lưu đơn hàng
        return orderRepository.save(order);
    }

    @Override
    public CartItem updateItemQuantity(String email, Long cartItemId, Integer quantity) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", cartItemId));

        // Bảo mật: check chủ sở hữu
        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Không có quyền sửa giỏ hàng này");
        }

        // Check tồn kho khi update số lượng
        if(cartItem.getProduct().getStockQuantity() < quantity){
            throw new RuntimeException("Kho không đủ số lượng");
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
            throw new SecurityException("Không có quyền xóa mục này");
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

    @Override
    public Long countCartItems(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return cartItemRepository.countByUser(user);
    }
}