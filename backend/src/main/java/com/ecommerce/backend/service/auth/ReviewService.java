package com.ecommerce.backend.service.auth;

import com.ecommerce.backend.entity.product.Review;
import com.ecommerce.backend.repository.product.ReviewRepository;
import com.ecommerce.backend.repository.product.OrderRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private OrderRepository orderRepository;

    public Review createReview(Long userId, Long productId, int star, String comment, String image) {

        boolean bought = orderRepository.hasPurchased(userId, productId);

        if (!bought) {
            throw new RuntimeException("User chưa mua sản phẩm này");
        }

        Review review = new Review();
        review.setStar(star);
        review.setComment(comment);
        review.setImage(image);
        review.setCreatedAt(LocalDateTime.now());

        return reviewRepository.save(review);
    }

    // ⭐ Tính trung bình sao
    public Double getAverageStar(Long productId){
        return reviewRepository.getAverageStar(productId);
    }
}