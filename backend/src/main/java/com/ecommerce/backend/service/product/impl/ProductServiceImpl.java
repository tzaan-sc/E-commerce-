package com.ecommerce.backend.service.product.impl;

import com.ecommerce.backend.dto.product.CreateProductRequest;
import com.ecommerce.backend.dto.product.UpdateProductRequest;
import com.ecommerce.backend.entity.product.*;
import com.ecommerce.backend.entity.promotion.Promotion;
import com.ecommerce.backend.repository.product.BrandRepository;
import com.ecommerce.backend.repository.product.ProductRepository;
import com.ecommerce.backend.repository.promotion.PromotionRepository;
import com.ecommerce.backend.repository.product.ScreenSizeRepository;
import com.ecommerce.backend.repository.product.UsagePurposeRepository;
import com.ecommerce.backend.service.product.ProductService;
import com.ecommerce.backend.util.SlugUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final UsagePurposeRepository usagePurposeRepository;
    private final ScreenSizeRepository screenSizeRepository;
    @Autowired
    private PromotionRepository promotionRepository;

//    @Override
//    @Transactional
//    public Product createProduct(CreateProductRequest request) {
//        if (productRepository.existsByName(request.getName())) {
//            throw new RuntimeException("Tên sản phẩm '" + request.getName() + "' đã tồn tại!");
//        }
//
//        Product product = new Product();
//        product.setName(request.getName());
//        product.setDescription(request.getDescription());
//        product.setPrice(request.getPrice());
//        product.setStockQuantity(request.getStockQuantity());
//        product.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");
//        product.setImageUrl(request.getImageUrl());
//
//        product.setSlug(request.getSlug() != null && !request.getSlug().isEmpty()
//                ? request.getSlug() : SlugUtil.toSlug(request.getName()));
//
//        // ✅ LOGIC MỚI: Gán trực tiếp Object, không cần parse chuỗi nữa
//        if (request.getSpecification() != null) {
//            product.setSpecification(request.getSpecification());
//        } else {
//            product.setSpecification(new ProductSpecification());
//        }
//
//        // LOGIC LƯU NHIỀU ẢNH
//        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
//            List<ImageProduct> images = new ArrayList<>();
//            for (String url : request.getImageUrls()) {
//                if (url != null && !url.trim().isEmpty()) {
//                    images.add(ImageProduct.builder()
//                            .urlImage(url.trim())
//                            .name("Ảnh sản phẩm")
//                            .product(product)
//                            .build());
//                }
//            }
//            product.setImages(images);
//        }
//
//        // Tra cứu danh mục
//        setProductCategories(product, request.getBrandId(), request.getPurposeId(), request.getScreenSizeId());
//
//        return productRepository.save(product);
//    }
//
//    @Override
//    @Transactional
//    public Product updateProduct(Long id, UpdateProductRequest request) {
//        Product product = productRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Product không tồn tại"));
//
//        // Kiểm tra trùng tên
//        if (!product.getName().equals(request.getName()) && productRepository.existsByName(request.getName())) {
//            throw new RuntimeException("Tên sản phẩm '" + request.getName() + "' đã được sử dụng!");
//        }
//
//        product.setName(request.getName());
//        product.setDescription(request.getDescription());
//        product.setPrice(request.getPrice());
//        product.setStockQuantity(request.getStockQuantity());
//        product.setStatus(request.getStatus());
//        product.setImageUrl(request.getImageUrl());
//        product.setSlug(request.getSlug() != null ? request.getSlug() : SlugUtil.toSlug(request.getName()));
//
//        // ✅ FIX LỖI KHUYẾN MÃI: Set đúng object Promotion từ DB
//        if (request.getPromotionId() != null) {
//            // Tìm promotion trong DB bằng ID gửi từ React lên
//            Promotion promo = promotionRepository.findById(request.getPromotionId()).orElse(null);
//            product.setPromotion(promo);
//        } else {
//            product.setPromotion(null);
//        }
//
//        // ✅ LOGIC THÔNG SỐ: Cập nhật thẳng thông số kỹ thuật (Specification)
//        if (request.getSpecification() != null) {
//            product.setSpecification(request.getSpecification());
//        }
//
//        // LOGIC UPDATE ẢNH (Fix để hình 3 hiện trong DB)
//        if (request.getImageUrls() != null) {
//            product.getImages().clear(); // Xoá ảnh cũ
//            for (String url : request.getImageUrls()) {
//                if (url != null && !url.trim().isEmpty()) {
//                    // Sử dụng Builder hoặc Constructor để tạo ảnh mới
//                    product.getImages().add(ImageProduct.builder()
//                            .urlImage(url.trim())
//                            .name("Ảnh cập nhật")
//                            .product(product) // 👈 Quan trọng: Gán lại liên kết cha
//                            .build());
//                }
//            }
//        }
//
//        // Cập nhật Thương hiệu, Mục đích, Màn hình
//        setProductCategories(product, request.getBrandId(), request.getPurposeId(), request.getScreenSizeId());
//
//        return productRepository.save(product);
//    }

    @Override
    @Transactional
    public Product createProduct(CreateProductRequest request) {
        if (productRepository.existsByName(request.getName())) {
            throw new RuntimeException("Tên sản phẩm '" + request.getName() + "' đã tồn tại!");
        }

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");
        product.setImageUrl(request.getImageUrl());
        product.setSlug(request.getSlug() != null && !request.getSlug().isEmpty()
                ? request.getSlug() : SlugUtil.toSlug(request.getName()));

        // ✅ FIX LỖI: Thiết lập mối quan hệ 1-1 cho Specification
        if (request.getSpecification() != null) {
            ProductSpecification spec = request.getSpecification();
            spec.setProduct(product); // 👈 BẮT BUỘC có dòng này để @MapsId hoạt động
            product.setSpecification(spec);
        } else {
            ProductSpecification emptySpec = new ProductSpecification();
            emptySpec.setProduct(product); // 👈 Kể cả spec trống cũng phải gán product
            product.setSpecification(emptySpec);
        }

        // ✅ BỔ SUNG: Logic Khuyến mãi cho Create (Bạn đang thiếu ở hàm create)
        if (request.getPromotionId() != null) {
            Promotion promo = promotionRepository.findById(request.getPromotionId()).orElse(null);
            product.setPromotion(promo);
        }

        // LOGIC LƯU NHIỀU ẢNH (Giữ nguyên)
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            List<ImageProduct> images = new ArrayList<>();
            for (String url : request.getImageUrls()) {
                if (url != null && !url.trim().isEmpty()) {
                    images.add(ImageProduct.builder()
                            .urlImage(url.trim())
                            .name("Ảnh sản phẩm")
                            .product(product)
                            .build());
                }
            }
            product.setImages(images);
        }

        // Tra cứu danh mục
        setProductCategories(product, request.getBrandId(), request.getPurposeId(), request.getScreenSizeId());

        return productRepository.save(product);
    }

    @Override
    @Transactional
    public Product updateProduct(Long id, UpdateProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product không tồn tại"));

        if (!product.getName().equals(request.getName()) && productRepository.existsByName(request.getName())) {
            throw new RuntimeException("Tên sản phẩm '" + request.getName() + "' đã được sử dụng!");
        }

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setStatus(request.getStatus());
        product.setImageUrl(request.getImageUrl());
        product.setSlug(request.getSlug() != null ? request.getSlug() : SlugUtil.toSlug(request.getName()));

        // FIX LỖI KHUYẾN MÃI
        if (request.getPromotionId() != null) {
            Promotion promo = promotionRepository.findById(request.getPromotionId()).orElse(null);
            product.setPromotion(promo);
        } else {
            product.setPromotion(null);
        }

        // ✅ FIX LỖI: Cập nhật Specification
        if (request.getSpecification() != null) {
            ProductSpecification spec = request.getSpecification();
            spec.setProduct(product); // 👈 BẮT BUỘC gán lại link cho Update
            product.setSpecification(spec);
        }

        // LOGIC UPDATE ẢNH (Giữ nguyên liên kết cha)
        if (request.getImageUrls() != null) {
            product.getImages().clear();
            for (String url : request.getImageUrls()) {
                if (url != null && !url.trim().isEmpty()) {
                    product.getImages().add(ImageProduct.builder()
                            .urlImage(url.trim())
                            .name("Ảnh cập nhật")
                            .product(product)
                            .build());
                }
            }
        }

        setProductCategories(product, request.getBrandId(), request.getPurposeId(), request.getScreenSizeId());

        return productRepository.save(product);
    }

    // Hàm hỗ trợ gán Category
    private void setProductCategories(Product product, Long brandId, Long purposeId, Long screenSizeId) {
        if (brandId != null) product.setBrand(brandRepository.findById(brandId).orElse(null));
        // Chú ý: trong file DTO dùng trường purposeId để map với form.purposeId
        if (purposeId != null) product.setUsagePurpose(usagePurposeRepository.findById(purposeId).orElse(null));
        if (screenSizeId != null) product.setScreenSize(screenSizeRepository.findById(screenSizeId).orElse(null));
    }

    // --- CÁC HÀM GET/DELETE/SEARCH GIỮ NGUYÊN ---
    @Override
    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) throw new RuntimeException("Product không tồn tại");
        productRepository.deleteById(id);
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product không tồn tại"));
    }

    @Override
    public List<Product> getAllProducts() {
        // Nếu FE gọi hàm này, nó sẽ chỉ thấy hàng đang bán
        return productRepository.findByStatus("ACTIVE");
    }

    @Override
    public List<Product> getProductsByBrand(Long brandId) { return productRepository.findByBrandId(brandId); }

    @Override
    public List<Product> getProductsByUsagePurpose(Long usagePurposeId) { return productRepository.findByUsagePurposeId(usagePurposeId); }

    @Override
    public List<Product> filterProducts(Long usagePurposeId, Long brandId) { return productRepository.findByUsagePurposeIdAndBrandId(usagePurposeId, brandId); }

    @Override
    public List<Product> searchProducts(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) return productRepository.findAll();
        String searchKeyword = SlugUtil.removeDiacritics(keyword.trim());
        String fullTextSearchQuery = "+" + searchKeyword.replaceAll("\\s+", "* +") + "*";
        return productRepository.fullTextSearch(fullTextSearchQuery);
    }

    @Override
    @Transactional
    public void toggleProductStatus(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        // Nếu đang ACTIVE thì đổi sang INACTIVE và ngược lại
        if ("ACTIVE".equals(product.getStatus())) {
            product.setStatus("INACTIVE");
        } else {
            product.setStatus("ACTIVE");
        }

        productRepository.save(product);
    }

    @Override
    public List<Product> advancedFilter(String keyword, List<Long> brandIds, Long purposeId, Long screenSizeId, Double minPrice, Double maxPrice, String sortBy) {
        List<Product> products = productRepository.advancedFilter(keyword, brandIds, purposeId, screenSizeId, minPrice, maxPrice);
        if (sortBy != null && !sortBy.equals("default")) {
            switch (sortBy) {
                case "price_asc": products.sort(Comparator.comparing(Product::getPrice)); break;
                case "price_desc": products.sort(Comparator.comparing(Product::getPrice).reversed()); break;
                case "name_asc": products.sort(Comparator.comparing(Product::getName)); break;
                case "name_desc": products.sort(Comparator.comparing(Product::getName).reversed()); break;
            }
        }
        return products;
    }
}