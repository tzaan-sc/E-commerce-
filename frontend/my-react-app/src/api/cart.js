import apiClient from "./axiosConfig";

const API_URL = "/cart";

export const getCart = () => apiClient.get(API_URL);

export const addToCart = (productId, quantity = 1) =>
  apiClient.post(`${API_URL}/add`, null, { params: { productId, quantity } });

export const checkoutSelected = (cartItemIds) =>
  apiClient.post(`${API_URL}/checkout-selected`, cartItemIds);

// --- THÊM 2 HÀM NÀY ---

// cartItemId là ID của CartItem (ví dụ: 1, 2, 3), không phải productId
export const updateQuantity = (cartItemId, quantity) =>
  apiClient.put(`${API_URL}/update/${cartItemId}`, null, { params: { quantity } });

export const removeItem = (cartItemId) =>
  apiClient.delete(`${API_URL}/remove/${cartItemId}`);
export const removeItems = (cartItemIds) =>
  apiClient.post(`${API_URL}/remove-batch`, cartItemIds);