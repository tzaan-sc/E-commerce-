import React, { memo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { addToCart } from "api/cart";
import { useCart } from "context/index";
import { useNavigate } from "react-router-dom";
import { getMyOrders, cancelOrder, confirmReceived } from "api/order";

const MyOrdersPage = () => {

  const { fetchCartCount } = useCart();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // ── Dịch trạng thái đơn hàng ───────────────────────────────────────────────
  const translateStatus = (status) => {
    if (!status) return 'Không rõ';
    const map = {
      'PENDING': 'Chờ xác nhận',
      'PROCESSING': 'Đang xử lý',
      'CONFIRMED': 'Đã xác nhận',
      'SHIPPING': 'Đang giao',
      'DELIVERED': 'Đã giao',
      'COMPLETED': 'Hoàn thành',
      'CANCELLED': 'Đã hủy',
    };
    return map[status.toUpperCase()] || status;
  };

  // ── Badge trạng thái đơn hàng ──────────────────────────────────────────────
  const getStatusBadge = (status) => {
    const statusUpper = status?.toUpperCase();
    const statusConfig = {
      PENDING: { class: "warning", text: translateStatus('PENDING') },
      PROCESSING: { class: "primary", text: translateStatus('PROCESSING') },
      CONFIRMED: { class: "secondary", text: translateStatus('CONFIRMED') },
      SHIPPING: { class: "info", text: translateStatus('SHIPPING') },
      DELIVERED: { class: "info", text: translateStatus('DELIVERED') },
      COMPLETED: { class: "success", text: translateStatus('COMPLETED') },
      CANCELLED: { class: "danger", text: translateStatus('CANCELLED') },
    };
    const config = statusConfig[statusUpper] || { class: "secondary", text: status };
    return <span className={`badge bg-${config.class}`}>{config.text}</span>;
  };

  // ── Badge trạng thái thanh toán ────────────────────────────────────────────
  const getPaymentBadge = (paymentStatus) => {
    const map = {
      UNPAID: { class: 'warning', text: 'Chưa thanh toán' },
      PAID: { class: 'success', text: 'Đã thanh toán' },
      REFUNDED: { class: 'info', text: 'Đã hoàn tiền' },
    };
    const config = map[paymentStatus?.toUpperCase()] || { class: 'secondary', text: 'Không rõ' };
    return <span className={`badge bg-${config.class}`}>{config.text}</span>;
  };

  // ── Fetch orders ───────────────────────────────────────────────────────────
  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getMyOrders();
      let fetchedOrders = Array.isArray(res.data) ? res.data : [];
      fetchedOrders.sort((a, b) => b.id - a.id);
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // ── Hủy đơn ───────────────────────────────────────────────────────────────
  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) {
      try {
        await cancelOrder(orderId);
        alert("Đã hủy đơn hàng thành công.");
        fetchOrders();
      } catch (err) {
        console.error("Lỗi hủy đơn hàng:", err);
        alert(err.response?.data?.message || "Không thể hủy đơn hàng này.");
      }
    }
  };

  // ── Xác nhận đã nhận hàng ─────────────────────────────────────────────────
  const handleConfirmReceived = async (orderId) => {
    if (window.confirm("Bạn xác nhận đã nhận được hàng?")) {
      try {
        await confirmReceived(orderId);
        alert("Xác nhận nhận hàng thành công!");
        fetchOrders();
      } catch (err) {
        console.error("Lỗi xác nhận nhận hàng:", err);
        alert(err.response?.data?.message || "Không thể xác nhận. Vui lòng thử lại.");
      }
    }
  };

  // ── Mua lại ───────────────────────────────────────────────────────────────
  const handleReorder = async (order) => {
    try {
      const items = order.items || [];
      if (!items || items.length === 0) {
        alert("Không tìm thấy sản phẩm trong đơn hàng này!");
        return;
      }

      const addPromises = items.map(async (item) => {
        const productId = item.productId || item.id || (item.product ? item.product.id : null);
        const quantity = item.quantity || 1;
        if (productId) {
          return await addToCart(productId, quantity);
        } else {
          console.error("❌ Không tìm thấy ID sản phẩm:", item);
        }
      });

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

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.status?.toLowerCase() === filter.toLowerCase();
  });

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="container py-5">
      <h2 className="mb-4">Đơn Hàng Của Tôi</h2>

      {/* Filter Tabs */}
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
          <div className="mb-4" style={{ fontSize: "80px", opacity: 0.3 }}>📦</div>
          <h5 className="text-muted">Chưa có đơn hàng</h5>
          <p className="text-muted">
            {filter === "all" ? "Bạn chưa có đơn hàng nào" : "Không có đơn hàng nào ở trạng thái này"}
          </p>
          <Link to="/customer/home" className="btn btn-primary mt-3">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div key={order.id} className="card mb-3 shadow-sm">

              {/* Card Header */}
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <div>
                  <strong>Đơn hàng #{order.userOrderNumber || order.id}</strong>
                  {order.createdAt && (
                    <small className="text-muted ms-3">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </small>
                  )}
                </div>

                {/* 👇 2 badge kế nhau */}
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {getStatusBadge(order.status)}
                  {getPaymentBadge(order.paymentStatus)}
                </div>
              </div>

              {/* Card Body */}
              <div className="card-body">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className={`d-flex align-items-center mb-3 pb-3 ${index < order.items.length - 1 ? "border-bottom" : ""
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
                      style={{ width: "80px", height: "80px", objectFit: "cover", border: "1px solid #dee2e6" }}
                    />
                    <div className="ms-3 flex-grow-1">
                      <h6 className="mb-1">{item.productName}</h6>
                      <p className="text-muted mb-1 small">Số lượng: x{item.quantity}</p>
                      <p className="text-primary fw-bold mb-0">
                        {((item.price || 0) * (item.quantity || 0)).toLocaleString("vi-VN")}₫
                      </p>
                    </div>
                  </div>
                ))}

                {/* Order Summary + Nút */}
                <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                  <div>
                    <p className="mb-0">
                      <strong>Tổng cộng:</strong>{" "}
                      <span className="text-danger fs-5 fw-bold">
                        {(order.totalAmount || order.total || 0).toLocaleString("vi-VN")}₫
                      </span>
                    </p>
                    <p className="mb-0 text-muted" style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                      Thanh toán: <strong>{order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : `Thanh toán Online (${order.paymentMethod || 'Chuyển khoản'})`}</strong>
                    </p>
                  </div>

                  <div>
                    <Link
                      to={`/customer/home/don-mua/${order.id}`}
                      className="btn btn-outline-primary btn-sm me-2"
                    >
                      Xem chi tiết
                    </Link>

                    {order.status === "COMPLETED" && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleReorder(order)}
                      >
                        Mua lại
                      </button>
                    )}

                    {order.status === 'SHIPPING' && (
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleConfirmReceived(order.id)}
                      >
                        Đã nhận được hàng
                      </button>
                    )}

                    {order.status === 'DELIVERED' && (
                      <span className="ms-2 px-2 py-1 border border-success rounded text-success fw-bold"
                        style={{ fontSize: '0.9rem', backgroundColor: '#f0fff4' }}>
                        Giao hàng thành công
                      </span>
                    )}

                    {order.status === "PENDING" && (
                      <button
                        className="btn btn-outline-danger btn-sm ms-2"
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
    </div>
  );
};

export default memo(MyOrdersPage);