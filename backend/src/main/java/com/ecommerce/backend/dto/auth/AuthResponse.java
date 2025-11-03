package com.ecommerce.backend.dto.auth;

import com.ecommerce.backend.entity.auth.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
// AuthResponse.java
@Data
@NoArgsConstructor
@AllArgsConstructor

public class AuthResponse {
    private String token;
    private String username;
    private String email;
    private Role role;
}

