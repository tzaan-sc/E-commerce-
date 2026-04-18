package com.ecommerce.backend.service.payment;

import com.ecommerce.backend.dto.payment.PaymentResponse;
import com.ecommerce.backend.entity.product.Order;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.repository.product.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Set;

/**
 * Orchestrates the full VietQR payment flow:
 *  1. getPaymentInfo()      – generate QR info, write Google Sheet row (PENDING)
 *  2. checkPaymentStatus()  – poll DB status (lightweight, no Sheet call)
 *  3. processWebhook()      – handle Macrodroid/Ngrok push; race-condition safe
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    /**
     * Trạng thái "cuối" — một khi đã đạt tới thì KHÔNG được phép thay đổi nữa.
     * Đảm bảo: đơn PAID không thể bị webhook sau đó đổi sang FAILED.
     */
    private static final Set<String> TERMINAL_STATUSES =
            Set.of("PAID", "FAILED", "CONFIRMED", "COMPLETED", "CANCELLED");

    private final OrderRepository    orderRepository;
    private final VietQRService      vietQRService;
    private final GoogleSheetService googleSheetService;

    /**
     * GET /payment/vietqr/{orderId}
     * Chỉ đọc dữ liệu — readOnly=true giúp Hibernate tối ưu, không mở write transaction.
     */
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentInfo(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        String qrUrl      = vietQRService.generateQRCodeUrl(order.getId(), order.getTotalAmount());
        String bankContent = "ORDER_" + order.getId();

        // Ghi Google Sheet NGOÀI transaction → lỗi Sheet không rollback DB
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

    /**
     * GET /payment/status/{orderId}
     * Polling nhẹ từ frontend — chỉ đọc status trong DB.
     * Webhook đã cập nhật DB trực tiếp nên không cần gọi Google Sheet ở đây nữa.
     */
    @Transactional(readOnly = true)
    public String checkPaymentStatus(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        return order.getStatus();
    }

    /**
     * POST /payment/webhook — Nhận tín hiệu từ Macrodroid (qua Ngrok).
     *
     * FIX RACE CONDITION: Dùng findByIdWithLock() (PESSIMISTIC_WRITE).
     * DB sẽ lock hàng này cho đến khi transaction hoàn tất, đảm bảo chỉ
     * 1 trong 2 request đồng thời được xử lý — request còn lại chờ và
     * sau đó bị chặn bởi TERMINAL_STATUSES guard.
     */
    @Transactional
    public void processWebhook(Long orderId, String reportedStatus) {
        log.info("Webhook nhận được — Đơn hàng ID: {}, Trạng thái báo cáo: {}", orderId, reportedStatus);

        // Pessimistic lock: row bị lock đến cuối transaction
        Order order = orderRepository.findByIdWithLock(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        String currentStatus = order.getStatus() != null ? order.getStatus().toUpperCase() : "";

        // Guard: đơn đã ở trạng thái cuối → bỏ qua, không làm gì
        if (TERMINAL_STATUSES.contains(currentStatus)) {
            log.warn("Bỏ qua Webhook: Đơn {} đã ở trạng thái cuối '{}', không thể xử lý webhook '{}'",
                    orderId, currentStatus, reportedStatus);
            return;
        }

        String normalizedStatus = reportedStatus.toUpperCase();
        
        // Cập nhật trạng thái thanh toán và trạng thái đơn hàng thay vì gán trực tiếp PAID vào Order Status
        if ("PAID".equals(normalizedStatus)) {
            order.setPaymentStatus(com.ecommerce.backend.entity.product.PaymentStatus.PAID);
            order.setStatus("CONFIRMED");
            log.info("Đơn hàng {} đã được thanh toán, cập nhật trạng thái đơn thành CONFIRMED.", orderId);
        } else if ("FAILED".equals(normalizedStatus)) {
            order.setStatus("CANCELLED");
            log.info("Đơn hàng {} thanh toán thất bại, cập nhật trạng thái đơn thành CANCELLED.", orderId);
        } else {
            order.setStatus(normalizedStatus);
            log.info("Đơn hàng {} đã được cập nhật sang trạng thái: {}", orderId, normalizedStatus);
        }   
        orderRepository.save(order);
}
}
