package com.ecommerce.backend.dto.auth;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SearchSuggestDTO {
    private Long id;
    private String name;
    private String slug;
    private String image;
    private Double price;
}
