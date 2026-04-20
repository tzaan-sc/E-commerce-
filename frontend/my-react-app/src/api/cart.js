import apiClient from "./axiosConfig";

const API_URL = "/cart";

export const getCart = () => apiClient.get(API_URL);

export const addToCart = (productId, variantId, quantity = 1) =>
  apiClient.post(`${API_URL}/add`, null, { 
    params: { 
        productId, 
        variantId, 
        quantity 
    } 
  });

export const checkoutSelected = (selectedIds, formData) => {
  // Đảm bảo selectedIds là mảng số thực thụ
  const payload = {
    selectedItemIds: Array.isArray(selectedIds) ? selectedIds : [], 
    note: formData.note || "",
    address: formData.address || "",
    phone: formData.phone || "",
    fullName: formData.fullName || "",
    paymentMethod: formData.paymentMethod || "COD"
  };

  // 🔥 Log ra để kiểm tra trước khi gửi
  console.log("Gửi yêu cầu POST thanh toán với payload:", payload);

  return apiClient.post(`${API_URL}/checkout-selected`, payload);
};

export const updateQuantity = (cartItemId, quantity) =>
  apiClient.put(`${API_URL}/update/${cartItemId}`, null, { params: { quantity } });

export const removeItem = (cartItemId) =>
  apiClient.delete(`${API_URL}/remove/${cartItemId}`);

export const removeItems = (cartItemIds) =>
  apiClient.post(`${API_URL}/remove-batch`, cartItemIds);