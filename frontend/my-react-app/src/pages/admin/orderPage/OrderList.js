// src/pages/admin/ordersPage/OrderList.js
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatOrderId, getStatusClass, translateStatus } from "./utils/constants";

const OrderList = ({ orders, currentPage, totalPages, onPageChange, onViewDetail }) => {
  if (orders.length === 0) {
    return <div className="no-data" style={{ padding: "20px", textAlign: "center" }}>Chưa có đơn hàng nào.</div>;
  }

  return (
    <>
      <table className="data-table" style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        <thead>
          <tr style={{ background: "#f4f4f4", height: "50px", textAlign: "left" }}>
            <th style={{ width: "100px", padding: "10px" }}>Mã đơn</th>
            <th style={{ width: "160px", padding: "10px" }}>Khách hàng</th>
            <th style={{ width: "120px", padding: "10px" }}>Ngày tạo</th>
            <th style={{ width: "120px", padding: "10px" }}>Tổng tiền</th>
            <th style={{ width: "130px", padding: "10px" }}>Trạng thái</th>
            <th style={{ width: "100px", padding: "10px" }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} style={{ height: "60px", borderBottom: "1px solid #eee" }}>
              <td className="font-medium" style={{ padding: "10px" }}>{formatOrderId(order.id)}</td>
              <td style={{ padding: "10px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                <div style={{ fontWeight: 500 }}>{order.customerName}</div>
                <small className="text-muted" style={{ color: "#666" }}>{order.phone}</small>
              </td>
              <td style={{ padding: "10px" }}>
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString("vi-VN") : "-"}
              </td>
              <td style={{ padding: "10px", fontWeight: "bold", color: "#d70018" }}>
                {order.totalAmount?.toLocaleString("vi-VN")}đ
              </td>
              <td style={{ padding: "10px" }}>
                <span className={`badge ${getStatusClass(order.status)}`}>
                  {translateStatus(order.status)}
                </span>
              </td>
              <td style={{ padding: "10px" }}>
                <button className="link-btn" onClick={() => onViewDetail(order.id)}>
                  Chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination-controls" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", padding: "20px" }}>
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            style={{
              padding: "5px 10px", cursor: currentPage === 1 ? "not-allowed" : "pointer",
              opacity: currentPage === 1 ? 0.5 : 1, border: "1px solid #ddd", borderRadius: "4px", background: "#fff",
            }}
          >
            <ChevronLeft size={20} />
          </button>
          <span style={{ fontSize: "14px", fontWeight: "600" }}>Trang {currentPage} / {totalPages}</span>
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              padding: "5px 10px", cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              opacity: currentPage === totalPages ? 0.5 : 1, border: "1px solid #ddd", borderRadius: "4px", background: "#fff",
            }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </>
  );
};

export default OrderList;
