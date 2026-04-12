// src/pages/admin/ordersPage/OrderDetailModal.js
import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { formatOrderId, STATUS_STEPS, isOptionDisabled } from "./utils/constants";

const OrderDetailModal = ({ order, onClose, onSaveStatus }) => {
  const [editingStatus, setEditingStatus] = useState(order.status);

  useEffect(() => {
    setEditingStatus(order.status);
  }, [order]);

  const handleSave = () => {
    onSaveStatus(order.id, editingStatus);
  };

  const isLocked = order.status === "COMPLETED" || order.status === "CANCELLED";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "800px", width: "90%" }}
      >
        <div
          className="modal-header"
          style={{ borderBottom: "1px solid #eee", paddingBottom: "15px", marginBottom: "20px" }}
        >
          <h2 style={{ margin: 0 }}>Chi tiết đơn hàng {formatOrderId(order.id)}</h2>
          <button
            className="close-btn"
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <X size={24} />
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "20px" }}>
            <div style={{ flex: 1, minWidth: "300px" }}>
              <h4 style={{ marginBottom: "10px", color: "#555" }}>Thông tin giao hàng</h4>
              <p style={{ marginBottom: "5px" }}><strong>Người nhận:</strong> {order.customerName}</p>
              <p style={{ marginBottom: "5px" }}><strong>SĐT:</strong> {order.phone}</p>
              <p style={{ marginBottom: "5px" }}><strong>Địa chỉ:</strong> {order.shippingAddress}</p>
              {order.note && (
                <p style={{ marginBottom: "5px" }}><strong>Ghi chú:</strong> {order.note}</p>
              )}
            </div>

            <div className="status-update-box">
              <h4>Cập nhật trạng thái</h4>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <select
                  className="modal-select"
                  value={editingStatus}
                  onChange={(e) => setEditingStatus(e.target.value)}
                  style={{ flex: 1 }}
                  disabled={isLocked}
                >
                  {STATUS_STEPS.map((statusItem) => (
                    <option
                      key={statusItem.value}
                      value={statusItem.value}
                      disabled={isOptionDisabled(statusItem.value, order.status)}
                      style={{ color: isOptionDisabled(statusItem.value, order.status) ? "#ccc" : "#000" }}
                    >
                      {statusItem.label}
                    </option>
                  ))}
                </select>

                <button
                  className="btn btn--primary"
                  onClick={handleSave}
                  style={{ whiteSpace: "nowrap" }}
                  disabled={isLocked}
                >
                  <Save size={16} /> Lưu
                </button>
              </div>

              <p style={{ marginTop: "15px", fontSize: "0.9em", color: "#666" }}>
                <strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleString("vi-VN")}
              </p>
            </div>
          </div>

          <h4 style={{ marginBottom: "10px", color: "#555" }}>Sản phẩm</h4>
          <table className="data-table" style={{ width: "100%", border: "1px solid #eee", tableLayout: "fixed" }}>
            <thead style={{ background: "#f3f4f6" }}>
              <tr>
                <th style={{ padding: "10px" }}>Sản phẩm</th>
                <th style={{ padding: "10px", width: "120px" }}>Đơn giá</th>
                <th style={{ padding: "10px", width: "60px" }}>SL</th>
                <th style={{ padding: "10px", width: "120px", textAlign: "right" }}>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #eee", height: "60px" }}>
                  <td style={{ padding: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "40px", height: "40px", flexShrink: 0 }}>
                      <img
                        src={
                          item.imageUrl
                            ? item.imageUrl.startsWith("http")
                              ? item.imageUrl
                              : `http://localhost:8080${item.imageUrl}`
                            : "https://via.placeholder.com/50"
                        }
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px", border: "1px solid #ddd" }}
                      />
                    </div>
                    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={item.productName}>
                      {item.productName}
                    </span>
                  </td>
                  <td style={{ padding: "10px" }}>{item.price?.toLocaleString("vi-VN")}đ</td>
                  <td style={{ padding: "10px" }}>x{item.quantity}</td>
                  <td style={{ padding: "10px", textAlign: "right", fontWeight: "bold" }}>
                    {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: "20px", textAlign: "right", fontSize: "1.2rem" }}>
            Tổng cộng: <span style={{ color: "#d32f2f", fontWeight: "bold" }}>{order.totalAmount?.toLocaleString("vi-VN")}đ</span>
          </div>
        </div>

        <div className="modal-actions" style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
          <button className="btn-cancel" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
