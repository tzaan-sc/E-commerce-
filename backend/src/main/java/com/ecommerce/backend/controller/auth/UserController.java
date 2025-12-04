package com.ecommerce.backend.controller.auth;

import com.ecommerce.backend.entity.auth.User;
import com.ecommerce.backend.service.auth.UserService;
import com.ecommerce.backend.repository.auth.UserRepository; // ✅ FIX 1: THÊM IMPORT REPOSITORY
import org.springframework.http.ResponseEntity; // ✅ FIX 2: THÊM IMPORT RESPONSE ENTITY
import org.springframework.security.access.prepost.PreAuthorize; // ✅ Cần cho @PreAuthorize
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    // ✅ FIX 3: SỬA CONSTRUCTOR để tiêm (inject) cả hai Repository/Service
    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    // Lấy danh sách tài khoản
    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAll();
    }

    // Lấy 1 tài khoản theo ID
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Thêm tài khoản mới
    @PostMapping
    public User createUser(@RequestBody User user) {
        // đảm bảo có mật khẩu mặc định nếu chưa có
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            user.setPassword("123456");
        }
        return userService.save(user);
    }

    // Cập nhật tài khoản
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        User user = userService.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        user.setUsername(updatedUser.getUsername());
        user.setEmail(updatedUser.getEmail());
        user.setRole(updatedUser.getRole());
        user.setPhone(updatedUser.getPhone());
        user.setAddress(updatedUser.getAddress());
        user.setActive(updatedUser.isActive());

        return userService.save(user);
    }

    // Xóa tài khoản
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.delete(id);
    }

    // ✅ FIX 4: Thêm API đếm tài khoản (Đã dùng UserRepository)
    @GetMapping("/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getTotalUserCount() {
        return ResponseEntity.ok(userRepository.count());
    }

    @GetMapping("/my-info")
    public ResponseEntity<User> getMyInfo(@AuthenticationPrincipal UserDetails userDetails) {
        // Kiểm tra đăng nhập
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        // Lấy email từ token
        String email = userDetails.getUsername();

        // Gọi service lấy thông tin
        User user = userService.getUserByEmail(email);

        return ResponseEntity.ok(user);
    }

}