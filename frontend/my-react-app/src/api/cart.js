import apiClient from "./axiosConfig";

const API_URL = "/cart";

export const getCart = () => apiClient.get(API_URL);

export const addToCart = (productId, quantity = 1) =>
  apiClient.post(`${API_URL}/add`, null, { params: { productId, quantity } });

// 👇 ĐÃ SỬA: Hàm này giờ nhận 2 tham số để khớp với Backend mới
export const checkoutSelected = (selectedIds, formData) => {
  // Tạo payload khớp với DTO CheckoutRequest trong Java
  const payload = {
    selectedItemIds: selectedIds,  // List ID sản phẩm
    note: formData.note,           // Ghi chú
    address: formData.address,     // Địa chỉ giao hàng
    phone: formData.phone,         // Số điện thoại
    fullName: formData.fullName    // Tên người nhận
  };

  return apiClient.post(`${API_URL}/checkout-selected`, payload);
};

// --- CÁC HÀM KHÁC GIỮ NGUYÊN ---

// cartItemId là ID của CartItem (ví dụ: 1, 2, 3), không phải productId
export const updateQuantity = (cartItemId, quantity) =>
  apiClient.put(`${API_URL}/update/${cartItemId}`, null, { params: { quantity } });

export const removeItem = (cartItemId) =>
  apiClient.delete(`${API_URL}/remove/${cartItemId}`);

export const removeItems = (cartItemIds) =>
  apiClient.post(`${API_URL}/remove-batch`, cartItemIds);
