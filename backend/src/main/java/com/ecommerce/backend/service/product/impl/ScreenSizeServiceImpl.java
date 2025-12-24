package com.ecommerce.backend.service.product.impl;

import com.ecommerce.backend.dto.product.screensize.CreateScreenSizeRequest;
import com.ecommerce.backend.dto.product.screensize.UpdateScreenSizeRequest;
import com.ecommerce.backend.entity.product.ScreenSize;
import com.ecommerce.backend.exception.DuplicateResourceException;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.repository.product.ProductRepository;
import com.ecommerce.backend.repository.product.ScreenSizeRepository;
import com.ecommerce.backend.service.product.ScreenSizeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ScreenSizeServiceImpl implements ScreenSizeService {

    private final ScreenSizeRepository screenSizeRepository;
    private final ProductRepository productRepository; // Để xử lý khóa ngoại

    @Override
    @Transactional
    public ScreenSize createScreenSize(CreateScreenSizeRequest request) {
        // 1. Kiểm tra trùng lặp giá trị
        if (screenSizeRepository.existsByValue(request.getValue())) {
            throw new DuplicateResourceException("ScreenSize với giá trị '" + request.getValue() + "' đã tồn tại.");
        }

        // 2. Chuyển đổi DTO sang Entity và lưu
        ScreenSize screenSize = ScreenSize.builder()
                .value(request.getValue())
                .build();

        return screenSizeRepository.save(screenSize);
    }

    @Override
    @Transactional
    public ScreenSize updateScreenSize(UpdateScreenSizeRequest request) {
        // 1. Tìm ScreenSize theo ID
        ScreenSize existingScreenSize = screenSizeRepository.findById(request.getId())
                .orElseThrow(() -> new ResourceNotFoundException("ScreenSize", "id", request.getId()));

        // 2. Kiểm tra trùng lặp giá trị (chỉ khi giá trị thay đổi)
        if (!existingScreenSize.getValue().equals(request.getValue()) && screenSizeRepository.existsByValue(request.getValue())) {
            throw new DuplicateResourceException("ScreenSize với giá trị '" + request.getValue() + "' đã tồn tại.");
        }

        // 3. Cập nhật thông tin
        existingScreenSize.setValue(request.getValue());

        return screenSizeRepository.save(existingScreenSize);
    }

    @Override
    @Transactional
    public void deleteScreenSize(Long screenSizeId) {
        // 1. Tìm ScreenSize theo ID
        ScreenSize screenSize = screenSizeRepository.findById(screenSizeId)
                .orElseThrow(() -> new ResourceNotFoundException("ScreenSize", "id", screenSizeId));

        // 2. KIỂM TRA RÀNG BUỘC
        long productCount = productRepository.countByScreenSizeId(screenSizeId);
        if (productCount > 0) {
            throw new RuntimeException("Không thể xóa kích thước '" + screenSize.getValue() + " inch' vì đang có " + productCount + " sản phẩm liên quan.");
        }
        // 3. Xóa ScreenSize
        screenSizeRepository.delete(screenSize);
    }

    @Override
    public List<ScreenSize> getAllScreenSizes() {
        List<ScreenSize> sizes = screenSizeRepository.findAll();

        // 👇 DUYỆT VÀ ĐẾM
        for (ScreenSize s : sizes) {
            long count = productRepository.countByScreenSizeId(s.getId());
            s.setProductCount(count);
        }

        return sizes;
    }
    @Override
    public ScreenSize getScreenSizeById(Long screenSizeId) {
        return screenSizeRepository.findById(screenSizeId)
                .orElseThrow(() -> new ResourceNotFoundException("ScreenSize", "id", screenSizeId));
    }
}