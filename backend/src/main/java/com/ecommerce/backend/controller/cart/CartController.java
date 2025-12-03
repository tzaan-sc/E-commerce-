package com.ecommerce.backend.controller.cart;

import com.ecommerce.backend.entity.cart.CartItem;
import com.ecommerce.backend.dto.cart.CheckoutRequest;
import com.ecommerce.backend.entity.product.Order;
import com.ecommerce.backend.service.cart.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
// Thêm 2 import quan trọng này
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
    public ResponseEntity<CartItem> addToCart(
            @AuthenticationPrincipal UserDetails userDetails, // <-- Sửa: Lấy user đã login
            @RequestParam Long productId,
            @RequestParam Integer quantity
            // @RequestParam Long userId, <-- Xóa: Không còn cần
    ) {
        // Kiểm tra xem user đã được xác thực chưa
        if (userDetails == null) {
            return ResponseEntity.status(401).build(); // 401 Unauthorized
        }
        // Lấy username (thường là email) từ token
        String username = userDetails.getUsername();

        if (quantity <= 0) quantity = 1;

        // Sửa: Gọi service bằng username
        return ResponseEntity.ok(cartService.addToCart(username, productId, quantity));
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

//    @PostMapping("/checkout")
//    public ResponseEntity<Order> checkout(
//            @AuthenticationPrincipal UserDetails userDetails // <-- Sửa: Lấy user đã login
//            // @RequestParam Long userId <-- Xóa
//    ) {
//        if (userDetails == null) {
//            return ResponseEntity.status(401).build();
//        }
//        String username = userDetails.getUsername();
//
//        // Sửa: Gọi service bằng username
//        return ResponseEntity.ok(cartService.checkout(username));
//    }

//    @PostMapping("/checkout-selected")
//    public ResponseEntity<Order> checkoutSelected(
//            @AuthenticationPrincipal UserDetails userDetails,
//            @RequestBody List<Long> cartItemIds // <-- Nhận mảng ID đã chọn
//    ) {
//        if (userDetails == null) return ResponseEntity.status(401).build();
//        String username = userDetails.getUsername();
//
//        Order order = cartService.checkoutSelected(username, cartItemIds);
//        return ResponseEntity.ok(order);
//    }
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

}