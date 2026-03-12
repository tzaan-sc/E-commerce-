package com.ecommerce.backend.service.auth;

import com.ecommerce.backend.entity.product.Review;
import com.ecommerce.backend.repository.product.ReviewRepository;
import com.ecommerce.backend.repository.product.OrderRepository;
import com.ecommerce.backend.entity.auth.User;
import com.ecommerce.backend.entity.product.Product;

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

        // kiểm tra user đã mua sản phẩm chưa
        boolean bought = orderRepository.hasPurchased(userId, productId);

        if (!bought) {
            throw new RuntimeException("Bạn phải mua sản phẩm mới được đánh giá");
        }

        // kiểm tra đã review chưa
        boolean reviewed = reviewRepository.existsByUserIdAndProductId(userId, productId);

        if (reviewed) {
            throw new RuntimeException("Bạn đã đánh giá sản phẩm này rồi");
        }

        Review review = new Review();

        User user = new User();
        user.setId(userId);

        Product product = new Product();
        product.setId(productId);

        review.setUser(user);
        review.setProduct(product);

        review.setStar(star);
        review.setComment(comment);
        review.setImage(image);
        review.setCreatedAt(LocalDateTime.now());
        review.setApproved(false);

        return reviewRepository.save(review);
    }

    // ⭐ Tính trung bình sao
    public Double getAverageStar(Long productId){
        return reviewRepository.getAverageStar(productId);
    }
}