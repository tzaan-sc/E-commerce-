package com.ecommerce.backend.controller.cart;

import com.ecommerce.backend.entity.cart.CartItem;
import com.ecommerce.backend.dto.cart.CheckoutRequest;
import com.ecommerce.backend.entity.product.Order;
import com.ecommerce.backend.service.cart.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin("*")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam Long productId,
            @RequestParam Long variantId,
            @RequestParam Integer quantity
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Vui lòng đăng nhập để thêm vào giỏ hàng");
        }

        try {
            String username = userDetails.getUsername();
            if (quantity == null || quantity <= 0) quantity = 1;

            CartItem savedItem = cartService.addToCart(username, productId, variantId, quantity);
            return ResponseEntity.ok(savedItem);
        } catch (RuntimeException e) {
            // Trả về lỗi nếu hết kho hoặc không tìm thấy biến thể
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping // <-- Sửa: Xóa "/{userId}"
    public ResponseEntity<List<CartItem>> getCart(
            @AuthenticationPrincipal UserDetails userDetails // <-- Sửa: Lấy user đã login
            // @PathVariable Long userId <-- Xóa
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        String username = userDetails.getUsername();

        // Sửa: Gọi service bằng username
        return ResponseEntity.ok(cartService.getCartItems(username));
    }

    @PostMapping("/checkout-selected")
    public ResponseEntity<Order> checkoutSelected(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CheckoutRequest request // 👈 Sửa ở đây
    ) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        String username = userDetails.getUsername();

        // Truyền cả object request vào service
        Order order = cartService.checkoutSelected(username, request);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<CartItem> updateCartItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity
    ) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        if (quantity < 1) quantity = 1; // Bảo vệ số lượng

        String username = userDetails.getUsername();
        CartItem updatedItem = cartService.updateItemQuantity(username, cartItemId, quantity);
        return ResponseEntity.ok(updatedItem);
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<?> removeCartItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long cartItemId
    ) {
        if (userDetails == null) return ResponseEntity.status(401).build();

        String username = userDetails.getUsername();
        cartService.removeItemFromCart(username, cartItemId);
        return ResponseEntity.ok("Item removed");
    }

    @PostMapping("/remove-batch")
    public ResponseEntity<?> removeCartItems(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody List<Long> cartItemIds // <-- Nhận mảng ID từ body
    ) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        String username = userDetails.getUsername();
        cartService.removeItemsFromCart(username, cartItemIds); // Gọi service
        return ResponseEntity.ok("Items removed");
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countCartItems(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        // Nếu chưa đăng nhập -> Trả về 0
        if (userDetails == null) {
            return ResponseEntity.ok(0L);
        }

        String username = userDetails.getUsername();
        return ResponseEntity.ok(cartService.countCartItems(username));
    }
}