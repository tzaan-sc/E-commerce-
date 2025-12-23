package com.ecommerce.backend.controller.product;

import com.ecommerce.backend.entity.product.ScreenSize;
import com.ecommerce.backend.dto.product.screensize.CreateScreenSizeRequest;
import com.ecommerce.backend.dto.product.screensize.UpdateScreenSizeRequest;
import com.ecommerce.backend.service.product.ScreenSizeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/screen-sizes")
@RequiredArgsConstructor
public class ScreenSizeController {

    private final ScreenSizeService screenSizeService;

    // POST: /api/screen-sizes
    @PostMapping
    public ResponseEntity<ScreenSize> createScreenSize(@Valid @RequestBody CreateScreenSizeRequest request) {
        ScreenSize newScreenSize = screenSizeService.createScreenSize(request);
        return new ResponseEntity<>(newScreenSize, HttpStatus.CREATED);
    }

    // ✅ FIX: Sửa lại cấu trúc PUT
    // PUT: /api/screen-sizes/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ScreenSize> updateScreenSize(
            @PathVariable Long id, // 👈 Lấy ID từ URL
            @Valid @RequestBody UpdateScreenSizeRequest request) {

        // 💡 FIX: Gán ID từ Path Variable vào DTO để thỏa mãn @NotNull id validation
        request.setId(id);

        ScreenSize updatedScreenSize = screenSizeService.updateScreenSize(request);
        return ResponseEntity.ok(updatedScreenSize);
    }

    // DELETE: /api/screen-sizes/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScreenSize(@PathVariable Long id) {
        screenSizeService.deleteScreenSize(id);
        return ResponseEntity.noContent().build(); // Đồng bộ với RESTful deletion
    }

    // GET: /api/screen-sizes
    @GetMapping
    public ResponseEntity<List<ScreenSize>> getAllScreenSizes() {
        List<ScreenSize> screenSizes = screenSizeService.getAllScreenSizes();
        return ResponseEntity.ok(screenSizes);
    }

    // GET: /api/screen-sizes/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ScreenSize> getScreenSizeById(@PathVariable Long id) {
        ScreenSize screenSize = screenSizeService.getScreenSizeById(id);
        return ResponseEntity.ok(screenSize);
    }
}