package com.ecommerce.backend.controller.product;

import com.ecommerce.backend.entity.product.Review;
import com.ecommerce.backend.repository.product.ReviewRepository;
import com.ecommerce.backend.service.auth.ReviewService;
import com.ecommerce.backend.dto.auth.ReviewRequest;
import com.ecommerce.backend.entity.auth.User;
import com.ecommerce.backend.repository.auth.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Optional;

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

    @Autowired
    private UserRepository userRepository;

    // 🔥 LẤY USERNAME TỪ TOKEN
    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth.getPrincipal() instanceof UserDetails) {
            return ((UserDetails) auth.getPrincipal()).getUsername();
        }

        return auth.getName();
    }

    // 🔥 FIX LỖI: tìm user bằng username HOẶC email
    private User getCurrentUser() {
        String username = getCurrentUsername();

        System.out.println("USERNAME = " + username); // debug

        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(username);
        }

        return userOpt.orElseThrow(() ->
                new RuntimeException("Không tìm thấy user: " + username)
        );
    }

    // ⭐ USER: gửi đánh giá
    @PostMapping("/reviews")
    public ResponseEntity<?> createReview(@RequestBody ReviewRequest request) {

        User user = getCurrentUser();

        Review review = reviewService.createReview(
                user.getId(),
                request.getProductId(),
                request.getStar(),
                request.getComment(),
                request.getImage()
        );

        return ResponseEntity.ok(review);
    }

    // ⭐ ADMIN: duyệt đánh giá
    @PutMapping("/reviews/{id}/approve")
    public ResponseEntity<?> approveReview(@PathVariable Long id) {

        Review review = reviewRepository.findById(id).orElseThrow();

        review.setApproved(true);
        reviewRepository.save(review);

        return ResponseEntity.ok("Approved");
    }

    // ⭐ ADMIN: xóa review
    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        reviewRepository.deleteById(id);
        return ResponseEntity.ok("Deleted");
    }

    // ⭐ USER: lấy review đã duyệt
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

    // ⭐ USER: tính trung bình sao
    @GetMapping("/reviews/avg/{productId}")
    public Double getAvg(@PathVariable Long productId){
        return reviewService.getAverageStar(productId);
    }

    // ⭐ ADMIN: reply review
    @PutMapping("/reviews/{id}/reply")
    public ResponseEntity<?> replyReview(
            @PathVariable Long id,
            @RequestBody String replyContent
    ) {
        Review review = reviewRepository.findById(id).orElseThrow();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        boolean isAdmin = auth.getAuthorities()
                .stream()
                .anyMatch(a ->
                        a.getAuthority().equals("ADMIN") ||
                                a.getAuthority().equals("ROLE_ADMIN")
                );

        if (!isAdmin) {
            return ResponseEntity.status(403).body("Chỉ admin mới được trả lời");
        }

        review.setReply(replyContent);
        review.setRepliedAt(LocalDateTime.now());

        reviewRepository.save(review);

        return ResponseEntity.ok(review);
    }

    // ⭐ ADMIN: lấy review chưa duyệt
    @GetMapping("/reviews/unapproved")
    public List<Review> getUnapprovedReviews() {
        return reviewRepository.findByApprovedFalse();
    }

    @GetMapping("/reviews")
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }
    @PutMapping("/reviews/{id}/user-reply")
    public ResponseEntity<?> userReply(
            @PathVariable Long id,
            @RequestBody String content
    ) {
        Review review = reviewRepository.findById(id).orElseThrow();

        User user = getCurrentUser();

        // ❌ không phải chủ review
        if (!review.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Không phải review của bạn");
        }

        review.setUserReply(content);

        reviewRepository.save(review);

        return ResponseEntity.ok(review);
    }
}
