package com.ecommerce.backend.dto.auth;

import com.ecommerce.backend.entity.auth.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;
// AuthResponse.java
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String username;
    private String email;
    private Role role;
    private boolean isNewUser;
}


