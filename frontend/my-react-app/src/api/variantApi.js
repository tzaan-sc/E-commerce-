import apiClient from "./axiosConfig";

const variantApi = {
  // Lấy tất cả (Dùng cho trang Kho)
  getAll: () => {
    return apiClient.get("/admin/variants");
  },

  // Lấy danh sách biến thể của 1 sản phẩm (Dùng cho Popup này)
  getByProduct: (productId) => {
    return apiClient.get(`/admin/variants/product/${productId}`);
  },

  // Thêm mới hoặc Cập nhật
  save: (data) => {
    return apiClient.post("/admin/variants", data);
  },

  // Xóa biến thể
  delete: (id) => {
    return apiClient.delete(`/admin/variants/${id}`);
  }
};

export default variantApi;