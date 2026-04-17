package com.ecommerce.backend.controller.product;

import com.ecommerce.backend.repository.product.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/hardware-options")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class HardwareOptionController {

    private final RamRepository ramRepository;
    private final GpuRepository gpuRepository;
    private final ChipRepository chipRepository;
    private final StorageRepository storageRepository;
    private final ColorRepository colorRepository;

    // ✅ BỔ SUNG THÊM 3 REPOSITORY CÒN THIẾU
    private final BrandRepository brandRepository;
    private final UsagePurposeRepository usagePurposeRepository;
    private final ScreenSizeRepository screenSizeRepository;

    @GetMapping("/all")
    public ResponseEntity<Map<String, Object>> getAllOptions() {
        return ResponseEntity.ok(Map.of(
                // --- 5 cái cũ của bạn ---
                "rams", ramRepository.findAll(),
                "gpus", gpuRepository.findAll(),
                "chips", chipRepository.findAll(),
                "storages", storageRepository.findAll(),
                "colors", colorRepository.findAll(),

                // --- ✅ THÊM 3 CÁI MỚI NÀY ĐỂ FRONT-END NHẬN ĐƯỢC ---
                "brands", brandRepository.findAll(),
                "purposes", usagePurposeRepository.findAll(),
                "screenSizes", screenSizeRepository.findAll()
        ));
    }
}