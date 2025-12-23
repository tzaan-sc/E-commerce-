package com.ecommerce.backend.dto.auth;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String username;    // Frontend gửi "name", Backend sẽ map vào "username" hoặc "fullName"
    private String phone;
    private String address;
    private String email;
    private String avatarUrl;
}
