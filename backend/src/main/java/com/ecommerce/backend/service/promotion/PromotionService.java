package com.ecommerce.backend.service.promotion;

import com.ecommerce.backend.entity.promotion.Promotion;
// 👇 Nhớ import Enum vào
import com.ecommerce.backend.entity.promotion.PromotionStatus;
import com.ecommerce.backend.dto.promotion.PromotionDTO;
import com.ecommerce.backend.repository.promotion.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PromotionService {

    @Autowired
    private PromotionRepository promotionRepository;

    // Lấy tất cả danh sách
    public List<PromotionDTO> getAllPromotions() {
        return promotionRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Tạo mới
    public PromotionDTO createPromotion(PromotionDTO dto) {
        Promotion promotion = new Promotion();
        mapDtoToEntity(dto, promotion);

        // ✅ ĐÃ SỬA: Chuyển đổi String từ DTO sang Enum, dùng PromotionStatus.ACTIVE nếu null
        if (dto.getStatus() != null) {
            promotion.setStatus(PromotionStatus.valueOf(dto.getStatus()));
        } else {
            promotion.setStatus(PromotionStatus.ACTIVE);
        }

        promotion = promotionRepository.save(promotion);
        return convertToDTO(promotion);
    }

    // Cập nhật
    public PromotionDTO updatePromotion(Long id, PromotionDTO dto) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khuyến mãi id: " + id));

        mapDtoToEntity(dto, promotion);

        // ✅ ĐÃ SỬA: Chuyển đổi String sang Enum khi cập nhật
        if (dto.getStatus() != null && (dto.getStatus().equals("ACTIVE") || dto.getStatus().equals("INACTIVE"))) {
            promotion.setStatus(PromotionStatus.valueOf(dto.getStatus()));
        }

        promotion = promotionRepository.save(promotion);
        return convertToDTO(promotion);
    }

    // Xoá
    public void deletePromotion(Long id) {
        promotionRepository.deleteById(id);
    }

    // Bật / Tắt trạng thái
    public void toggleStatus(Long id, boolean isActivate) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khuyến mãi id: " + id));

        // ✅ ĐÃ SỬA: Gán trực tiếp giá trị của Enum thay vì chuỗi String
        promotion.setStatus(isActivate ? PromotionStatus.ACTIVE : PromotionStatus.INACTIVE);
        promotionRepository.save(promotion);
    }

    // --- Các hàm tiện ích (Helpers) ---

    private void mapDtoToEntity(PromotionDTO dto, Promotion entity) {
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setDiscountType(dto.getDiscountType());
        entity.setDiscountValue(dto.getDiscountValue());
        entity.setStartDate(dto.getStartDate());
        entity.setEndDate(dto.getEndDate());
    }

    private PromotionDTO convertToDTO(Promotion entity) {
        PromotionDTO dto = new PromotionDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setDiscountType(entity.getDiscountType());
        dto.setDiscountValue(entity.getDiscountValue());
        dto.setStartDate(entity.getStartDate());
        dto.setEndDate(entity.getEndDate());
        dto.setStatus(computeRealStatus(entity)); // Trả về trạng thái đã tính toán
        return dto;
    }

    // Tính toán trạng thái dựa vào thời gian thực
    private String computeRealStatus(Promotion promotion) {
        // ✅ ĐÃ SỬA: So sánh Enum thay vì so sánh chuỗi
        if (PromotionStatus.INACTIVE.equals(promotion.getStatus())) {
            return "INACTIVE";
        }

        LocalDateTime now = LocalDateTime.now();
        if (promotion.getEndDate() != null && now.isAfter(promotion.getEndDate())) {
            return "EXPIRED"; // Đã hết hạn
        }
        if (promotion.getStartDate() != null && now.isBefore(promotion.getStartDate())) {
            return "UPCOMING"; // Sắp diễn ra
        }
        return "ACTIVE"; // Đang diễn ra
    }
}