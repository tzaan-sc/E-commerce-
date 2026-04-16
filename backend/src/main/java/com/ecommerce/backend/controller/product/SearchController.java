package com.ecommerce.backend.controller.product;

import com.ecommerce.backend.dto.auth.SearchSuggestDTO;
import com.ecommerce.backend.service.product.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@CrossOrigin
public class SearchController {

    private final SearchService searchService;

    // API gợi ý tìm kiếm (autocomplete)
    @GetMapping("/suggest")
    public List<SearchSuggestDTO> suggest(@RequestParam String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return List.of();
        }

        return searchService.suggest(keyword.trim());
    }
}
