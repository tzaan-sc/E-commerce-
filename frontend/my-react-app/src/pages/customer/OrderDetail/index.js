import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderDetail } from "api/order"; // Đảm bảo bạn có API này

// 💡 Gợi ý: Dùng thư viện icon cho đẹp
// Cài đặt: npm install react-icons
import { 
  FaUser, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaRegStickyNote,
  FaShippingFast // Icon cho trạng thái
} from "react-icons/fa";

// Hàm helper để lấy thông tin trạng thái
const getStatusInfo = (status) => {
  switch (status) {
    case "SHIPPING":
      return { text: "Đang giao hàng", icon: <FaShippingFast />, class: "warning" };
    case "PENDING":
      return { text: "Chờ xác nhận", icon: <FaUser />, class: "secondary" };
    case "COMPLETED":
      return { text: "Đã giao", icon: <FaUser />, class: "success" };
    case "CANCELLED":
      return { text: "Đã hủy", icon: <FaUser />, class: "danger" };
    default:
      return { text: "Đang xử lý", icon: <FaUser />, class: "info" };
  }
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      setLoading(true);
      try {
        const res = await getOrderDetail(id);
        setOrder(res.data); // Giả sử res.data có cấu trúc khớp
        setError(null);
      } catch (err) {
        console.error("Lỗi khi tải chi tiết đơn hàng:", err);
        setError("Không tìm thấy đơn hàng hoặc có lỗi xảy ra.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [id]);

  // (Phần code Loading/Error giữ nguyên như trước)
  if (loading) {
    return <div className="text-center py-5">Đang tải...</div>;
  }
  if (error) {
    return <div className="text-center py-5 text-danger">{error}</div>;
  }
  if (!order) {
    return null; // Hoặc thông báo không có đơn hàng
  }

  // Lấy thông tin trạng thái
  const statusInfo = getStatusInfo(order.status);

  // 5. HIỂN THỊ JSX THEO BỐ CỤC MỚI
  return (
    // Thêm một màu nền chung
    <div className="container-fluid py-4" style={{ backgroundColor: "#f9f9f9" }}>
      <div className="container">
        
        {/* Nút quay lại */}
        <div className="mb-3">
          <Link to="/customer/home/don-mua" className="text-decoration-none text-dark">
            &larr; Quay lại danh sách đơn hàng
          </Link>
        </div>

        <div className="row">
          
          {/* CỘT BÊN TRÁI (Sản phẩm + Thông tin) */}
          <div className="col-lg-8">

            {/* --- 1. SẢN PHẨM --- */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white py-3 border-0">
                <h5 className="mb-0">Sản phẩm</h5>
              </div>
              <div className="card-body">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item-row d-flex mb-3">
                    {/* Hình ảnh sản phẩm (Giả sử) */}
                    <img
                      src={
                        item.imageUrl
                          ? `http://localhost:8080${item.imageUrl}`
                          : "https://via.placeholder.com/80"
                      }
                      alt={item.productName}
                      style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
                    />
                    
                    <div className="flex-grow-1 ms-3">
                      <h6 className="mb-1">{item.productName}</h6>
                      
                      {/* 💡 PHẦN NÀY QUAN TRỌNG:
                        Bạn cần API trả về các thông tin này (brand, category, size)
                        Nếu không có, bạn có thể phải xử lý từ productName
                      */}
                      <div className="d-flex text-muted small">
                        {item.brand && <span className="me-3">🎨 {item.brand}</span>}
                        {item.category && <span className="me-3">💻 {item.category}</span>}
                        {item.size && <span className="me-3">📏 {item.size}</span>}
                      </div>

                      <p className="mb-0 mt-1 text-muted">Số lượng: {item.quantity}</p>
                    </div>
                    
                    <div className="text-end ms-3" style={{ minWidth: "120px" }}>
                      <span className="fw-bold text-dark fs-6">
                        {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* --- 2. THÔNG TIN GIAO HÀNG --- */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white py-3 border-0">
                <h5 className="mb-0">Thông tin giao hàng</h5>
              </div>
              <div className="card-body">
                
                <div className="info-row d-flex align-items-start mb-3">
                  <FaUser className="me-3 mt-1 fs-5 text-muted" />
                  <div>
                    <span className="text-muted small">Người nhận</span>
                    <h6 className="mb-0">{order.customerName}</h6>
                  </div>
                </div>

                <div className="info-row d-flex align-items-start mb-3">
                  <FaPhone className="me-3 mt-1 fs-5 text-muted" />
                  <div>
                    <span className="text-muted small">Số điện thoại</span>
                    <h6 className="mb-0">{order.phone}</h6>
                  </div>
                </div>

                <div className="info-row d-flex align-items-start mb-3">
                  <FaMapMarkerAlt className="me-3 mt-1 fs-5 text-muted" />
                  <div>
                    <span className="text-muted small">Địa chỉ giao hàng</span>
                    <h6 className="mb-0">{order.shippingAddress}</h6>
                  </div>
                </div>

                {/* Giả sử API có trả về 'note' */}
                {order.note && (
                  <div className="info-row d-flex align-items-start">
                    <FaRegStickyNote className="me-3 mt-1 fs-5 text-muted" />
                    <div>
                      <span className="text-muted small">Ghi chú</span>
                      <h6 className="mb-0">{order.note}</h6>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div> {/* Hết Cột bên trái */}

          {/* CỘT BÊN PHẢI (Tổng cộng + Trạng thái) */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm sticky-top" style={{ top: "20px" }}>
              <div className="card-body p-4">

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Tạm tính</span>
                  {/* "Tạm tính" (subTotal) thường là tổng tiền hàng trước khi
                    tính phí ship/giảm giá. Giả sử API trả về subTotal.
                    Nếu không, bạn có thể tạm dùng totalAmount.
                  */}
                  <span className="fw-medium">
                    {(order.subTotal || order.totalAmount).toLocaleString("vi-VN")} ₫
                  </span>
                </div>
                
                {/* (Bạn có thể thêm Phí ship, Giảm giá ở đây nếu API có) */}

                <hr className="my-3" />
                
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-bold fs-5">Tổng cộng</span>
                  <span className="fw-bold fs-4 text-primary">
                    {(order.totalAmount).toLocaleString("vi-VN")} ₫
                  </span>
                </div>

                {/* --- TRẠNG THÁI (Giống hình) --- */}
                <div className={`alert alert-${statusInfo.class} text-center d-flex align-items-center justify-content-center`} role="alert">
                  {statusInfo.icon}
                  <strong className="ms-2">{statusInfo.text}</strong>
                </div>

              </div>
            </div>
          </div> {/* Hết Cột bên phải */}

        </div> {/* Hết .row */}
      </div>
    </div>
  );
};

export default OrderDetailPage;
