// src/pages/MyOrdersPage.jsx
import React, { memo, useState, useEffect } from "react";
import { Link } from "react-router-dom";

// DATA MẪU - Xóa phần này khi có backend
const MOCK_ORDERS = [
  {
    id: "1",
    orderNumber: "DH001234",
    createdAt: "2025-10-28",
    status: "shipping",
    total: 1500000,
    items: [
      {
        name: "Áo thun nam basic",
        quantity: 2,
        price: 250000,
        image: "https://via.placeholder.com/80"
      },
      {
        name: "Quần jean slim fit",
        quantity: 1,
        price: 1000000,
        image: "https://via.placeholder.com/80"
      }
    ]
  },
  {
    id: "2",
    orderNumber: "DH001235",
    createdAt: "2025-10-25",
    status: "completed",
    total: 850000,
    items: [
      {
        name: "Giày sneaker trắng",
        quantity: 1,
        price: 850000,
        image: "https://via.placeholder.com/80"
      }
    ]
  },
  {
    id: "3",
    orderNumber: "DH001236",
    createdAt: "2025-10-30",
    status: "pending",
    total: 450000,
    items: [
      {
        name: "Mũ lưỡi trai",
        quantity: 3,
        price: 150000,
        image: "https://via.placeholder.com/80"
      }
    ]
  },
  {
    id: "4",
    orderNumber: "DH001237",
    createdAt: "2025-10-20",
    status: "cancelled",
    total: 2000000,
    items: [
      {
        name: "Áo khoác dạ",
        quantity: 1,
        price: 2000000,
        image: "https://via.placeholder.com/80"
      }
    ]
  }
];

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
        // Bỏ MOCK_ORDERS đi
        // Uncomment phần API này:
      // TODO: Thay bằng API thật khi có backend
      // const response = await fetch("/api/orders", {
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem("token")}`,
      //   },
      // });
      // const data = await response.json();
      // setOrders(data.orders || []);

      // Giả lập loading
      setTimeout(() => {
        setOrders(MOCK_ORDERS);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: "warning", text: "Chờ xác nhận" },
      confirmed: { class: "info", text: "Đã xác nhận" },
      shipping: { class: "primary", text: "Đang giao" },
      completed: { class: "success", text: "Hoàn thành" },
      cancelled: { class: "danger", text: "Đã hủy" },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`badge bg-${config.class}`}>{config.text}</span>;
  };

  const handleCancelOrder = (orderId) => {
    // TODO: Gọi API hủy đơn
    if (window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) {
      console.log("Hủy đơn:", orderId);
      // Cập nhật UI tạm thời
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: "cancelled" } : order
      ));
    }
  };

  const handleReorder = (order) => {
    // TODO: Thêm sản phẩm vào giỏ hàng
    console.log("Mua lại:", order);
    alert("Đã thêm sản phẩm vào giỏ hàng!");
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.status === filter;
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
              Hoàn thành
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
          <Link to="/products" className="btn btn-primary mt-3">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div key={order.id} className="card mb-3 shadow-sm">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <div>
                  <strong>Đơn hàng #{order.orderNumber}</strong>
                  <small className="text-muted ms-3">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </small>
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
                      src={item.image}
                      alt={item.name}
                      className="rounded"
                      style={{ 
                        width: "80px", 
                        height: "80px", 
                        objectFit: "cover",
                        border: "1px solid #dee2e6"
                      }}
                    />
                    <div className="ms-3 flex-grow-1">
                      <h6 className="mb-1">{item.name}</h6>
                      <p className="text-muted mb-1 small">
                        Số lượng: x{item.quantity}
                      </p>
                      <p className="text-primary fw-bold mb-0">
                        {(item.price * item.quantity).toLocaleString("vi-VN")}₫
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
                        {order.total.toLocaleString("vi-VN")}₫
                      </span>
                    </p>
                  </div>
                  <div>
                    <Link
                      to={`/orders/${order.id}`}
                      className="btn btn-outline-primary btn-sm me-2"
                    >
                      Xem chi tiết
                    </Link>
                    {order.status === "completed" && (
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleReorder(order)}
                      >
                        Mua lại
                      </button>
                    )}
                    {order.status === "pending" && (
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
    </div>
  );
};

export default memo(MyOrdersPage);