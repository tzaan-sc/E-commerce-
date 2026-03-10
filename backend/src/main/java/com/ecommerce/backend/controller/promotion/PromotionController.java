package com.ecommerce.backend.controller.promotion;

import com.ecommerce.backend.dto.promotion.PromotionDTO;
import com.ecommerce.backend.service.promotion.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promotions")
@CrossOrigin(origins = "*") // Hoặc cấu hình CORS ở config chung
public class PromotionController {

    @Autowired
    private PromotionService promotionService;

    // GET: /api/promotions
    @GetMapping
    public ResponseEntity<List<PromotionDTO>> getAllPromotions() {
        return ResponseEntity.ok(promotionService.getAllPromotions());
    }

    // POST: /api/promotions
    @PostMapping
    public ResponseEntity<PromotionDTO> createPromotion(@RequestBody PromotionDTO promotionDTO) {
        return ResponseEntity.ok(promotionService.createPromotion(promotionDTO));
    }

    // PUT: /api/promotions/{id}
    @PutMapping("/{id}")
    public ResponseEntity<PromotionDTO> updatePromotion(@PathVariable Long id, @RequestBody PromotionDTO promotionDTO) {
        return ResponseEntity.ok(promotionService.updatePromotion(id, promotionDTO));
    }

    // DELETE: /api/promotions/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePromotion(@PathVariable Long id) {
        promotionService.deletePromotion(id);
        return ResponseEntity.ok().build();
    }

    // PATCH: /api/promotions/{id}/activate
    @PatchMapping("/{id}/activate")
    public ResponseEntity<Void> activatePromotion(@PathVariable Long id) {
        promotionService.toggleStatus(id, true);
        return ResponseEntity.ok().build();
    }

    // PATCH: /api/promotions/{id}/deactivate
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivatePromotion(@PathVariable Long id) {
        promotionService.toggleStatus(id, false);
        return ResponseEntity.ok().build();
    }
}
