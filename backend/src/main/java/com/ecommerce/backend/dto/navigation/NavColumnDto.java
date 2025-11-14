package com.ecommerce.backend.dto.navigation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NavColumnDto {
    private String name;
    private List<NavItemDto> subchild;
}