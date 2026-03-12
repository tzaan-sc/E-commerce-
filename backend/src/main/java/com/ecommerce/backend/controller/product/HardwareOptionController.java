package com.ecommerce.backend.controller.product;

import com.ecommerce.backend.repository.product.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

//API để React lấy tất cả danh mục dropdown trong 1 lần gọi)

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

    @GetMapping("/all")
    public ResponseEntity<Map<String, Object>> getAllOptions() {
        return ResponseEntity.ok(Map.of(
                "rams", ramRepository.findAll(),
                "gpus", gpuRepository.findAll(),
                "chips", chipRepository.findAll(),
                "storages", storageRepository.findAll(),
                "colors", colorRepository.findAll()
        ));
    }
}