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
@RequestMapping("/api/screensizes") // Endpoint: /api/screensizes
@RequiredArgsConstructor
public class ScreenSizeController {

    private final ScreenSizeService screenSizeService;

    // POST: /api/screensizes
    @PostMapping
    public ResponseEntity<ScreenSize> createScreenSize(@Valid @RequestBody CreateScreenSizeRequest request) {
        ScreenSize newSize = screenSizeService.createScreenSize(request);
        return new ResponseEntity<>(newSize, HttpStatus.CREATED); // 201 Created
    }

    // PUT: /api/screensizes
    @PutMapping
    public ResponseEntity<ScreenSize> updateScreenSize(@Valid @RequestBody UpdateScreenSizeRequest request) {
        ScreenSize updatedSize = screenSizeService.updateScreenSize(request);
        return ResponseEntity.ok(updatedSize); // 200 OK
    }

    // DELETE: /api/screensizes/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteScreenSize(@PathVariable Long id) {
        screenSizeService.deleteScreenSize(id);
        return ResponseEntity.ok("ScreenSize với ID=" + id + " đã được xóa thành công."); // 200 OK
    }

    // GET: /api/screensizes
    @GetMapping
    public ResponseEntity<List<ScreenSize>> getAllScreenSizes() {
        List<ScreenSize> sizes = screenSizeService.getAllScreenSizes();
        return ResponseEntity.ok(sizes);
    }

    // GET: /api/screensizes/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ScreenSize> getScreenSizeById(@PathVariable Long id) {
        ScreenSize size = screenSizeService.getScreenSizeById(id);
        return ResponseEntity.ok(size);
    }
}