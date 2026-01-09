package com.ecommerce.backend.service.product;
import com.ecommerce.backend.util.SlugUtil;
import com.ecommerce.backend.dto.product.CreateProductRequest;
import com.ecommerce.backend.dto.product.UpdateProductRequest;
import com.ecommerce.backend.dto.product.ProductSuggest.ProductSuggestDto;
import com.ecommerce.backend.entity.product.Product;

import java.util.List;

public interface ProductService {
    Product createProduct(CreateProductRequest request);
    Product updateProduct(Long id, UpdateProductRequest request);
    void deleteProduct(Long id);
    Product getProductById(Long id);
    List<Product> getAllProducts();
    List<Product> getProductsByBrand(Long brandId);
    List<Product> getProductsByUsagePurpose(Long usagePurposeId);
    List<Product> filterProducts(Long usagePurposeId, Long brandId);
    List<Product> searchProducts(String keyword);
    //    List<Product> advancedFilter(String keyword, List<Long> brandIds, Long purposeId,
//                                 Long screenSizeId, Double minPrice, Double maxPrice, String sortBy);
    List<Product> advancedFilter(
            String keyword,
            List<Long> brandIds,
            Long purposeId,
            Long screenSizeId,
            Double minPrice,
            Double maxPrice,
            String sortBy
    );


    List<String> suggestKeywords(String keyword);

    List<ProductSuggestDto> suggestProducts(String keyword);

}

