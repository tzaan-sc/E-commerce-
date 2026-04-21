import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ReviewForm from 'components/user/ReviewForm';
import { getOrderDetail } from 'api/order'; // Đảm bảo bạn có API này

// 💡 Gợi ý: Dùng thư viện icon cho đẹp
// Cài đặt: npm install react-icons
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaRegStickyNote,
  FaShippingFast, // Icon cho trạng thái
} from 'react-icons/fa';

// Hàm helper để lấy thông tin trạng thái
const getStatusInfo = (status) => {
  switch (status) {
    case 'SHIPPING':
      return {
        text: 'Đang giao hàng',
        icon: <FaShippingFast />,
        class: 'warning',
      };
    case 'PENDING':
      return { text: 'Chờ xác nhận', icon: <FaUser />, class: 'secondary' };
    case 'COMPLETED':
      return { text: 'Đã giao', icon: <FaUser />, class: 'success' };
    case 'CANCELLED':
      return { text: 'Đã hủy', icon: <FaUser />, class: 'danger' };
    default:
      return { text: 'Đang xử lý', icon: <FaUser />, class: 'info' };
  }
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [order, setOrder] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
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
        console.error('Lỗi khi tải chi tiết đơn hàng:', err);
        setError('Không tìm thấy đơn hàng hoặc có lỗi xảy ra.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [id]);

  // ✅ HÀM LẤY ẢNH TỐI ƯU DỰA TRÊN JSON THỰC TẾ
  const getProductImage = (item) => {
    const BASE_URL = "http://localhost:8080";
    
    // 1. Kiểm tra trong object variant (Ưu tiên hàng đầu cho biến thể)
    if (item.variant) {
      if (item.variant.images && item.variant.images.length > 0) {
        const vImg = item.variant.images[0].imageUrl || item.variant.images[0].image_url;
        return `${BASE_URL}${vImg}`;
      }
      if (item.variant.image) {
        return `${BASE_URL}${item.variant.image}`;
      }
    }

    // 2. Ưu tiên 2: Trường imageUrl được lưu trực tiếp trong order_item
    if (item.imageUrl) {
      return `${BASE_URL}${item.imageUrl}`;
    }

    // 3. Ưu tiên 3: Ảnh của Sản phẩm chính
    if (item.product?.imageUrl) {
      return `${BASE_URL}${item.product.imageUrl}`;
    }

    if (item.product?.images && item.product.images.length > 0) {
      const url = item.product.images[0].urlImage || item.product.images[0];
      return `${BASE_URL}${url}`;
    }
    
    return "https://via.placeholder.com/80?text=No+Image";
  };

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
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: '#f9f9f9' }}
    >
      <div className="container">
        {/* Nút quay lại */}
        <div className="mb-3">
          <Link
            to="/customer/home/don-mua"
            className="text-decoration-none text-dark"
          >
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
                    <img
                      src={getProductImage(item)}
                      alt={item.productName}
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #eee'
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/80?text=Error";
                      }}
                    />

                    <div className="flex-grow-1 ms-3">
                      {/* ✅ FIX: Loại bỏ null-null bằng cách replace chuỗi hoặc lấy tên từ product */}
                      <h6 className="mb-1" style={{ fontWeight: '600' }}>
                        {item.productName?.split(' (')[0] || item.product?.name}
                      </h6>

                      <div className="d-flex text-muted small">
                        {item.brand && (
                          <span className="me-3">🎨 {item.brand}</span>
                        )}
                        {item.category && (
                          <span className="me-3">💻 {item.category}</span>
                        )}
                        {item.size && (
                          <span className="me-3">📏 {item.size}</span>
                        )}
                      </div>

                      {/* ✅ THÊM: Hiển thị phân loại cấu hình biến thể (giống giỏ hàng) */}
                      {item.variant ? (
                        <div className="variant-label mt-1" style={{
                          fontSize: '12px',
                          color: '#475569',
                          background: '#f1f5f9',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          display: 'inline-block'
                        }}>
                          Phân loại: {item.variant.ramCapacity || item.variant.ram?.ramSize} 
                          {" / "} 
                          {item.variant.storageCapacity || item.variant.storage?.storageType}
                          {" / "}
                          {item.variant.colorName || item.variant.color?.colorName}
                        </div>
                      ) : (
                        /* Fallback nếu không có object variant nhưng có tên chứa data */
                        item.productName?.includes('(') && !item.productName?.includes('null') && (
                          <div className="small text-muted mt-1">
                            {item.productName.substring(item.productName.indexOf('('))}
                          </div>
                        )
                      )}

                      <p className="mb-0 mt-1 text-muted">
                        Số lượng: {item.quantity}
                      </p>

                      {item.discountAmount > 0 && (
                        <div className="mt-1">
                          <span className="badge bg-danger">
                            {item.promotionName || 'Đang khuyến mãi'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div
                      className="text-end ms-3"
                      style={{ minWidth: '120px' }}
                    >
                      <div className="d-flex flex-column align-items-end">
                        <span className="fw-bold text-dark fs-6">
                          {(
                            (item.price || 0) * (item.quantity || 1)
                          ).toLocaleString('vi-VN')}{' '}
                          ₫
                        </span>
                        {item.discountAmount > 0 && (
                          <span className="text-muted text-decoration-line-through small mt-1">
                            {(
                              (item.originalPrice || 0) * (item.quantity || 1)
                            ).toLocaleString('vi-VN')}{' '}
                            ₫
                          </span>
                        )}
                      </div>
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
          </div>{' '}
          {/* Hết Cột bên trái */}
          {/* CỘT BÊN PHẢI (Tổng cộng + Trạng thái) */}
          <div className="col-lg-4">
            <div
              className="card border-0 shadow-sm sticky-top"
              style={{ top: '20px' }}
            >
              <div className="card-body p-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Tạm tính</span>
                  <span className="fw-medium">
                    {(order.subTotal || order.totalAmount).toLocaleString(
                      'vi-VN',
                    )}{' '}
                    ₫
                  </span>
                </div>

                <hr className="my-3" />

                {/* Tính tổng tiết kiệm */}
                {
                  (order.totalDiscount = order.items.reduce(
                    (sum, item) =>
                      sum + (item.discountAmount || 0) * (item.quantity || 1),
                    0,
                  ))
                }
                {order.totalDiscount > 0 && (
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Tiết kiệm được</span>
                    <span className="fw-medium text-success">
                      - {order.totalDiscount.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                )}

                <div className="d-flex justify-content-between align-items-center mb-3 pt-2">
                  <span className="fw-bold fs-5">Tổng cộng</span>
                  <span className="fw-bold fs-4 text-primary">
                    {order.totalAmount.toLocaleString('vi-VN')} ₫
                  </span>
                </div>

                {/* --- TRẠNG THÁI (Giống hình) --- */}
                <div
                  className={`alert alert-${statusInfo.class} text-center d-flex align-items-center justify-content-center`}
                  role="alert"
                >
                  {statusInfo.icon}
                  <strong className="ms-2">{statusInfo.text}</strong>
                </div>
                {/* NÚT ĐÁNH GIÁ */}
                {order.status === 'DELIVERED' && (
                  <button
                    className="btn btn-outline-primary w-100"
                    onClick={() => {
                      setSelectedProduct(order.items[0].productId);
                      setShowReview(true);
                    }}
                  >
                    ⭐ Đánh giá
                  </button>
                )}
              </div>
            </div>
          </div>{' '}
          {/* Hết Cột bên phải */}
        </div>{' '}
        {/* Hết .row */}
      </div>
      {showReview && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
          }}
        >
          <div
            className="bg-white p-4 rounded shadow"
            style={{ width: '400px' }}
          >
            <ReviewForm productId={selectedProduct} userId={user.id} />

            <button
              className="btn btn-secondary mt-3"
              onClick={() => setShowReview(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;