package com.ecommerce.backend.service.product.impl;

import com.ecommerce.backend.dto.product.Product.CreateProductRequest;
import com.ecommerce.backend.dto.product.Product.UpdateProductRequest;
import com.ecommerce.backend.entity.product.Brand;
import com.ecommerce.backend.entity.product.Product;
import com.ecommerce.backend.entity.product.ScreenSize;
import com.ecommerce.backend.entity.product.UsagePurpose;
import com.ecommerce.backend.repository.product.BrandRepository;
import com.ecommerce.backend.repository.product.ProductRepository;
import com.ecommerce.backend.repository.product.ScreenSizeRepository;
import com.ecommerce.backend.repository.product.UsagePurposeRepository;
import com.ecommerce.backend.service.product.ProductService;
import com.ecommerce.backend.util.SlugUtil;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final UsagePurposeRepository usagePurposeRepository;
    private final ScreenSizeRepository screenSizeRepository;

    @Override
    public Product createProduct(CreateProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setImageUrl(request.getImageUrl());

        // Generate slug
        product.setSlug(SlugUtil.toSlug(request.getName()));

        // Set Brand nếu có
        if (request.getBrandId() != null) {
            Brand brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new RuntimeException("Brand not found"));
            product.setBrand(brand);
        }

        // Set UsagePurpose nếu có
        if (request.getUsagePurposeId() != null) {
            UsagePurpose usagePurpose = usagePurposeRepository.findById(request.getUsagePurposeId())
                    .orElseThrow(() -> new RuntimeException("Usage purpose not found"));
            product.setUsagePurpose(usagePurpose);
        }

        // Set ScreenSize nếu có
        if (request.getScreenSizeId() != null) {
            ScreenSize screenSize = screenSizeRepository.findById(request.getScreenSizeId())
                    .orElseThrow(() -> new RuntimeException("Screen size not found"));
            product.setScreenSize(screenSize);
        }

        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Long id, UpdateProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product không tồn tại"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setImageUrl(request.getImageUrl());

        // Cập nhật slug khi tên thay đổi
        product.setSlug(SlugUtil.toSlug(request.getName()));

        // Update Brand nếu có
        if (request.getBrandId() != null) {
            Brand brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new RuntimeException("Brand không tồn tại"));
            product.setBrand(brand);
        }

        // Update UsagePurpose nếu có
        if (request.getUsagePurposeId() != null) {
            UsagePurpose usagePurpose = usagePurposeRepository.findById(request.getUsagePurposeId())
                    .orElseThrow(() -> new RuntimeException("UsagePurpose không tồn tại"));
            product.setUsagePurpose(usagePurpose);
        }

        // Update ScreenSize nếu có
        if (request.getScreenSizeId() != null) {
            ScreenSize screenSize = screenSizeRepository.findById(request.getScreenSizeId())
                    .orElseThrow(() -> new RuntimeException("ScreenSize không tồn tại"));
            product.setScreenSize(screenSize);
        }

        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product không tồn tại"));
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
}
