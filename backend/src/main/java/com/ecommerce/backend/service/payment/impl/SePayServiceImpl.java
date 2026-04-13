package com.ecommerce.backend.service.payment.impl;

import com.ecommerce.backend.dto.payment.SePayWebhookRequest;
import com.ecommerce.backend.entity.product.Order;
import com.ecommerce.backend.repository.product.OrderRepository;
import com.ecommerce.backend.service.payment.SePayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class SePayServiceImpl implements SePayService {

    private final OrderRepository orderRepository;

    @Override
    @Transactional
    public boolean handleWebhook(SePayWebhookRequest request) {
        log.info("Received SePay Webhook: {}", request);

        // Chỉ quan tâm giao dịch "+ tiền" (còn tuỳ vào setup của SePay, đôi khi transferType = "in")
        if (request.getAmountIn() == null || request.getAmountIn() <= 0) {
            log.info("Webhook bị bỏ qua do amountIn <= 0");
            return true; // Trả về true để SePay hiểu là đã xử lý
        }

        String content = request.getTransactionContent();
        if (content == null || content.isEmpty()) {
            return true; 
        }

        // Tìm nội dung chứa "ORDER_xxx"
        Pattern pattern = Pattern.compile("ORDER_(\\d+)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(content);

        if (matcher.find()) {
            String orderIdStr = matcher.group(1);
            try {
                Long orderId = Long.parseLong(orderIdStr);

                Order order = orderRepository.findById(orderId).orElse(null);
                if (order == null) {
                    log.warn("Không tìm thấy đơn hàng ID: {}", orderId);
                    return true;
                }

                // Nếu đơn hàng đang PENDING thì mới xử lý
                if ("PENDING".equalsIgnoreCase(order.getStatus())) {
                    // Check xem số tiền nạp có lớn hơn hoặc bằng tổng tiền đơn hàng không
                    if (request.getAmountIn() >= order.getTotalAmount()) {
                        order.setStatus("CONFIRMED");
                        orderRepository.save(order);
                        log.info("Đã xác nhận tự động thành công đơn hàng: {}", orderId);
                    } else {
                        log.warn("Đơn hàng {} có số tiền thanh toán không đủ. Cần: {}, Nhận: {}", 
                                orderId, order.getTotalAmount(), request.getAmountIn());
                    }
                } else {
                    log.info("Đơn hàng {} đã ở trạng thái khác PENDING: {}", orderId, order.getStatus());
                }

            } catch (NumberFormatException e) {
                log.error("Lỗi parse Order ID: {}", orderIdStr);
            }
        } else {
            log.info("Không tìm thấy mã hoá đơn trong nội dung CK: {}", content);
        }

        return true;
    }
}
