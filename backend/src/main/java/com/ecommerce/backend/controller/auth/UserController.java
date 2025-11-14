package com.ecommerce.backend.controller.auth;

import com.ecommerce.backend.entity.auth.User;
import com.ecommerce.backend.service.auth.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000") // cho phép frontend React gọi API
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
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
}