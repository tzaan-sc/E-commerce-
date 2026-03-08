package com.ecommerce.backend.controller.product;

import com.ecommerce.backend.entity.product.Review;
import com.ecommerce.backend.repository.product.ReviewRepository;
import com.ecommerce.backend.service.auth.ReviewService;
import com.ecommerce.backend.dto.auth.ReviewRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private ReviewRepository reviewRepository;


    // ⭐ gửi đánh giá
    @PostMapping("/reviews")
    public ResponseEntity<?> createReview(@RequestBody ReviewRequest request) {

        Review review = reviewService.createReview(
                request.getUserId(),
                request.getProductId(),
                request.getStar(),
                request.getComment(),
                request.getImage()
        );

        return ResponseEntity.ok(review);
    }


    // ⭐ admin duyệt đánh giá
    @PutMapping("/reviews/{id}/approve")
    public ResponseEntity<?> approveReview(@PathVariable Long id) {

        Review review = reviewRepository.findById(id).orElseThrow();

        review.setApproved(true);

        reviewRepository.save(review);

        return ResponseEntity.ok("Approved");
    }


    // ⭐ admin xóa review
    @DeleteMapping("/reviews/{id}")
    public void deleteReview(@PathVariable Long id) {
        reviewRepository.deleteById(id);
    }


    // ⭐ lấy review theo product
    @GetMapping("/reviews/product/{productId}")
    public List<Review> getReviews(
            @PathVariable Long productId,
            @RequestParam(required = false) Integer star
    ) {

        if (star != null) {
            return reviewRepository.findByProductIdAndStarAndApprovedTrue(productId, star);
        }

        return reviewRepository.findByProductIdAndApprovedTrue(productId);
    }


    // ⭐ tính trung bình sao
    @GetMapping("/reviews/avg/{productId}")
    public Double getAvg(@PathVariable Long productId){
        return reviewService.getAverageStar(productId);
    }
}