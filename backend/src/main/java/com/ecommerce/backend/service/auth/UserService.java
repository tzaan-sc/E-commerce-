    package com.ecommerce.backend.service.auth;

    import com.ecommerce.backend.entity.auth.User;
    import com.ecommerce.backend.repository.auth.UserRepository;
    import com.ecommerce.backend.dto.auth.UpdateProfileRequest;
    import com.ecommerce.backend.dto.auth.ChangePasswordRequest;
    import lombok.RequiredArgsConstructor; // Thêm cái này để tự tạo Constructor
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.stereotype.Service;
    import org.springframework.transaction.annotation.Transactional;

    import java.util.List;
    import java.util.Optional;

    @Service
//    @RequiredArgsConstructor
    public class UserService {
        private final UserRepository userRepository;
//        private final PasswordEncoder passwordEncoder;

        public UserService(UserRepository userRepository) {
            this.userRepository = userRepository;
        }

        public List<User> findAll() {
            return userRepository.findAll();
        }

        public Optional<User> findById(Long id) {
            return userRepository.findById(id);
        }

        public User save(User user) {
            return userRepository.save(user);
        }

        public void delete(Long id) {
            userRepository.deleteById(id);
        }

        public User getUserByEmail(String email) {
            return userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        }

        @Transactional // Đảm bảo tính toàn vẹn dữ liệu
        public User updateProfile(String email, UpdateProfileRequest request) {
            // 1. Tìm user theo email (email lấy từ Token)
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

            // 2. Cập nhật các trường thông tin nếu có dữ liệu gửi lên

            // Cập nhật Họ tên (Map từ 'name' của DTO sang 'username' của Entity)
            // Thay request.getName() thành request.getUsername()
            if (request.getUsername() != null && !request.getUsername().isEmpty()) {
                user.setUsername(request.getUsername());
            }

            // Cập nhật Số điện thoại
            if (request.getPhone() != null && !request.getPhone().isEmpty()) {
                user.setPhone(request.getPhone());
            }

            // Cập nhật Địa chỉ
            if (request.getAddress() != null && !request.getAddress().isEmpty()) {
                user.setAddress(request.getAddress());
            }

            // 3. Xử lý cập nhật Email (Tùy chọn: cần kiểm tra trùng lặp nếu cho phép đổi email)
            if (request.getEmail() != null && !request.getEmail().isEmpty() && !request.getEmail().equals(email)) {
                if (userRepository.existsByEmail(request.getEmail())) {
                    throw new RuntimeException("Email này đã được sử dụng!");
                }
                user.setEmail(request.getEmail());
            }

            // 4. Lưu lại vào Database
            return userRepository.save(user);
        }

//        @Transactional
//        public void changePassword(String email, ChangePasswordRequest request) {
//            User user = getUserByEmail(email);
//
//            // 1. Kiểm tra mật khẩu cũ có khớp không
//            if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
//                throw new RuntimeException("Mật khẩu cũ không chính xác!");
//            }
//
//            // 2. Mã hóa mật khẩu mới và lưu
//            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
//            userRepository.save(user);
//        }
    }