import React, { memo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyOrders, cancelOrder } from "api/order";
import ReviewForm from "components/user/ReviewForm";
// Thêm 3 dòng này vào đầu file
import { addToCart } from "api/cart"; 
import { useCart } from "context/index"; 
import { useNavigate } from "react-router-dom";

const MyOrdersPage = () => {
  
  const { fetchCartCount } = useCart(); 
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showReview, setShowReview] = useState(false);
const [selectedProduct, setSelectedProduct] = useState(null);

const user = JSON.parse(localStorage.getItem("user"));

  // Helper: Hàm dịch trạng thái sang tiếng Việt
  // --- TRONG FILE MyOrdersPage (Khách hàng) ---

// 1. Sửa hàm dịch: Thêm case PROCESSING
const translateStatus = (status) => {
  if (!status) return 'Không rõ';
  const map = {
    'PENDING': 'Chờ xác nhận',
    'PROCESSING': 'Đang xử lý', // 👈 THÊM DÒNG NÀY (Quan trọng nhất)
    'CONFIRMED': 'Đã xác nhận', // (Giữ lại để tương thích ngược nếu cần)
    'SHIPPING': 'Đang giao',
    'COMPLETED': 'Đã giao',
    'CANCELLED': 'Đã hủy',
  };
  return map[status.toUpperCase()] || status;
};

// 2. Sửa hàm lấy màu badge: Thêm case PROCESSING
const getStatusBadge = (status) => {
  const statusUpper = status?.toUpperCase();
  const statusConfig = {
    PENDING: { class: "warning", text: translateStatus('PENDING') },
    
    // 👇 THÊM DÒNG NÀY: Để trạng thái 'Đang xử lý' có màu xanh dương (info) hoặc tím (primary)
    PROCESSING: { class: "primary", text: translateStatus('PROCESSING') }, 
    
    SHIPPING: { class: "info", text: translateStatus('SHIPPING') },
    COMPLETED: { class: "success", text: translateStatus('COMPLETED') },
    CANCELLED: { class: "danger", text: translateStatus('CANCELLED') },
    CONFIRMED: { class: "secondary", text: translateStatus('CONFIRMED') },
  };
  
  const config = statusConfig[statusUpper] || { class: "secondary", text: status };
  return <span className={`badge bg-${config.class}`}>{config.text}</span>;
};


  useEffect(() => {
    fetchOrders();
  }, [filter]); // Lọc theo filter

  // 3. SỬA HÀM FETCHORDERS: Thêm sắp xếp
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getMyOrders();
      let fetchedOrders = Array.isArray(res.data) ? res.data : [];

      // Sắp xếp: Đơn hàng cũ nhất (ID nhỏ nhất) lên trước (1, 2, 3...)
      fetchedOrders.sort((a, b) => b.id - a.id);
      
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => { // Thêm async
    if (window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) {
      try {
        await cancelOrder(orderId); // Gọi API
        alert("Đã hủy đơn hàng thành công.");
        fetchOrders(); // Tải lại danh sách đơn hàng
      } catch (err) {
        console.error("Lỗi hủy đơn hàng:", err);
        alert(err.response?.data?.message || "Không thể hủy đơn hàng này.");
      }
    }
  };

const handleReorder = async (order) => {
    try {
      console.log("Check Order:", order); // Giữ lại để debug

      // 1. 👇 SỬA LẠI TÊN BIẾN Ở ĐÂY (Backend trả về là 'items')
      const items = order.items || []; 

      if (!items || items.length === 0) {
        alert("Không tìm thấy sản phẩm trong đơn hàng này!");
        return;
      }

      // 2. Duyệt qua từng món
      const addPromises = items.map(async (item) => {
        // 👇 QUAN TRỌNG: Cố gắng tìm ID sản phẩm ở mọi ngóc ngách
        // Backend có thể trả về: productId, id, hoặc product.id
        const productId = item.productId || item.id || (item.product ? item.product.id : null);
        
        const quantity = item.quantity || 1;

        if (productId) {
           return await addToCart(productId, quantity);
        } else {
           console.error("❌ LỖI: Không tìm thấy ID sản phẩm trong món này:", item);
        }
      });

      // 3. Đợi và thông báo
      await Promise.all(addPromises);
      fetchCartCount();

      if (window.confirm("Đã thêm sản phẩm vào giỏ! Đến giỏ hàng ngay?")) {
        navigate("/customer/home/gio-hang");
      }

    } catch (error) {
      console.error("Lỗi mua lại:", error);
      alert("Lỗi xử lý! Vui lòng kiểm tra Console (F12) để xem chi tiết.");
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.status?.toLowerCase() === filter.toLowerCase();
  });

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Đơn Hàng Của Tôi</h2>

      {/* Filter Tabs (Giữ nguyên) */}
      <div className="mb-4">
        <ul className="nav nav-pills">
          <li className="nav-item">
            <button
              className={`nav-link ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              Tất cả ({orders.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${filter === "pending" ? "active" : ""}`}
              onClick={() => setFilter("pending")}
            >
              Chờ xác nhận
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${filter === "shipping" ? "active" : ""}`}
              onClick={() => setFilter("shipping")}
            >
              Đang giao
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${filter === "completed" ? "active" : ""}`}
              onClick={() => setFilter("completed")}
            >
              Đã giao
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${filter === "cancelled" ? "active" : ""}`}
              onClick={() => setFilter("cancelled")}
            >
              Đã hủy
            </button>
          </li>
        </ul>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-4" style={{ fontSize: "80px", opacity: 0.3 }}>
            📦
          </div>
          <h5 className="text-muted">Chưa có đơn hàng</h5>
          <p className="text-muted">
            {filter === "all"
              ? "Bạn chưa có đơn hàng nào"
              : "Không có đơn hàng nào ở trạng thái này"}
          </p>
          <Link to="/customer/home" className="btn btn-primary mt-3">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div key={order.id} className="card mb-3 shadow-sm">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <div>
                  {/* Sử dụng userOrderNumber để hiển thị số thứ tự riêng */}
                  <strong>Đơn hàng #{order.userOrderNumber || order.id}</strong>
                  {order.createdAt && ( // Hiển thị ngày nếu có
                    <small className="text-muted ms-3">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </small>
                  )}
                </div>
                {getStatusBadge(order.status)}
              </div>
              <div className="card-body">
                {/* Order Items */}
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className={`d-flex align-items-center mb-3 pb-3 ${
                      index < order.items.length - 1 ? "border-bottom" : ""
                    }`}
                  >
                    <img
                      src={
                        item.imageUrl
                          ? `http://localhost:8080${item.imageUrl}`
                          : "https://via.placeholder.com/80"
                      }
                      alt={item.productName}
                      className="rounded"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        border: "1px solid #dee2e6",
                      }}
                    />
                    <div className="ms-3 flex-grow-1">
                      <h6 className="mb-1">{item.productName}</h6>
                      <p className="text-muted mb-1 small">
                        Số lượng: x{item.quantity}
                      </p>
                      <p className="text-primary fw-bold mb-0">
                        {(
                          (item.price || 0) * (item.quantity || 0)
                        ).toLocaleString("vi-VN")}
                        ₫
                      </p>
                    </div>
                  </div>
                ))}

                {/* Order Summary */}
                <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                  <div>
                    <p className="mb-0">
                      <strong>Tổng cộng:</strong>{" "}
                      <span className="text-danger fs-5 fw-bold">
                        {(
                          order.totalAmount || order.total || 0
                        ).toLocaleString("vi-VN")}
                        ₫
                      </span>
                    </p>
                  </div>

                  {/* PHẦN NÚT BẤM */}
                  <div>
  <Link
    to={`/customer/home/don-mua/${order.id}`}
    className="btn btn-outline-primary btn-sm me-2"
  >
    Xem chi tiết
  </Link>

  {order.status === "COMPLETED" && (
    <>
      <button
  className="btn btn-warning btn-sm me-2"
  onClick={() => {
    setSelectedProduct(order.items[0].productId);
    setShowReview(true);
  }}
>
  Đánh giá
</button>

      <button
        className="btn btn-primary btn-sm"
        onClick={() => handleReorder(order)}
      >
        Mua lại
      </button>
    </>
  )}

  {order.status === "PENDING" && (
    <button
      className="btn btn-outline-danger btn-sm"
      onClick={() => handleCancelOrder(order.id)}
    >
      Hủy đơn
    </button>
  )}
</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showReview && (
<div
style={{
position: "fixed",
top: 0,
left: 0,
width: "100%",
height: "100%",
background: "rgba(0,0,0,0.5)",
display: "flex",
justifyContent: "center",
alignItems: "center",
zIndex: 999
}}
>

<div className="bg-white p-4 rounded shadow-lg" style={{width:"420px"}}>

<ReviewForm
productId={selectedProduct}
userId={user.id}
/>

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

export default memo(MyOrdersPage);      