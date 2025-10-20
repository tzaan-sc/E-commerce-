package com.ecommerce.backend.dto;

import lombok.Data;

@Data
public class RegistrationRequest {
    private String fullName;
    private String phoneNumber;
    private String email;
    private String password;
}
