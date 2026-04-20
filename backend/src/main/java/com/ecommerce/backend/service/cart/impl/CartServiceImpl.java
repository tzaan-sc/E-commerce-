package com.ecommerce.backend.service.cart.impl;

import com.ecommerce.backend.dto.cart.CheckoutRequest;
import com.ecommerce.backend.entity.auth.User;
import com.ecommerce.backend.entity.cart.CartItem;
import com.ecommerce.backend.entity.product.Order;
import com.ecommerce.backend.entity.product.OrderItem;
import com.ecommerce.backend.entity.product.Product;
import com.ecommerce.backend.entity.product.ProductVariant;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.repository.auth.UserRepository;
import com.ecommerce.backend.repository.cart.CartItemRepository;
import com.ecommerce.backend.repository.product.OrderRepository;
import com.ecommerce.backend.repository.product.ProductRepository;
import com.ecommerce.backend.repository.product.ProductVariantRepository; // 🔥 Thêm repo này
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
    private final ProductVariantRepository productVariantRepository; // 🔥 Inject thêm repo biến thể

    @Override
    @Transactional
    public CartItem addToCart(String email, Long productId, Long variantId, Integer quantity) {
        // 1. Tìm User
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        // 2. Tìm Sản phẩm chính
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        // 3. 🔥 LẤY BIẾN THỂ (VARIANT) ĐỂ KIỂM TRA CHÍNH XÁC
        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("Variant", "id", variantId));

        // 4. KIỂM TRA TỒN KHO CỦA BIẾN THỂ (Sử dụng field stockQuantity)
        if (variant.getStockQuantity() < quantity) {
            throw new RuntimeException("Cấu hình này không đủ số lượng tồn kho (Hiện còn: " + variant.getStockQuantity() + ")");
        }

        // 5. Kiểm tra xem cấu hình này đã có trong giỏ của User này chưa
        CartItem cartItem = cartItemRepository.findByUserAndProductAndVariant(user, product, variant)
                .orElse(CartItem.builder()
                        .user(user)
                        .product(product)
                        .variant(variant) // 🔥 Gán biến thể vào CartItem
                        .quantity(0)
                        .build());

        // 6. Kiểm tra tổng số lượng sau khi cộng dồn (Dựa trên tồn kho của biến thể)
        int newQuantity = cartItem.getQuantity() + quantity;
        if (variant.getStockQuantity() < newQuantity) {
            throw new RuntimeException("Tổng số lượng cấu hình này trong giỏ vượt quá tồn kho hiện có!");
        }

        cartItem.setQuantity(newQuantity);

        // Lưu lại
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
        long orderCount = orderRepository.countByUser(user);
        Order order = Order.builder()
                .user(user)
                .customerName(request.getFullName())
                .phone(request.getPhone())
                .shippingAddress(request.getAddress())
                .note(request.getNote())
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "COD")
                .status("PENDING")
                .userOrderNumber((int) orderCount + 1)
                .totalAmount(0.0)
                .build();

        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0;

        // 3. Duyệt qua từng món hàng để xử lý
        for (CartItem cartItem : selectedItems) {
            Product product = cartItem.getProduct();
            ProductVariant variant = cartItem.getVariant(); // 🔥 Lấy biến thể từ giỏ hàng

            // 👇 QUAN TRỌNG: KIỂM TRA VÀ TRỪ KHO BIẾN THỂ 👇
            if (variant == null) {
                throw new RuntimeException("Sản phẩm " + product.getName() + " thiếu thông tin cấu hình!");
            }

            if (variant.getStockQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Cấu hình của sản phẩm " + product.getName() + " không đủ số lượng!");
            }

            // Trừ số lượng tồn kho của BIẾN THỂ
            variant.setStockQuantity(variant.getStockQuantity() - cartItem.getQuantity());
            productVariantRepository.save(variant); // Lưu lại vào bảng product_variants

            // 🔥 SỬA LỖI TẠI ĐÂY: Gán variant và các trường giá cho OrderItem
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    // ✅ Thêm variant để cột variant_id trong DB không bị NULL
                    .variant(variant)
                    .productName(product.getName() + " (" + variant.getRamCapacity() + " - " + variant.getStorageCapacity() + ")")
                    .quantity(cartItem.getQuantity())
                    .price(variant.getPrice()) // Giá hiển thị
                    // ✅ Nếu DB có cột price_at_purchase (NOT NULL) thì gán thêm ở đây cho chắc:
                    // .priceAtPurchase(variant.getPrice())
                    .build();

            orderItems.add(orderItem);
            totalAmount += variant.getPrice() * cartItem.getQuantity();
        }

        order.setTotalAmount(totalAmount);
        order.setOrderItems(orderItems);

        // 4. Xóa các món đã mua khỏi giỏ hàng
        cartItemRepository.deleteAll(selectedItems);
        // 🔥 Thêm flush để đảm bảo lệnh xóa được thực hiện trước khi kết thúc Transaction
        cartItemRepository.flush();

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

        // 🔥 Check tồn kho của BIẾN THỂ khi update số lượng
        if (cartItem.getVariant().getStockQuantity() < quantity) {
            throw new RuntimeException("Kho không đủ số lượng cho cấu hình này");
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