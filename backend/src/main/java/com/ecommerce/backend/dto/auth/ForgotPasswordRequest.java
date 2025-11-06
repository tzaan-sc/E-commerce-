//package com.ecommerce.backend.dto.auth;
//
//import jakarta.validation.constraints.Email;
//import jakarta.validation.constraints.NotBlank;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//// ForgotPasswordRequest.java
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//public class ForgotPasswordRequest {
//    @NotBlank(message = "Email is required")
//    @Email(message = "Email should be valid")
//    private String email;
//}
package com.ecommerce.backend.dto.auth;

import lombok.Data;

@Data
public class ForgotPasswordRequest {
    private String email;
    private String token;
    private String newPassword;
}