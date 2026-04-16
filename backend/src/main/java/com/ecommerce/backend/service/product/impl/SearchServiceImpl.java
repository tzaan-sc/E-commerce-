package com.ecommerce.backend.service.product.impl;

import com.ecommerce.backend.dto.auth.SearchSuggestDTO;
import com.ecommerce.backend.entity.product.Product;
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

        // ✅ giới hạn 10 kết quả
        List<Product> products = productRepository.searchSuggest(key, PageRequest.of(0, 10));

        return products.stream()
                .map(p -> {
                    String imageUrl = null;

                    if (p.getImages() != null && !p.getImages().isEmpty()) {
                        imageUrl = p.getImages().get(0).getUrlImage();
                    }

                    return new SearchSuggestDTO(
                            p.getId(),
                            p.getName(),
                            p.getSlug(),
                            imageUrl,
                            p.getPrice()
                    );
                })
                .toList();
    }
}