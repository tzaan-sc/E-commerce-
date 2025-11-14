package com.ecommerce.backend.service.product.impl;

import com.ecommerce.backend.entity.product.UsagePurpose;
import com.ecommerce.backend.dto.product.usagepurpose.CreateUsagePurposeRequest;
import com.ecommerce.backend.dto.product.usagepurpose.UpdateUsagePurposeRequest;
import com.ecommerce.backend.repository.product.UsagePurposeRepository;
// Thêm các dependency cần thiết:
import com.ecommerce.backend.repository.product.ProductRepository; // 👈 Cần import ProductRepository
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.exception.DuplicateResourceException;

import com.ecommerce.backend.service.product.UsagePurposeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // 👈 Cần thiết cho thao tác DELETE

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsagePurposeServiceImpl implements UsagePurposeService {

    private final UsagePurposeRepository usagePurposeRepository;
    // THÊM: Cần ProductRepository để xử lý khóa ngoại khi xóa
    private final ProductRepository productRepository;


    @Override
    @Transactional
    public UsagePurpose createUsagePurpose(CreateUsagePurposeRequest request) {
        // 1. KIỂM TRA TRÙNG LẶP TÊN (ĐỒNG BỘ VỚI BRAND/SCREEN SIZE)
        if (usagePurposeRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Nhu cầu sử dụng với tên '" + request.getName() + "' đã tồn tại.");
        }

        // 2. Tạo Entity và lưu
        UsagePurpose up = UsagePurpose.builder()
                .name(request.getName())
                .build();
        return usagePurposeRepository.save(up);
    }

    @Override
    @Transactional // Cần Transactional cho thao tác cập nhật
    public UsagePurpose updateUsagePurpose(Long id, UpdateUsagePurposeRequest request) {
        // 1. TÌM KIẾM THEO ID (Sử dụng ResourceNotFoundException đồng bộ)
        UsagePurpose existingPurpose = usagePurposeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("UsagePurpose", "id", id)
                );

        // 2. KIỂM TRA TRÙNG LẶP NẾU TÊN THAY ĐỔI
        if (!existingPurpose.getName().equalsIgnoreCase(request.getName()) && usagePurposeRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Nhu cầu sử dụng với tên '" + request.getName() + "' đã tồn tại.");
        }

        // 3. Cập nhật và lưu
        existingPurpose.setName(request.getName());
        return usagePurposeRepository.save(existingPurpose);
    }

    @Override
    @Transactional // Cần Transactional cho việc xóa và xử lý khóa ngoại
    public void deleteUsagePurpose(Long id) {
        // 1. TÌM KIẾM THEO ID (Sử dụng ResourceNotFoundException đồng bộ)
        UsagePurpose usagePurpose = usagePurposeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UsagePurpose", "id", id));

        // 2. XỬ LÝ KHÓA NGOẠI: Gán Product.usagePurpose về NULL
        productRepository.setUsagePurposeToNullByUsagePurposeId(id);

        // 3. Xóa
        usagePurposeRepository.delete(usagePurpose);
    }

    @Override
    public List<UsagePurpose> getAllUsagePurposes() {
        return usagePurposeRepository.findAll();
    }

    @Override
    public UsagePurpose getUsagePurposeById(Long id) {
        // Sử dụng ResourceNotFoundException đồng bộ
        return usagePurposeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UsagePurpose", "id", id));
    }
}