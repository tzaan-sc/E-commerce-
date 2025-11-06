package com.ecommerce.backend.service.product.impl;

import com.ecommerce.backend.entity.product.ScreenSize;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.exception.DuplicateResourceException;
import com.ecommerce.backend.dto.product.screensize.CreateScreenSizeRequest;
import com.ecommerce.backend.dto.product.screensize.UpdateScreenSizeRequest;
import com.ecommerce.backend.repository.product.ScreenSizeRepository;
import com.ecommerce.backend.service.product.ScreenSizeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

// Cần tạo ProductRepository và phương thức setScreenSizeToNullByScreenSizeId nếu muốn xóa an toàn
// import com.ecommerce.backend.repository.product.ProductRepository; 

@Service
@RequiredArgsConstructor
public class ScreenSizeServiceImpl implements ScreenSizeService {

    private final ScreenSizeRepository screenSizeRepository;
    // private final ProductRepository productRepository; // Nếu muốn xử lý khóa ngoại

    @Override
    @Transactional
    public ScreenSize createScreenSize(CreateScreenSizeRequest request) {
        // 1. Kiểm tra trùng lặp giá trị
        if (screenSizeRepository.existsByValue(request.getValue())) {
            throw new DuplicateResourceException("ScreenSize với kích thước '" + request.getValue() + "' đã tồn tại.");
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
        ScreenSize existingSize = screenSizeRepository.findById(request.getId())
                .orElseThrow(() -> new ResourceNotFoundException("ScreenSize", "id", request.getId()));

        // 2. Kiểm tra trùng lặp giá trị (chỉ khi giá trị thay đổi)
        if (!existingSize.getValue().equals(request.getValue()) && screenSizeRepository.existsByValue(request.getValue())) {
            throw new DuplicateResourceException("ScreenSize với kích thước '" + request.getValue() + "' đã tồn tại.");
        }

        // 3. Cập nhật thông tin
        existingSize.setValue(request.getValue());

        return screenSizeRepository.save(existingSize);
    }

    @Override
    @Transactional
    public void deleteScreenSize(Long sizeId) {
        // 1. Tìm ScreenSize theo ID
        ScreenSize screenSize = screenSizeRepository.findById(sizeId)
                .orElseThrow(() -> new ResourceNotFoundException("ScreenSize", "id", sizeId));

        // TODO: Xử lý quan hệ khóa ngoại (gán Product.screenSize về NULL)
        // Ví dụ: productRepository.setScreenSizeToNullByScreenSizeId(sizeId);

        // 2. Xóa ScreenSize
        screenSizeRepository.delete(screenSize);
    }

    @Override
    public List<ScreenSize> getAllScreenSizes() {
        return screenSizeRepository.findAll();
    }

    @Override
    public ScreenSize getScreenSizeById(Long sizeId) {
        return screenSizeRepository.findById(sizeId)
                .orElseThrow(() -> new ResourceNotFoundException("ScreenSize", "id", sizeId));
    }
}