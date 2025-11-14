package com.ecommerce.backend.dto.navigation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NavItemDto {
    private String name;
    private String path;
}