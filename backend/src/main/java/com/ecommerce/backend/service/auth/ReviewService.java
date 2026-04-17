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

    // ✅ Tạo đánh giá (FIX: mỗi orderItem chỉ review 1 lần)
    public Review createReview(Long userId, Long productId, int star, String comment, String image) {

        System.out.println("=== CREATE REVIEW ===");
        System.out.println("userId: " + userId);
        System.out.println("productId: " + productId);

        // ✅ Lấy danh sách đơn hàng của user
        List<Order> orders = orderRepository.findByUserId(userId);

        OrderItem targetItem = null;

        for (Order order : orders) {

            String status = order.getStatus();

            // ✅ chỉ cho review khi đã nhận hàng
            if (status == null ||
                    !(status.equalsIgnoreCase("COMPLETED") || status.equalsIgnoreCase("DELIVERED"))) {
                continue;
            }

            for (OrderItem item : order.getOrderItems()) {

                // tránh null product
                if (item.getProduct() != null &&
                        item.getProduct().getId().equals(productId)) {

                    // 🔥 check item này đã review chưa
                    boolean reviewed = reviewRepository.existsByOrderItemId(item.getId());

                    if (!reviewed) {
                        targetItem = item; // lấy item chưa review
                        break;
                    }
                }
            }

            if (targetItem != null) break;
        }

        // ❌ chưa mua hoặc đã review hết các lần mua
        if (targetItem == null) {
            throw new RuntimeException("Bạn đã đánh giá hết các lần mua sản phẩm này hoặc chưa mua");
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

        // 🔥 QUAN TRỌNG: gắn orderItem
        review.setOrderItem(targetItem);

        review.setStar(star);
        review.setComment(comment);
        review.setImage(image);
        review.setCreatedAt(LocalDateTime.now());

        review.setApproved(false);
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