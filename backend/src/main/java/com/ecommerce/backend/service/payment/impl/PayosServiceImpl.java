package com.ecommerce.backend.service.payment.impl;

import com.ecommerce.backend.entity.auth.User;
import com.ecommerce.backend.entity.product.Order;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.repository.auth.UserRepository;
import com.ecommerce.backend.repository.product.OrderRepository;
import com.ecommerce.backend.service.payment.PayosService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.payos.PayOS;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkRequest;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkResponse;
import vn.payos.model.webhooks.Webhook;
import vn.payos.model.webhooks.WebhookData;

@Service
@RequiredArgsConstructor
@Slf4j
public class PayosServiceImpl implements PayosService {

    private final PayOS payOS;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Override
    public String createPaymentLink(String email, Long orderId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Bạn không có quyền chuyển hướng thanh toán đơn hàng này!");
        }

        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            throw new IllegalStateException("Đơn hàng này đã được xử lý, không thể tạo link thanh toán mới.");
        }

        try {
            // Chuẩn bị URL để redirect khách hàng sau khi thanh toán ở trang PayOS
            String domain = "http://localhost:3000"; // Thay bằng URL thực xài trên Hosting
            String cancelUrl = domain + "/payment/payos/cancel?orderId=" + orderId;
            String returnUrl = domain + "/payment/payos/success?orderId=" + orderId;

            // orderCode của PayOS là số nguyên <= 9007199254740991. Dùng orderId ép sang int hoặc giữ Long đều thỏa mãn.
            long orderCode = orderId; 

            // Cấu hình data giao dịch
            CreatePaymentLinkRequest paymentData = CreatePaymentLinkRequest.builder()
                    .orderCode(orderCode)
                    .amount(order.getTotalAmount().longValue()) // PayOS tính bằng VNĐ
                    .description("Thanh toan HD " + orderCode)
                    .returnUrl(returnUrl)
                    .cancelUrl(cancelUrl)
                    .build();

            CreatePaymentLinkResponse data = payOS.paymentRequests().create(paymentData);
            return data.getCheckoutUrl();

        } catch (Exception e) {
            log.error("Lỗi khởi tạo link thanh toán PayOS: ", e);
            throw new RuntimeException("Lỗi hệ thống khi tạo link thanh toán PayOS");
        }
    }

    @Override
    @Transactional
    public boolean handleWebhook(Webhook webhookBody) {
        try {
            // payOS.webhooks().verify sẽ ném Exception nếu signature (chữ ký) bị sai/giả mạo.
            WebhookData data = payOS.webhooks().verify(webhookBody);
            
            // Lấy ID đơn hàng từ orderCode
            Long orderId = (long) data.getOrderCode();
            log.info("Webhook hợp lệ cho Order Code: {}", orderId);

            Order order = orderRepository.findById(orderId).orElse(null);
            if (order == null) {
                log.warn("Không tìm thấy đơn hàng chứa mã: {}", orderId);
                return true; 
            }

            // PayOS Webhook thường gửi data.getCode() == "00" báo thành công 
            // Về cơ bản khi nhận data hợp lệ (nghĩa là tiền thực vô kho) ta mới xét
            if ("PENDING".equalsIgnoreCase(order.getStatus())) {
                order.setStatus("CONFIRMED");
                orderRepository.save(order);
                log.info("Cập nhật thành công đơn hàng {} qua PayOS Webhook", orderId);
            } else {
                log.info("Đơn hàng {} có trạng thái khác PENDING ({})", orderId, order.getStatus());
            }

            return true;
        } catch (Exception e) {
            log.error("Xác thực Webhook thất bại: ", e);
            // Có thể return false hoặc quăng exception tuỳ setup mong muốn
            return false;
        }
    }
}
