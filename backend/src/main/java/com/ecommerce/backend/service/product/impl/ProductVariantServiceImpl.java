package com.ecommerce.backend.service.product.impl;

import com.ecommerce.backend.dto.product.ProductVariantDTO;
import com.ecommerce.backend.entity.product.*;
import com.ecommerce.backend.entity.product.variant.VariantImage;
import com.ecommerce.backend.repository.product.*;
import com.ecommerce.backend.service.product.ProductVariantService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductVariantServiceImpl implements ProductVariantService {

    private final ProductVariantRepository variantRepository;
    private final ProductRepository productRepository;
    private final RamRepository ramRepository;
    private final GpuRepository gpuRepository;
    private final ChipRepository chipRepository;
    private final StorageRepository storageRepository;
    private final ColorRepository colorRepository;

    @Override
    public List<ProductVariantDTO> getAllVariants() {
        return variantRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<ProductVariantDTO> getVariantsByProduct(Long productId) {
        return variantRepository.findByProductId(productId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProductVariantDTO saveVariant(ProductVariantDTO dto) {
        ProductVariant variant;
        if (dto.getId() == null) {
            if (variantRepository.existsBySku(dto.getSku())) throw new RuntimeException("Mã SKU đã tồn tại!");
            variant = new ProductVariant();
        } else {
            variant = variantRepository.findById(dto.getId()).orElseThrow(() -> new RuntimeException("Lỗi ID"));
            if (variantRepository.existsBySkuAndIdNot(dto.getSku(), dto.getId())) throw new RuntimeException("Mã SKU bị trùng!");

            // Nếu là cập nhật, xóa danh sách ảnh cũ để ghi đè ảnh mới
            variant.getImages().clear();
        }

        variant.setSku(dto.getSku());
        variant.setPrice(dto.getPrice());
        variant.setStockQuantity(dto.getStockQuantity());
        variant.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);

        // Set các linh kiện
        if (dto.getProductId() != null) variant.setProduct(productRepository.findById(dto.getProductId()).orElse(null));
        if (dto.getRamId() != null) variant.setRam(ramRepository.findById(dto.getRamId()).orElse(null));
        if (dto.getGpuId() != null) variant.setGpu(gpuRepository.findById(dto.getGpuId()).orElse(null));
        if (dto.getChipId() != null) variant.setChip(chipRepository.findById(dto.getChipId()).orElse(null));
        if (dto.getStorageId() != null) variant.setStorage(storageRepository.findById(dto.getStorageId()).orElse(null));
        if (dto.getColorId() != null) variant.setColor(colorRepository.findById(dto.getColorId()).orElse(null));

        // ✅ ĐOẠN CODE CẦN BỔ SUNG ĐỂ LƯU ẢNH:
        if (dto.getImageUrls() != null && !dto.getImageUrls().isEmpty()) {
            for (String url : dto.getImageUrls()) {
                if (url != null && !url.trim().isEmpty()) {
                    VariantImage vImg = new VariantImage();
                    vImg.setImageUrl(url.trim());
                    vImg.setProductVariant(variant); // Gán cha cho con
                    variant.getImages().add(vImg);   // Thêm vào list của variant
                }
            }
        }

        ProductVariant saved = variantRepository.save(variant);
        return mapToDTO(saved);
    }

    @Override
    @Transactional
    public void deleteVariant(Long id) {
        variantRepository.deleteById(id);
    }

    private ProductVariantDTO mapToDTO(ProductVariant entity) {
        ProductVariantDTO dto = new ProductVariantDTO();
        // 1. Thông tin cơ bản
        dto.setId(entity.getId());
        dto.setSku(entity.getSku());
        dto.setPrice(entity.getPrice());
        dto.setStockQuantity(entity.getStockQuantity());
        dto.setIsActive(entity.getIsActive());

        // 2. ✅ LẤY ẢNH (Từ bảng VariantImage)
        if (entity.getImages() != null && !entity.getImages().isEmpty()) {
            dto.setImageUrls(entity.getImages().stream()
                    .map(VariantImage::getImageUrl)
                    .collect(Collectors.toList()));
        }

        // 3. ✅ GÁN TÊN LINH KIỆN (Để React hiển thị được chữ)
        if (entity.getRam() != null) {
            dto.setRamId(entity.getRam().getId());
            dto.setRamSize(entity.getRam().getRamSize()); // Gán chữ "8" hoặc "16"
        }

        if (entity.getChip() != null) {
            dto.setChipId(entity.getChip().getId());
            dto.setChipName(entity.getChip().getCpuName()); // Gán chữ "Core i5..."
        }

        if (entity.getGpu() != null) {
            dto.setGpuId(entity.getGpu().getId());
            dto.setGpuName(entity.getGpu().getGpuName()); // Gán chữ "RTX 4050"
        }

        if (entity.getStorage() != null) {
            dto.setStorageId(entity.getStorage().getId());
            // Kết hợp dung lượng và loại ổ cứng
            dto.setStorageDisplay(entity.getStorage().getCapacity() + " " + entity.getStorage().getStorageType());
        }

        if (entity.getColor() != null) {
            dto.setColorId(entity.getColor().getId());
            dto.setColorName(entity.getColor().getColorName());
        }

        return dto;
    }
}