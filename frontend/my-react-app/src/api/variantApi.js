import apiClient from "./axiosConfig";

const variantApi = {
  // Lấy TẤT CẢ biến thể (Dùng cho dropdown chọn hàng & hiển thị bảng tồn kho)
  // Backend cần có API trả về list variant (VD: GET /api/admin/variants)
  getAll: () => {
    return apiClient.get(`/admin/variants`); 
  }
};

export default variantApi;