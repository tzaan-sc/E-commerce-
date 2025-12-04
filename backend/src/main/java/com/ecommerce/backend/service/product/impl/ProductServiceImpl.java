//package com.ecommerce.backend.service.product.impl;
//
//import com.ecommerce.backend.dto.product.CreateProductRequest;
//import com.ecommerce.backend.dto.product.UpdateProductRequest;
//import com.ecommerce.backend.entity.product.Brand;
//import com.ecommerce.backend.entity.product.Product;
//import com.ecommerce.backend.entity.product.ScreenSize;
//import com.ecommerce.backend.entity.product.UsagePurpose;
//import com.ecommerce.backend.repository.product.BrandRepository;
//import com.ecommerce.backend.repository.product.ProductRepository;
//import com.ecommerce.backend.repository.product.ScreenSizeRepository;
//import com.ecommerce.backend.repository.product.UsagePurposeRepository;
//import com.ecommerce.backend.service.product.ProductService;
//import com.ecommerce.backend.util.SlugUtil;
//import com.ecommerce.backend.entity.product.ImageProduct;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.Comparator;
//import java.util.List;
//import java.util.ArrayList;
//
//@Service
//@RequiredArgsConstructor
//public class ProductServiceImpl implements ProductService {
//
//    private final ProductRepository productRepository;
//    private final BrandRepository brandRepository;
//    private final UsagePurposeRepository usagePurposeRepository;
//    private final ScreenSizeRepository screenSizeRepository;
//
//    @Override
//    @Transactional
//    public Product createProduct(CreateProductRequest request) {
//
//        Product product = new Product();
//
//        product.setName(request.getName());
//        product.setDescription(request.getDescription());
//        product.setPrice(request.getPrice());
//        product.setStockQuantity(request.getStockQuantity());
//        product.setSlug(SlugUtil.toSlug(request.getName()));
//
//        // ✅ Thêm: Lưu thông số kỹ thuật
//        product.setSpecifications(request.getSpecifications());
//
//        // 👇 LOGIC LƯU NHIỀU ẢNH (Thay thế cho setImageUrl cũ)
//        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
//            List<ImageProduct> images = new ArrayList<>();
//            for (String url : request.getImageUrls()) {
//                if (url != null && !url.trim().isEmpty()) {
//                    ImageProduct image = ImageProduct.builder()
//                            .urlImage(url.trim())
//                            .name("Ảnh sản phẩm")
//                            .product(product)
//                            .build();
//                    images.add(image);
//                }
//            }
//            // Nếu list chưa khởi tạo (dù trong Entity thường đã new ArrayList)
//            if (product.getImages() == null) {
//                product.setImages(images);
//            } else {
//                product.getImages().addAll(images);
//            }
//        }
//
//        if (request.getBrandId() != null) {
//            Brand brand = brandRepository.findById(request.getBrandId())
//                    .orElseThrow(() -> new RuntimeException("Brand not found"));
//            product.setBrand(brand);
//        }
//
//        if (request.getUsagePurposeId() != null) {
//            UsagePurpose usagePurpose = usagePurposeRepository.findById(request.getUsagePurposeId())
//                    .orElseThrow(() -> new RuntimeException("UsagePurpose not found"));
//            product.setUsagePurpose(usagePurpose);
//        }
//
//        if (request.getScreenSizeId() != null) {
//            ScreenSize screenSize = screenSizeRepository.findById(request.getScreenSizeId())
//                    .orElseThrow(() -> new RuntimeException("ScreenSize not found"));
//            product.setScreenSize(screenSize);
//        }
//
//        return productRepository.save(product);
//    }
//
//    @Override
//    @Transactional
//    public Product updateProduct(Long id, UpdateProductRequest request) {
//
//        Product product = productRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Product không tồn tại"));
//
//        product.setName(request.getName());
//        product.setDescription(request.getDescription());
//        product.setPrice(request.getPrice());
//        product.setStockQuantity(request.getStockQuantity());
//        product.setSlug(SlugUtil.toSlug(request.getName()));
//
//        // ✅ Thêm: Cập nhật thông số kỹ thuật
//        product.setSpecifications(request.getSpecifications());
//
//        // 👇 LOGIC UPDATE ẢNH (Xóa cũ thêm mới)
//        if (request.getImageUrls() != null) {
//            // Xóa hết ảnh cũ
//            if (product.getImages() != null) {
//                product.getImages().clear();
//            } else {
//                product.setImages(new ArrayList<>());
//            }
//
//            // Thêm danh sách ảnh mới
//            for (String url : request.getImageUrls()) {
//                if (url != null && !url.trim().isEmpty()) {
//                    ImageProduct image = ImageProduct.builder()
//                            .urlImage(url.trim())
//                            .name("Ảnh cập nhật")
//                            .product(product)
//                            .build();
//                    product.getImages().add(image);
//                }
//            }
//        }
//
//        if (request.getBrandId() != null) {
//            Brand brand = brandRepository.findById(request.getBrandId())
//                    .orElseThrow(() -> new RuntimeException("Brand không tồn tại"));
//            product.setBrand(brand);
//        }
//
//        if (request.getUsagePurposeId() != null) {
//            UsagePurpose usagePurpose = usagePurposeRepository.findById(request.getUsagePurposeId())
//                    .orElseThrow(() -> new RuntimeException("UsagePurpose không tồn tại"));
//            product.setUsagePurpose(usagePurpose);
//        }
//
//        if (request.getScreenSizeId() != null) {
//            ScreenSize screenSize = screenSizeRepository.findById(request.getScreenSizeId())
//                    .orElseThrow(() -> new RuntimeException("ScreenSize không tồn tại"));
//            product.setScreenSize(screenSize);
//        }
//
//        return productRepository.save(product);
//    }
//
//    @Override
//    @Transactional
//    public void deleteProduct(Long id) {
//        if (!productRepository.existsById(id)) {
//            throw new RuntimeException("Product không tồn tại");
//        }
//        productRepository.deleteById(id);
//    }
//
//    @Override
//    public Product getProductById(Long id) {
//        return productRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Product không tồn tại"));
//    }
//
//    @Override
//    public List<Product> getAllProducts() {
//        return productRepository.findAll();
//    }
//
//    @Override
//    public List<Product> getProductsByBrand(Long brandId) {
//        // Gọi hàm vừa viết trong Repository
//        return productRepository.findByBrandId(brandId);
//    }
//    @Override
//    public List<Product> getProductsByUsagePurpose(Long usagePurposeId) {
//        List<Product> products = productRepository.findByUsagePurposeId(usagePurposeId);
//        // In ra màn hình console để kiểm tra
//        System.out.println("Đang tìm ID nhu cầu: " + usagePurposeId);
//        System.out.println("Số lượng tìm thấy: " + products.size());
//        return products;
//    }
//    @Override
//    public List<Product> filterProducts(Long usagePurposeId, Long brandId) {
//        return productRepository.findByUsagePurposeIdAndBrandId(usagePurposeId, brandId);
//    }
//    @Override
//    public List<Product> searchProducts(String keyword) {
//        if (keyword == null || keyword.trim().isEmpty()) {
//            // Trả về tất cả sản phẩm nếu từ khóa trống
//            return productRepository.findAll();
//        }
//        // Gọi phương thức FULL-TEXT SEARCH mới
//        return productRepository.fullTextSearch(keyword);
//    }
//    @Override
//    public List<Product> advancedFilter(
//            String keyword,
//            List<Long> brandIds,
//            Long purposeId,
//            Long screenSizeId,
//            Double minPrice,
//            Double maxPrice,
//            String sortBy
//    ) {
//        // Log để debug
//        System.out.println("=== ADVANCED FILTER ===");
//        System.out.println("Keyword: " + keyword);
//        System.out.println("BrandIds: " + brandIds);
//        System.out.println("PurposeId: " + purposeId);
//        System.out.println("ScreenSizeId: " + screenSizeId);
//        System.out.println("MinPrice: " + minPrice);
//        System.out.println("MaxPrice: " + maxPrice);
//        System.out.println("SortBy: " + sortBy);
//
//        // Gọi repository để lấy dữ liệu
//        List<Product> products = productRepository.advancedFilter(
//                keyword,
//                brandIds,
//                purposeId,
//                screenSizeId,
//                minPrice,
//                maxPrice
//        );
//
//        System.out.println("Số sản phẩm tìm được: " + products.size());
//
//        // Sắp xếp nếu có
//        if (sortBy != null && !sortBy.equals("default")) {
//            switch (sortBy) {
//                case "price_asc":
//                    products.sort(Comparator.comparing(Product::getPrice));
//                    break;
//                case "price_desc":
//                    products.sort(Comparator.comparing(Product::getPrice).reversed());
//                    break;
//                case "name_asc":
//                    products.sort(Comparator.comparing(Product::getName));
//                    break;
//                case "name_desc":
//                    products.sort(Comparator.comparing(Product::getName).reversed());
//                    break;
//            }
//        }
//
//        return products;
//    }
//}
package com.ecommerce.backend.service.product.impl;

import com.ecommerce.backend.dto.product.CreateProductRequest;
import com.ecommerce.backend.dto.product.UpdateProductRequest;
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
import com.ecommerce.backend.entity.product.ImageProduct;
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

        Product product = new Product();

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setSlug(SlugUtil.toSlug(request.getName()));

        // ✅ Thêm: Lưu thông số kỹ thuật
        product.setSpecifications(request.getSpecifications());

        // 👇 LOGIC LƯU NHIỀU ẢNH (Thay thế cho setImageUrl cũ)
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            List<ImageProduct> images = new ArrayList<>();
            for (String url : request.getImageUrls()) {
                if (url != null && !url.trim().isEmpty()) {
                    ImageProduct image = ImageProduct.builder()
                            .urlImage(url.trim())
                            .name("Ảnh sản phẩm")
                            .product(product)
                            .build();
                    images.add(image);
                }
            }
            // Nếu list chưa khởi tạo (dù trong Entity thường đã new ArrayList)
            if (product.getImages() == null) {
                product.setImages(images);
            } else {
                product.getImages().addAll(images);
            }
        }

        if (request.getBrandId() != null) {
            Brand brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new RuntimeException("Brand not found"));
            product.setBrand(brand);
        }

        if (request.getUsagePurposeId() != null) {
            UsagePurpose usagePurpose = usagePurposeRepository.findById(request.getUsagePurposeId())
                    .orElseThrow(() -> new RuntimeException("UsagePurpose not found"));
            product.setUsagePurpose(usagePurpose);
        }

        if (request.getScreenSizeId() != null) {
            ScreenSize screenSize = screenSizeRepository.findById(request.getScreenSizeId())
                    .orElseThrow(() -> new RuntimeException("ScreenSize not found"));
            product.setScreenSize(screenSize);
        }

        return productRepository.save(product);
    }

    @Override
    @Transactional
    public Product updateProduct(Long id, UpdateProductRequest request) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product không tồn tại"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setSlug(SlugUtil.toSlug(request.getName()));

        // ✅ Thêm: Cập nhật thông số kỹ thuật
        product.setSpecifications(request.getSpecifications());

        // 👇 LOGIC UPDATE ẢNH (Xóa cũ thêm mới)
        if (request.getImageUrls() != null) {
            // Xóa hết ảnh cũ
            if (product.getImages() != null) {
                product.getImages().clear();
            } else {
                product.setImages(new ArrayList<>());
            }

            // Thêm danh sách ảnh mới
            for (String url : request.getImageUrls()) {
                if (url != null && !url.trim().isEmpty()) {
                    ImageProduct image = ImageProduct.builder()
                            .urlImage(url.trim())
                            .name("Ảnh cập nhật")
                            .product(product)
                            .build();
                    product.getImages().add(image);
                }
            }
        }

        if (request.getBrandId() != null) {
            Brand brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new RuntimeException("Brand không tồn tại"));
            product.setBrand(brand);
        }

        if (request.getUsagePurposeId() != null) {
            UsagePurpose usagePurpose = usagePurposeRepository.findById(request.getUsagePurposeId())
                    .orElseThrow(() -> new RuntimeException("UsagePurpose không tồn tại"));
            product.setUsagePurpose(usagePurpose);
        }

        if (request.getScreenSizeId() != null) {
            ScreenSize screenSize = screenSizeRepository.findById(request.getScreenSizeId())
                    .orElseThrow(() -> new RuntimeException("ScreenSize không tồn tại"));
            product.setScreenSize(screenSize);
        }

        return productRepository.save(product);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product không tồn tại");
        }
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

    @Override
    public List<Product> getProductsByBrand(Long brandId) {
        // Gọi hàm vừa viết trong Repository
        return productRepository.findByBrandId(brandId);
    }
    @Override
    public List<Product> getProductsByUsagePurpose(Long usagePurposeId) {
        List<Product> products = productRepository.findByUsagePurposeId(usagePurposeId);
        // In ra màn hình console để kiểm tra
        System.out.println("Đang tìm ID nhu cầu: " + usagePurposeId);
        System.out.println("Số lượng tìm thấy: " + products.size());
        return products;
    }
    @Override
    public List<Product> filterProducts(Long usagePurposeId, Long brandId) {
        return productRepository.findByUsagePurposeIdAndBrandId(usagePurposeId, brandId);
    }
    @Override
    public List<Product> searchProducts(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            // Trả về tất cả sản phẩm nếu từ khóa trống
            return productRepository.findAll();
        }

        // BƯỚC MỚI: Loại bỏ dấu khỏi từ khóa người dùng nhập vào
        // Ví dụ: Người dùng nhập "dien thoai" -> chuyển thành "dien thoai"
        // Người dùng nhập "Điện thoại" -> chuyển thành "Dien thoai"
        String searchKeyword = SlugUtil.removeDiacritics(keyword.trim());

        // Để FULLTEXT Search hiệu quả và bao gồm tìm kiếm không dấu,
        // chúng ta sẽ cần thay thế khoảng trắng bằng ký tự wildcard của FULLTEXT (Dấu +)
        // và thêm chế độ * (Wildcard) cho mỗi từ.

        // Xây dựng cú pháp tìm kiếm BOOLEAN MODE của MySQL
        String fullTextSearchQuery = "+" + searchKeyword.replaceAll("\\s+", "* +") + "*";

        // Gọi phương thức FULL-TEXT SEARCH với từ khóa đã xử lý
        return productRepository.fullTextSearch(fullTextSearchQuery);
    }

    @Override
    public List<Product> advancedFilter(
            String keyword,
            List<Long> brandIds,
            Long purposeId,
            Long screenSizeId,
            Double minPrice,
            Double maxPrice,
            String sortBy
    ) {
        // Log để debug
        System.out.println("=== ADVANCED FILTER ===");
        System.out.println("Keyword: " + keyword);
        System.out.println("BrandIds: " + brandIds);
        System.out.println("PurposeId: " + purposeId);
        System.out.println("ScreenSizeId: " + screenSizeId);
        System.out.println("MinPrice: " + minPrice);
        System.out.println("MaxPrice: " + maxPrice);
        System.out.println("SortBy: " + sortBy);

        // Gọi repository để lấy dữ liệu
        List<Product> products = productRepository.advancedFilter(
                keyword,
                brandIds,
                purposeId,
                screenSizeId,
                minPrice,
                maxPrice
        );

        System.out.println("Số sản phẩm tìm được: " + products.size());

        // Sắp xếp nếu có
        if (sortBy != null && !sortBy.equals("default")) {
            switch (sortBy) {
                case "price_asc":
                    products.sort(Comparator.comparing(Product::getPrice));
                    break;
                case "price_desc":
                    products.sort(Comparator.comparing(Product::getPrice).reversed());
                    break;
                case "name_asc":
                    products.sort(Comparator.comparing(Product::getName));
                    break;
                case "name_desc":
                    products.sort(Comparator.comparing(Product::getName).reversed());
                    break;
            }
        }

        return products;
    }
}