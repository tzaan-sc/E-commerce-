package com.ecommerce.backend.service.auth;

import com.ecommerce.backend.entity.product.Review;
import com.ecommerce.backend.repository.product.ReviewRepository;
import com.ecommerce.backend.repository.product.OrderRepository;
import com.ecommerce.backend.entity.auth.User;
import com.ecommerce.backend.entity.product.Product;
import com.ecommerce.backend.entity.product.Order;
import com.ecommerce.backend.entity.product.OrderItem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private OrderRepository orderRepository;

    // ✅ Tạo đánh giá
    public Review createReview(Long userId, Long productId, int star, String comment, String image) {

        System.out.println("=== CREATE REVIEW ===");
        System.out.println("userId: " + userId);
        System.out.println("productId: " + productId);

        // ✅ Lấy danh sách đơn hàng của user
        List<Order> orders = orderRepository.findByUserId(userId);

        boolean hasPurchased = false;

        for (Order order : orders) {

            String status = order.getStatus();

            // ✅ CHẤP NHẬN COMPLETED (theo hệ thống của bạn)
            if (status == null ||
                    !(status.equalsIgnoreCase("COMPLETED") || status.equalsIgnoreCase("DELIVERED"))) {
                continue;
            }

            for (OrderItem item : order.getOrderItems()) {

                // ⚠️ tránh null product
                if (item.getProduct() != null &&
                        item.getProduct().getId().equals(productId)) {

                    hasPurchased = true;
                    break;
                }
            }

            if (hasPurchased) break;
        }

        System.out.println("hasPurchased: " + hasPurchased);

        // ❌ chưa mua → không cho đánh giá
        if (!hasPurchased) {
            throw new RuntimeException("Bạn phải mua và nhận hàng mới được đánh giá");
        }

        // ❌ đã đánh giá rồi → chặn
        boolean reviewed = reviewRepository.existsByUserIdAndProductId(userId, productId);
        if (reviewed) {
            throw new RuntimeException("Bạn đã đánh giá sản phẩm này rồi");
        }

        // ❌ validate số sao
        if (star < 1 || star > 5) {
            throw new RuntimeException("Số sao phải từ 1 đến 5");
        }

        // ✅ tạo review
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

        // mặc định chưa duyệt
        review.setApproved(false);

        // chưa có phản hồi
        review.setReply(null);
        review.setRepliedAt(null);

        return reviewRepository.save(review);
    }

    // ✅ Lấy danh sách review đã duyệt theo product
    public List<Review> getApprovedReviewsByProduct(Long productId) {
        return reviewRepository.findByProductIdAndApprovedTrue(productId);
    }

    // ⭐ Tính trung bình sao
    public Double getAverageStar(Long productId){
        Double avg = reviewRepository.getAverageStar(productId);
        return avg != null ? avg : 0.0;
    }
}