package com.ecommerce.backend.service;
import java.util.Optional;
import com.ecommerce.backend.dto.RegistrationRequest;
import com.ecommerce.backend.model.User;
import com.ecommerce.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerNewUser(RegistrationRequest request) throws IllegalArgumentException {

        // 1. Kiểm tra email đã tồn tại
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email đã được đăng kí.");
        }

        User newUser = new User();
        newUser.setFullName(request.getFullName());
        newUser.setPhoneNumber(request.getPhoneNumber());
        newUser.setEmail(request.getEmail());

        // 2. Mã hóa mật khẩu
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        newUser.setPassword(encodedPassword);

        // 3. Lưu vào DB
        return userRepository.save(newUser);
    }
     // ✅ Hàm Xác thực người dùng khi đăng nhập
    public User authenticateUser(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // So sánh mật khẩu nhập vào với mật khẩu đã mã hóa trong DB
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user; // Đăng nhập thành công
            }
        }
        return null; // Sai email hoặc mật khẩu
    }
}
