package com.ecommerce.backend.service.product.impl;

import com.ecommerce.backend.dto.product.ProductVariantDTO;
import com.ecommerce.backend.entity.product.Product;
import com.ecommerce.backend.entity.product.ProductVariant;
import com.ecommerce.backend.repository.product.ProductRepository;
import com.ecommerce.backend.repository.product.ProductVariantRepository;
import com.ecommerce.backend.service.product.ProductVariantService;
import com.ecommerce.backend.util.SkuUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductVariantServiceImpl implements ProductVariantService {

    private final ProductVariantRepository variantRepo;
    private final ProductRepository productRepo;

    @Override
    public List<ProductVariantDTO> getAllVariants() {
        return variantRepo.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductVariantDTO> getVariantsByProduct(Long productId) {
        return variantRepo.findByProductId(productId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProductVariantDTO saveVariant(ProductVariantDTO dto) {
        ProductVariant variant;

        // --- 1. LOGIC TỰ ĐỘNG TẠO SKU (ĐÃ SỬA KHỚP VỚI SKUUTILS MỚI) ---
        if (dto.getSku() == null || dto.getSku().trim().isEmpty()) {
            String prodName = "";
            if (dto.getProductName() != null && !dto.getProductName().isEmpty()) {
                prodName = dto.getProductName();
            } else if (dto.getProductId() != null) {
                Product p = productRepo.findById(dto.getProductId()).orElse(null);
                if (p != null) prodName = p.getName();
            }

            // 👇 TRUYỀN ĐỦ 4 THAM SỐ THEO ĐÚNG LOGIC MỚI CỦA SKUUTILS
            String autoSku = SkuUtils.generateSku(
                    prodName,
                    dto.getRamCapacity(),
                    dto.getStorageCapacity(),
                    dto.getColor()
            );

            String finalSku = autoSku;
            int count = 1;
            while (variantRepo.existsBySku(finalSku)) {
                finalSku = autoSku + "-V" + count;
                count++;
            }
            dto.setSku(finalSku);
        }

        // --- 2. VALIDATE SKU ---
        if (dto.getId() == null && variantRepo.existsBySku(dto.getSku())) {
            throw new RuntimeException("Mã SKU '" + dto.getSku() + "' đã tồn tại!");
        }

        if (dto.getId() != null) {
            variant = variantRepo.findById(dto.getId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy biến thể ID: " + dto.getId()));

            if (!variant.getSku().equals(dto.getSku()) && variantRepo.existsBySku(dto.getSku())) {
                throw new RuntimeException("Mã SKU '" + dto.getSku() + "' đã thuộc về sản phẩm khác!");
            }
        } else {
            // --- 3. TẠO MỚI ---
            variant = new ProductVariant();
            Product product = productRepo.findById(dto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm gốc ID: " + dto.getProductId()));
            variant.setProduct(product);
            variant.setStockQuantity(0);
        }

        // --- 4. MAP DỮ LIỆU TỪ DTO SANG ENTITY ---
        variant.setSku(dto.getSku());
        variant.setPrice(dto.getPrice());
        variant.setImportPrice(dto.getImportPrice());
        variant.setImage(dto.getImage());

        variant.setRamCapacity(dto.getRamCapacity());
        variant.setStorageCapacity(dto.getStorageCapacity());
        variant.setColor(dto.getColor());

        ProductVariant savedVariant = variantRepo.save(variant);
        return convertToDTO(savedVariant);
    }

    @Override
    @Transactional
    public void deleteVariant(Long id) {
        if (!variantRepo.existsById(id)) {
            throw new RuntimeException("Biến thể không tồn tại!");
        }
        variantRepo.deleteById(id);
    }

    private ProductVariantDTO convertToDTO(ProductVariant entity) {
        ProductVariantDTO dto = new ProductVariantDTO();
        dto.setId(entity.getId());
        dto.setSku(entity.getSku());
        dto.setPrice(entity.getPrice());
        dto.setImportPrice(entity.getImportPrice());
        dto.setStockQuantity(entity.getStockQuantity());
        dto.setImage(entity.getImage());

        dto.setRamCapacity(entity.getRamCapacity());
        dto.setStorageCapacity(entity.getStorageCapacity());
        dto.setColor(entity.getColor());

        if (entity.getProduct() != null) {
            dto.setProductId(entity.getProduct().getId());
            dto.setProductName(entity.getProduct().getName());
        }
        return dto;
    }
}