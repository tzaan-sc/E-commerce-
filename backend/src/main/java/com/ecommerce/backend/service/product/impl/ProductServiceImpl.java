package com.ecommerce.backend.service.product.impl;

import com.ecommerce.backend.dto.product.CreateProductRequest;
import com.ecommerce.backend.dto.product.UpdateProductRequest;
import com.ecommerce.backend.entity.product.*;
import com.ecommerce.backend.repository.product.BrandRepository;
import com.ecommerce.backend.repository.product.ProductRepository;
import com.ecommerce.backend.repository.product.ScreenSizeRepository;
import com.ecommerce.backend.repository.product.UsagePurposeRepository;
import com.ecommerce.backend.service.product.ProductService;
import com.ecommerce.backend.util.SlugUtil;
import lombok.RequiredArgsConstructor;
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
        product.setSlug(SlugUtil.toSlug(request.getName()));

        // ✅ SỬA LỖI: Bóc tách và gán thông số kỹ thuật vào bảng riêng
        if (request.getSpecifications() != null) {
            ProductSpecification spec = parseSpecifications(request.getSpecifications());
            spec.setProduct(product); // Thiết lập quan hệ 2 chiều
            product.setSpecification(spec);
        }

        // LOGIC LƯU NHIỀU ẢNH
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
        setProductCategories(product, request.getBrandId(), request.getUsagePurposeId(), request.getScreenSizeId());

        return productRepository.save(product);
    }

//    @Override
//    @Transactional
//    public Product updateProduct(Long id, UpdateProductRequest request) {
//        Product product = productRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Product không tồn tại"));
//
//        if (!product.getName().equals(request.getName()) && productRepository.existsByName(request.getName())) {
//            throw new RuntimeException("Tên sản phẩm '" + request.getName() + "' đã được sử dụng!");
//        }
//
//        product.setName(request.getName());
//        product.setDescription(request.getDescription());
//        product.setPrice(request.getPrice());
//        product.setStockQuantity(request.getStockQuantity());
//        product.setSlug(SlugUtil.toSlug(request.getName()));
//
//        // ✅ SỬA LỖI: Cập nhật thông số kỹ thuật
//        if (request.getSpecifications() != null) {
//            ProductSpecification spec = parseSpecifications(request.getSpecifications());
//            spec.setProduct(product);
//            // JPA sẽ tự động cập nhật bản ghi cũ trong bảng product_specifications nhờ cascade = ALL
//            product.setSpecification(spec);
//        }
//
//        // LOGIC UPDATE ẢNH
//        if (request.getImageUrls() != null) {
//            if (product.getImages() != null) {
//                product.getImages().clear();
//            } else {
//                product.setImages(new ArrayList<>());
//            }
//            for (String url : request.getImageUrls()) {
//                if (url != null && !url.trim().isEmpty()) {
//                    product.getImages().add(ImageProduct.builder()
//                            .urlImage(url.trim())
//                            .name("Ảnh cập nhật")
//                            .product(product)
//                            .build());
//                }
//            }
//        }
//
//        setProductCategories(product, request.getBrandId(), request.getUsagePurposeId(), request.getScreenSizeId());
//
//        return productRepository.save(product);
//    }
@Override
@Transactional
public Product updateProduct(Long id, UpdateProductRequest request) {
    Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product không tồn tại"));

    // 1. Kiểm tra trùng tên (giữ nguyên logic của bạn)
    if (!product.getName().equals(request.getName()) && productRepository.existsByName(request.getName())) {
        throw new RuntimeException("Tên sản phẩm '" + request.getName() + "' đã được sử dụng!");
    }

    // 2. Map các thông tin cơ bản
    product.setName(request.getName());
    product.setDescription(request.getDescription());
    product.setPrice(request.getPrice());
    product.setStockQuantity(request.getStockQuantity());
    product.setSlug(SlugUtil.toSlug(request.getName()));

    // 3. ✅ SỬA LỖI: Cập nhật thông số kỹ thuật (Specification)
    if (request.getSpecifications() != null) {
        // Gọi hàm parse để lấy dữ liệu mới từ chuỗi string
        ProductSpecification parsedSpec = parseSpecifications(request.getSpecifications());

        // Lấy spec hiện tại đang có trong Database
        ProductSpecification existingSpec = product.getSpecification();

        if (existingSpec != null) {
            // CẬP NHẬT vào đối tượng cũ (Tránh lỗi Same Identifier)
            existingSpec.setCpu(parsedSpec.getCpu());
            existingSpec.setVga(parsedSpec.getVga());
            existingSpec.setScreenDetail(parsedSpec.getScreenDetail());
            existingSpec.setResolution(parsedSpec.getResolution());
            existingSpec.setStorageType(parsedSpec.getStorageType());
            existingSpec.setOtherSpecs(parsedSpec.getOtherSpecs());
            // Không cần gọi setProduct vì nó đã liên kết sẵn rồi
        } else {
            // Nếu sản phẩm cũ chưa có spec, lúc này mới gán cái mới hoàn toàn
            parsedSpec.setProduct(product);
            product.setSpecification(parsedSpec);
        }
    }

    // 4. LOGIC UPDATE ẢNH (Giữ nguyên logic clear/add của bạn)
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

    setProductCategories(product, request.getBrandId(), request.getUsagePurposeId(), request.getScreenSizeId());

    return productRepository.save(product);
}
    /**
     * HÀM BÓC TÁCH CHUỖI THÔNG SỐ (PARSER)
     */
    private ProductSpecification parseSpecifications(String rawText) {
        ProductSpecification spec = new ProductSpecification();
        spec.setCpu(extractValue(rawText, "Loại CPU", "Cổng giao tiếp"));
        spec.setVga(extractValue(rawText, "Loại card đồ họa", "Dung lượng RAM"));
        spec.setScreenDetail(extractValue(rawText, "Kích thước màn hình", "Công nghệ màn hình"));
        spec.setResolution(extractValue(rawText, "Độ phân giải màn hình", "Loại CPU"));
        spec.setStorageType(extractValue(rawText, "Ổ cứng", "Kích thước màn hình"));
        spec.setOtherSpecs(rawText); // Lưu bản gốc để dự phòng
        return spec;
    }

    private String extractValue(String text, String startKey, String endKey) {
        if (text == null || !text.contains(startKey)) return "N/A";
        try {
            int start = text.indexOf(startKey) + startKey.length();
            int end = text.indexOf(endKey);
            if (end == -1 || end < start) return text.substring(start).trim();
            return text.substring(start, end).trim();
        } catch (Exception e) {
            return "N/A";
        }
    }

    // Hàm hỗ trợ gán Category để tránh lặp code
    private void setProductCategories(Product product, Long brandId, Long purposeId, Long screenSizeId) {
        if (brandId != null) {
            product.setBrand(brandRepository.findById(brandId).orElse(null));
        }
        if (purposeId != null) {
            product.setUsagePurpose(usagePurposeRepository.findById(purposeId).orElse(null));
        }
        if (screenSizeId != null) {
            product.setScreenSize(screenSizeRepository.findById(screenSizeId).orElse(null));
        }
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
    public List<Product> getAllProducts() { return productRepository.findAll(); }

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