import React, { useState, useEffect, useRef, useMemo } from "react";
import apiClient from "../../../api/axiosConfig";
import { Save, Upload } from "lucide-react";
import {
  LayoutDashboard,
  Laptop,
  Users,
  ShoppingCart,
  Tag,
  Monitor,
  Target,
  LogOut,
  Menu,
  X,
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  User,
  Mail,
  Shield,
  Activity,
} from "lucide-react";
import useGenericApi from "hooks/useGenericApi";
const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingStatus, setEditingStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const formatOrderId = (id) => {
    if (!id) return "#N/A";
    return `#ORD${String(id).padStart(3, "0")}`;
  };
  // Định nghĩa thứ tự quy trình và nhãn hiển thị TRẠNG THÁI ĐƠN HÀNG
  const STATUS_STEPS = [
    { value: "PENDING", label: "Chờ xác nhận", step: 0 },
    { value: "PROCESSING", label: "Đang xử lý", step: 1 },
    { value: "SHIPPING", label: "Đang giao", step: 2 },
    { value: "COMPLETED", label: "Đã giao", step: 3 },
    { value: "CANCELLED", label: "Đã hủy", step: 4 }, // Cancelled là trường hợp đặc biệt
  ];

  // Hàm kiểm tra xem option có nên bị khóa không
  const isOptionDisabled = (optionValue, currentStatus) => {
    // 1. Nếu đơn hàng đã Hoàn tất hoặc Đã hủy -> Khóa tất cả, không cho sửa gì nữa
    if (currentStatus === "COMPLETED" || currentStatus === "CANCELLED") {
      return true;
    }

    // 2. Lấy số thứ tự (step) của trạng thái hiện tại và trạng thái trong option
    const currentStepObj = STATUS_STEPS.find((s) => s.value === currentStatus);
    const optionStepObj = STATUS_STEPS.find((s) => s.value === optionValue);

    if (!currentStepObj || !optionStepObj) return false;

    // 3. Logic chặn quay lui:
    // Nếu option là 'CANCELLED', luôn cho phép (trừ khi đã Completed ở rule 1)
    if (optionValue === "CANCELLED") return false;

    // Nếu step của option nhỏ hơn step hiện tại -> KHÓA
    // Ví dụ: Hiện tại là SHIPPING (2), option là PENDING (0) -> 0 < 2 -> True (Disabled)
    return optionStepObj.step < currentStepObj.step;
  };
  const translateStatus = (status) => {
    if (!status) return "Không rõ";
    const map = {
      PENDING: "Chờ xác nhận",
      PROCESSING: "Đang xử lý",
      SHIPPING: "Đang giao",
      COMPLETED: "Đã giao",
      CANCELLED: "Đã hủy",
      CONFIRMED: "Đã xác nhận",
    };
    return map[status.toUpperCase()] || status;
  };

  const getStatusClass = (status) => {
    if (!status) return "secondary";
    const statusUpper = status.toUpperCase();
    const statusMap = {
      COMPLETED: "success",
      SHIPPING: "info",
      PROCESSING: "primary",
      PENDING: "warning",
      CANCELLED: "danger",
    };
    return `badge--${statusMap[statusUpper] || "secondary"}`;
  };

  useEffect(() => {
    fetchOrders();
    setCurrentPage(1);
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = `/orders/admin?status=${statusFilter}`;
      const res = await apiClient.get(url);

      if (Array.isArray(res.data)) {
        const sortedOrders = res.data.sort((a, b) => b.id - a.id);
        setOrders(sortedOrders);
      } else {
        setOrders([]);
        setError("Dữ liệu không hợp lệ");
      }
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
      setError("Không thể tải đơn hàng");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrderDetail = async (orderId) => {
    try {
      const res = await apiClient.get(`/orders/${orderId}`);
      setSelectedOrder(res.data);
      setEditingStatus(res.data.status);
      setShowDetailModal(true);
    } catch (err) {
      alert("Lỗi tải chi tiết đơn hàng");
    }
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    try {
      await apiClient.put(`/orders/${selectedOrder.id}/status`, null, {
        params: { status: editingStatus },
      });

      alert("Cập nhật trạng thái thành công!");
      fetchOrders();
      handleCloseDetailModal();
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại!");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  if (loading && !showDetailModal)
    return (
      <div className="loading" style={{ padding: "20px", textAlign: "center" }}>
        Đang tải...
      </div>
    );
  if (error)
    return (
      <div className="error" style={{ padding: "20px", color: "red" }}>
        Lỗi: {error}
      </div>
    );

  return (
    <div className="page-card">
      <div className="page-card__header">
        <h3 className="page-card__title">Danh sách đơn hàng</h3>
        <select
          className="select-input"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ xác nhận</option>
          <option value="processing">Đang xử lý</option>
          <option value="shipping">Đang giao</option>
          <option value="completed">Đã giao</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      <div className="table-container">
        {orders.length === 0 ? (
          <div
            className="no-data"
            style={{ padding: "20px", textAlign: "center" }}
          >
            Chưa có đơn hàng nào.
          </div>
        ) : (
          <>
            {/* 👇 1. THÊM table-layout: fixed ĐỂ CỐ ĐỊNH CỘT */}
            <table
              className="data-table"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                tableLayout: "fixed",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f4f4f4",
                    height: "50px",
                    textAlign: "left",
                  }}
                >
                  <th style={{ width: "100px", padding: "10px" }}>Mã đơn</th>
                  {/* 👇 2. SỬA Ở ĐÂY: Đổi minWidth thành width cố định (160px) */}
                  <th style={{ width: "160px", padding: "10px" }}>
                    Khách hàng
                  </th>
                  <th style={{ width: "120px", padding: "10px" }}>Ngày tạo</th>
                  <th style={{ width: "120px", padding: "10px" }}>Tổng tiền</th>
                  <th style={{ width: "130px", padding: "10px" }}>
                    Trạng thái
                  </th>
                  <th style={{ width: "100px", padding: "10px" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr
                    key={order.id}
                    style={{ height: "60px", borderBottom: "1px solid #eee" }}
                  >
                    <td className="font-medium" style={{ padding: "10px" }}>
                      {formatOrderId(order.id)}
                    </td>

                    {/* 👇 3. Cắt ngắn tên khách hàng nếu quá dài */}
                    <td
                      style={{
                        padding: "10px",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <div style={{ fontWeight: 500 }}>
                        {order.customerName}
                      </div>
                      <small className="text-muted" style={{ color: "#666" }}>
                        {order.phone}
                      </small>
                    </td>
                    <td style={{ padding: "10px" }}>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("vi-VN")
                        : "-"}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        fontWeight: "bold",
                        color: "#d70018",
                      }}
                    >
                      {order.totalAmount?.toLocaleString("vi-VN")}đ
                    </td>
                    <td style={{ padding: "10px" }}>
                      <span className={`badge ${getStatusClass(order.status)}`}>
                        {translateStatus(order.status)}
                      </span>
                    </td>
                    <td style={{ padding: "10px" }}>
                      <button
                        className="link-btn"
                        onClick={() => handleViewOrderDetail(order.id)}
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div
                className="pagination-controls"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "15px",
                  padding: "20px",
                }}
              >
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  style={{
                    padding: "5px 10px",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    opacity: currentPage === 1 ? 0.5 : 1,
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    background: "#fff",
                  }}
                >
                  <ChevronLeft size={20} />
                </button>

                <span style={{ fontSize: "14px", fontWeight: "600" }}>
                  Trang {currentPage} / {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  style={{
                    padding: "5px 10px",
                    cursor:
                      currentPage === totalPages ? "not-allowed" : "pointer",
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    background: "#fff",
                  }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showDetailModal && selectedOrder && (
        <div className="modal-overlay" onClick={handleCloseDetailModal}>
          <div
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "800px", width: "90%" }}
          >
            <div
              className="modal-header"
              style={{
                borderBottom: "1px solid #eee",
                paddingBottom: "15px",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ margin: 0 }}>
                Chi tiết đơn hàng {formatOrderId(selectedOrder.id)}
              </h2>
              <button
                className="close-btn"
                onClick={handleCloseDetailModal}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div
              className="modal-body"
              style={{ maxHeight: "70vh", overflowY: "auto" }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ flex: 1, minWidth: "300px" }}>
                  <h4 style={{ marginBottom: "10px", color: "#555" }}>
                    Thông tin giao hàng
                  </h4>
                  <p style={{ marginBottom: "5px" }}>
                    <strong>Người nhận:</strong> {selectedOrder.customerName}
                  </p>
                  <p style={{ marginBottom: "5px" }}>
                    <strong>SĐT:</strong> {selectedOrder.phone}
                  </p>
                  <p style={{ marginBottom: "5px" }}>
                    <strong>Địa chỉ:</strong> {selectedOrder.shippingAddress}
                  </p>
                  {selectedOrder.note && (
                    <p style={{ marginBottom: "5px" }}>
                      <strong>Ghi chú:</strong> {selectedOrder.note}
                    </p>
                  )}
                </div>

                <div className="status-update-box">
                  <h4>Cập nhật trạng thái</h4>
                  {/* 👇 PHẦN CHỌN TRẠNG THÁI VÀ NÚT LƯU */}
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <select
                      className="modal-select"
                      value={editingStatus}
                      onChange={(e) => setEditingStatus(e.target.value)}
                      style={{ flex: 1 }}
                      // Nếu đơn hàng đã xong/hủy thì disable luôn cả ô select
                      disabled={
                        selectedOrder.status === "COMPLETED" ||
                        selectedOrder.status === "CANCELLED"
                      }
                    >
                      {STATUS_STEPS.map((statusItem) => (
                        <option
                          key={statusItem.value}
                          value={statusItem.value}
                          // 👇 Gọi hàm kiểm tra logic để khóa dòng này
                          disabled={isOptionDisabled(
                            statusItem.value,
                            selectedOrder.status
                          )}
                          style={{
                            // (Tùy chọn) Làm xám màu chữ nếu bị disabled để dễ nhìn
                            color: isOptionDisabled(
                              statusItem.value,
                              selectedOrder.status
                            )
                              ? "#ccc"
                              : "#000",
                          }}
                        >
                          {statusItem.label}
                        </option>
                      ))}
                    </select>

                    <button
                      className="btn btn--primary"
                      onClick={handleUpdateStatus}
                      style={{ whiteSpace: "nowrap" }}
                      // Khóa nút Lưu nếu đơn hàng đã xong/hủy
                      disabled={
                        selectedOrder.status === "COMPLETED" ||
                        selectedOrder.status === "CANCELLED"
                      }
                    >
                      <Save size={16} /> Lưu
                    </button>
                  </div>

                  <p
                    style={{
                      marginTop: "15px",
                      fontSize: "0.9em",
                      color: "#666",
                    }}
                  >
                    <strong>Ngày đặt:</strong>{" "}
                    {new Date(selectedOrder.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>

              <h4 style={{ marginBottom: "10px", color: "#555" }}>Sản phẩm</h4>
              <table
                className="data-table"
                style={{
                  width: "100%",
                  border: "1px solid #eee",
                  tableLayout: "fixed",
                }}
              >
                <thead style={{ background: "#f3f4f6" }}>
                  <tr>
                    <th style={{ padding: "10px" }}>Sản phẩm</th>
                    <th style={{ padding: "10px", width: "120px" }}>Đơn giá</th>
                    <th style={{ padding: "10px", width: "60px" }}>SL</th>
                    <th
                      style={{
                        padding: "10px",
                        width: "120px",
                        textAlign: "right",
                      }}
                    >
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item, index) => (
                    <tr
                      key={index}
                      style={{ borderBottom: "1px solid #eee", height: "60px" }}
                    >
                      <td
                        style={{
                          padding: "10px",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={
                              item.imageUrl
                                ? item.imageUrl.startsWith("http")
                                  ? item.imageUrl
                                  : `http://localhost:8080${item.imageUrl}`
                                : "https://via.placeholder.com/50"
                            }
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "4px",
                              border: "1px solid #ddd",
                            }}
                          />
                        </div>
                        <span
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={item.productName}
                        >
                          {item.productName}
                        </span>
                      </td>
                      <td style={{ padding: "10px" }}>
                        {item.price?.toLocaleString("vi-VN")}đ
                      </td>
                      <td style={{ padding: "10px" }}>x{item.quantity}</td>
                      <td
                        style={{
                          padding: "10px",
                          textAlign: "right",
                          fontWeight: "bold",
                        }}
                      >
                        {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div
                style={{
                  marginTop: "20px",
                  textAlign: "right",
                  fontSize: "1.2rem",
                }}
              >
                Tổng cộng:{" "}
                <span style={{ color: "#d32f2f", fontWeight: "bold" }}>
                  {selectedOrder.totalAmount?.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>

            <div
              className="modal-actions"
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button className="btn-cancel" onClick={handleCloseDetailModal}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default OrdersPage;