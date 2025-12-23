package com.ecommerce.backend.controller.product;

import com.ecommerce.backend.entity.product.UsagePurpose;
import com.ecommerce.backend.dto.product.usagepurpose.CreateUsagePurposeRequest;
import com.ecommerce.backend.dto.product.usagepurpose.UpdateUsagePurposeRequest;
import com.ecommerce.backend.service.product.UsagePurposeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usage-purposes")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class UsagePurposeController {

    private final UsagePurposeService usagePurposeService;

    @PostMapping
    public ResponseEntity<UsagePurpose> createUsagePurpose(
            @Valid @RequestBody CreateUsagePurposeRequest request) {
        // Trả về 201 Created
        return new ResponseEntity<>(usagePurposeService.createUsagePurpose(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsagePurpose> updateUsagePurpose(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUsagePurposeRequest request) {
        // Gọi Service với ID từ Path và Body DTO
        return ResponseEntity.ok(usagePurposeService.updateUsagePurpose(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsagePurpose(@PathVariable Long id) {
        usagePurposeService.deleteUsagePurpose(id);
        // Trả về 204 No Content, đồng bộ với RESTful deletion
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<UsagePurpose>> getAllUsagePurposes() {
        return ResponseEntity.ok(usagePurposeService.getAllUsagePurposes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsagePurpose> getUsagePurposeById(@PathVariable Long id) {
        return ResponseEntity.ok(usagePurposeService.getUsagePurposeById(id));
    }
}