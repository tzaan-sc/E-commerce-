import apiClient from "./axiosConfig";

// Lấy tất cả đơn hàng của user đã đăng nhập
export const getMyOrders = () => apiClient.get("/orders");
export const cancelOrder = (orderId) => 
  apiClient.patch(`/orders/${orderId}/cancel`);
// (Trong tương lai bạn có thể thêm các hàm khác như lấy chi tiết 1 đơn hàng)
// export const getOrderById = (id) => apiClient.get(`/orders/${id}`);
export const getOrderDetail = (orderId) => 
  apiClient.get(`/orders/${orderId}`);
// Xác nhận đã nhận hàng (DELIVERED → COMPLETED)
export const confirmReceived = (orderId) => 
  apiClient.put(`/orders/${orderId}/confirm-received`);
// Xác nhận thanh toán VIETQR (PENDING -> CONFIRMED)
export const confirmPayment = (orderId) => 
  apiClient.put(`/orders/${orderId}/confirm-payment`);