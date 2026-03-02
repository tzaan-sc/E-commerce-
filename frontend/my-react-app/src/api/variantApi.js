import apiClient from "./axiosConfig";

const variantApi = {
  // 1. Lấy tất cả
  // Cũ: /admin/variants -> Mới: /variants
  getAll: () => {
    return apiClient.get("/variants"); 
  },

  // 2. Lấy danh sách biến thể của 1 sản phẩm (Quan trọng cho trang chi tiết)
  // Cũ: /admin/variants/product/... -> Mới: /variants/product/...
  getByProduct: (productId) => {
    return apiClient.get(`/variants/product/${productId}`);
  },

  // 3. Thêm mới hoặc Cập nhật
  save: (data) => {
    return apiClient.post("/variants", data);
  },

  // 4. Xóa biến thể
  delete: (id) => {
    return apiClient.delete(`/variants/${id}`);
  }
};

export default variantApi;