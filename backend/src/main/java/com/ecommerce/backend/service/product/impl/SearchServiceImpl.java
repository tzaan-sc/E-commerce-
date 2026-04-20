package com.ecommerce.backend.service.product.impl;

import com.ecommerce.backend.dto.auth.SearchSuggestDTO;
import com.ecommerce.backend.repository.product.ProductRepository;
import com.ecommerce.backend.service.product.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

    private final ProductRepository productRepository;

    @Override
    public List<SearchSuggestDTO> suggest(String keyword) {

        // ✅ tránh null + rỗng
        if (keyword == null || keyword.trim().isEmpty()) {
            return List.of();
        }

        String key = keyword.trim().toLowerCase();

        // ✅ GỌI TRỰC TIẾP DTO (KHÔNG map nữa)
        return productRepository.searchSuggest(key, PageRequest.of(0, 5));
    }
}