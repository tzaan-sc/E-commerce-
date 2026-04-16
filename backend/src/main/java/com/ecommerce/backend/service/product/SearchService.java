package com.ecommerce.backend.service.product;

import com.ecommerce.backend.dto.auth.SearchSuggestDTO;

import java.util.List;

public interface SearchService {
    List<SearchSuggestDTO> suggest(String keyword);
}
