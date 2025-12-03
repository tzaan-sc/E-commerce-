package com.ecommerce.backend.entity.product;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp; // <-- SỬA: THÊM IMPORT
import java.time.LocalDateTime; // <-- SỬA: THÊM IMPORT
import java.util.ArrayList;
import com.ecommerce.backend.entity.auth.User;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(name = "customer_name")
//    private String customerName;
//
//    @Column(name = "status")
//    private String status;
//
//    @Column(name = "total_amount")
//    private Double totalAmount;
//
//    // <-- SỬA: THÊM TRƯỜNG NÀY -->
//    @CreationTimestamp
//    private LocalDateTime createdAt;
//
//    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
//    @JsonManagedReference
//    @ToString.Exclude
//    private List<OrderItem> orderItems = new ArrayList<>();
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "user_order_number")
    private Integer userOrderNumber;
    @Column(name = "customer_name")
    private String customerName; // Tên người nhận (vẫn giữ)

    // 👇 2. THÊM CÁC TRƯỜNG "ĐÓNG BĂNG" THÔNG TIN
    // (Để React có thể hiển thị)
    @Column(name = "phone")
    private String phone; // SĐT lúc đặt hàng

    @Column(name = "shipping_address")
    private String shippingAddress; // Địa chỉ lúc đặt hàng

    @Column(name = "status")
    private String status;

    @Column(name = "total_amount")
    private Double totalAmount;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(columnDefinition = "TEXT")
    private String note;

    // 👇 3. THÊM LIÊN KẾT BẢO MẬT VỚI USER
    // (Để kiểm tra đơn hàng này của ai)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false) // Sẽ tạo cột user_id
    @JsonBackReference
    @ToString.Exclude
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    @ToString.Exclude
    private List<OrderItem> orderItems = new ArrayList<>();
    public void addItem(OrderItem item) {
        if (item != null) {
            if (orderItems == null) {
                orderItems = new ArrayList<>();
            }
            orderItems.add(item);
            item.setOrder(this);
        }
    }
}