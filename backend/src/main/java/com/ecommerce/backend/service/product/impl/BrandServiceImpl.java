package com.ecommerce.backend.service.product.impl;

import com.ecommerce.backend.entity.product.Brand;
import com.ecommerce.backend.exception.DuplicateResourceException; // Cần tạo lớp exception này
import com.ecommerce.backend.dto.product.brand.CreateBrandRequest;
import com.ecommerce.backend.dto.product.brand.UpdateBrandRequest;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.repository.product.BrandRepository;
import com.ecommerce.backend.service.product.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ecommerce.backend.repository.product.ProductRepository;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;
    private final ProductRepository productRepository;

    /**
     * Thêm mới một thương hiệu.
     * Kiểm tra tên thương hiệu đã tồn tại chưa.
     */
    @Override
    @Transactional
    public Brand createBrand(CreateBrandRequest request) {
        // 1. Kiểm tra trùng lặp tên
        if (brandRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Brand với tên '" + request.getName() + "' đã tồn tại.");
        }

        // 2. Chuyển đổi DTO sang Entity và lưu
        Brand brand = Brand.builder()
                .name(request.getName())
                .logoUrl(request.getLogoUrl())
                .build();

        return brandRepository.save(brand);
    }

    /**
     * Cập nhật thông tin của một thương hiệu.
     * Kiểm tra thương hiệu có tồn tại không.
     * Kiểm tra tên thương hiệu mới có trùng lặp với thương hiệu khác không.
     */
    @Override
    @Transactional
    public Brand updateBrand(UpdateBrandRequest request) {
        // 1. Tìm Brand theo ID
        Brand existingBrand = brandRepository.findById(request.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Brand", "id", request.getId()));

        // 2. Kiểm tra trùng lặp tên (chỉ khi tên thay đổi)
        if (!existingBrand.getName().equalsIgnoreCase(request.getName()) && brandRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Brand với tên '" + request.getName() + "' đã tồn tại.");
        }

        // 3. Cập nhật thông tin
        existingBrand.setName(request.getName());
        existingBrand.setLogoUrl(request.getLogoUrl());

        return brandRepository.save(existingBrand);
    }

    /**
     * Xóa một thương hiệu theo ID.
     * Kiểm tra thương hiệu có tồn tại không.
     * Lưu ý: Cần xử lý ràng buộc khóa ngoại (ví dụ: gán các Product của Brand này về NULL hoặc xóa chúng)
     * trước khi xóa Brand nếu không Spring/Database sẽ báo lỗi.
     */
    @Override
    @Transactional
    public void deleteBrand(Long brandId) {
        // 1. Tìm Brand theo ID
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new ResourceNotFoundException("Brand", "id", brandId));

        // 2. Xử lý khóa ngoại: Gán Brand_ID của tất cả Product liên quan về NULL
        productRepository.setBrandToNullByBrandId(brandId); // 👈 Thêm dòng này

        // 3. Xóa Brand
        brandRepository.delete(brand);
    }

    // Các phương thức khác (ví dụ: lấy tất cả)
    @Override
    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    @Override
    public Brand getBrandById(Long brandId) {
        return brandRepository.findById(brandId)
                .orElseThrow(() -> new ResourceNotFoundException("Brand", "id", brandId));
    }
}