package com.ecommerce.backend.service.product.impl;

import com.ecommerce.backend.dto.product.ProductVariantDTO;
import com.ecommerce.backend.entity.product.*;
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
        }

        variant.setSku(dto.getSku());
        variant.setPrice(dto.getPrice());
        variant.setStockQuantity(dto.getStockQuantity());
        variant.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);

        if (dto.getProductId() != null) variant.setProduct(productRepository.findById(dto.getProductId()).orElse(null));
        if (dto.getRamId() != null) variant.setRam(ramRepository.findById(dto.getRamId()).orElse(null));
        if (dto.getGpuId() != null) variant.setGpu(gpuRepository.findById(dto.getGpuId()).orElse(null));
        if (dto.getChipId() != null) variant.setChip(chipRepository.findById(dto.getChipId()).orElse(null));
        if (dto.getStorageId() != null) variant.setStorage(storageRepository.findById(dto.getStorageId()).orElse(null));
        if (dto.getColorId() != null) variant.setColor(colorRepository.findById(dto.getColorId()).orElse(null));

        return mapToDTO(variantRepository.save(variant));
    }

    @Override
    @Transactional
    public void deleteVariant(Long id) {
        variantRepository.deleteById(id);
    }

    private ProductVariantDTO mapToDTO(ProductVariant entity) {
        ProductVariantDTO dto = new ProductVariantDTO();
        dto.setId(entity.getId()); dto.setSku(entity.getSku()); dto.setPrice(entity.getPrice());
        dto.setStockQuantity(entity.getStockQuantity()); dto.setIsActive(entity.getIsActive());

        if (entity.getProduct() != null) { dto.setProductId(entity.getProduct().getId()); dto.setProductName(entity.getProduct().getName()); }
        if (entity.getRam() != null) { dto.setRamId(entity.getRam().getId()); dto.setRamSize(entity.getRam().getRamSize()); }
        if (entity.getGpu() != null) { dto.setGpuId(entity.getGpu().getId()); dto.setGpuName(entity.getGpu().getGpuName()); }
        if (entity.getChip() != null) { dto.setChipId(entity.getChip().getId()); dto.setChipName(entity.getChip().getCpuName()); }
        if (entity.getStorage() != null) { dto.setStorageId(entity.getStorage().getId()); dto.setStorageDisplay(entity.getStorage().getStorageDisplay()); }
        if (entity.getColor() != null) { dto.setColorId(entity.getColor().getId()); dto.setColorName(entity.getColor().getColorName()); }
        return dto;
    }
}