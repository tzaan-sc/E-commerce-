package com.ecommerce.backend.service.payment;

import com.ecommerce.backend.dto.payment.PaymentResponse;
import com.ecommerce.backend.entity.product.Order;
import com.ecommerce.backend.entity.product.PaymentStatus;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.repository.product.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private static final Set<String> TERMINAL_STATUSES =
            Set.of("PAID", "FAILED", "CONFIRMED", "COMPLETED", "CANCELLED");

    private final OrderRepository    orderRepository;
    private final VietQRService      vietQRService;
    private final GoogleSheetService googleSheetService;

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentInfo(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        String qrUrl       = vietQRService.generateQRCodeUrl(order.getId(), order.getTotalAmount());
        String bankContent = "ORDER_" + order.getId();

        try {
            googleSheetService.appendOrder(order);
        } catch (IOException e) {
            log.warn("Không thể ghi Google Sheet cho đơn {}: {}", orderId, e.getMessage());
        }

        return PaymentResponse.builder()
                .orderId(order.getId())
                .amount(order.getTotalAmount())
                .qrUrl(qrUrl)
                .bankContent(bankContent)
                .status(order.getStatus())
                .build();
    }

    // 👇 Sửa: trả về Map chứa cả orderStatus lẫn paymentStatus
    @Transactional(readOnly = true)
    public Map<String, String> checkPaymentStatus(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        return Map.of(
            "status",        order.getStatus() != null
                                ? order.getStatus()
                                : "PENDING",
            "paymentStatus", order.getPaymentStatus() != null
                                ? order.getPaymentStatus().name()
                                : "UNPAID"
        );
    }

    @Transactional
    public void processWebhook(Long orderId, String reportedStatus) {
        log.info("Webhook nhận được — Đơn hàng ID: {}, Trạng thái báo cáo: {}", orderId, reportedStatus);

        Order order = orderRepository.findByIdWithLock(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        String currentStatus    = order.getStatus() != null ? order.getStatus().toUpperCase() : "";
        String normalizedStatus = reportedStatus.toUpperCase();

        // Guard: bỏ qua nếu đơn đã ở trạng thái cuối — trừ khi là PAID (tiền về trễ)
        if (!"PAID".equals(normalizedStatus) && TERMINAL_STATUSES.contains(currentStatus)) {
            log.warn("Bỏ qua Webhook: Đơn {} đã ở trạng thái cuối '{}', không thể xử lý webhook '{}'",
                    orderId, currentStatus, reportedStatus);
            return;
        }

        if ("PAID".equals(normalizedStatus)) {
            order.setPaymentStatus(PaymentStatus.PAID);

            if ("CANCELLED".equals(currentStatus)) {
                // Tiền về nhưng đơn đã hủy → cảnh báo admin đối soát hoàn tiền
                log.warn("💥 CẢNH BÁO: Đơn hàng {} đã HỦY nhưng khách vừa chuyển khoản! Cần admin đối soát hoàn tiền.", orderId);

            } else if ("CONFIRMED".equals(currentStatus) && "COD".equals(order.getPaymentMethod())) {
                // Khách đã đổi sang COD nhưng tiền vẫn về → đổi lại paymentMethod
                log.info("Đơn hàng {} đã đổi sang COD nhưng tiền vừa về, cập nhật lại paymentMethod.", orderId);
                order.setPaymentMethod("VIETQR");

            } else {
                // Luồng bình thường: PENDING → CONFIRMED
                order.setStatus("CONFIRMED");
            }
            log.info("Đơn hàng {} đã được thanh toán, cập nhật paymentStatus thành PAID.", orderId);

        } else if ("FAILED".equals(normalizedStatus)) {
            if (!TERMINAL_STATUSES.contains(currentStatus)) {
                order.setStatus("CANCELLED");
                log.info("Đơn hàng {} thanh toán thất bại, cập nhật trạng thái đơn thành CANCELLED.", orderId);
            }

        } else {
            if (!TERMINAL_STATUSES.contains(currentStatus)) {
                order.setStatus(normalizedStatus);
                log.info("Đơn hàng {} đã được cập nhật sang trạng thái: {}", orderId, normalizedStatus);
            }
        }

        orderRepository.save(order);
    }
}