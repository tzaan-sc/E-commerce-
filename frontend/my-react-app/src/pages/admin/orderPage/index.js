// src/pages/admin/ordersPage/index.js
import React, { useState, useEffect } from "react";
import apiClient from "../../../api/axiosConfig"; // Sửa lại đường dẫn nếu cần
import OrderList from "./OrderList";
import OrderDetailModal from "./OrderDetailModal";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
      setShowDetailModal(true);
    } catch (err) {
      alert("Lỗi tải chi tiết đơn hàng");
    }
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await apiClient.put(`/orders/${orderId}/status`, null, {
        params: { status: newStatus },
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

  if (loading && !showDetailModal) {
    return <div className="loading" style={{ padding: "20px", textAlign: "center" }}>Đang tải...</div>;
  }

  if (error) {
    return <div className="error" style={{ padding: "20px", color: "red" }}>Lỗi: {error}</div>;
  }

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
          <option value="delivered">Đã giao</option>
          <option value="completed">Hoàn thành</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      <div className="table-container">
        <OrderList
          orders={currentOrders}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onViewDetail={handleViewOrderDetail}
        />
      </div>

      {showDetailModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={handleCloseDetailModal}
          onSaveStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default OrdersPage;