import apiClient from "./axiosConfig";

const inventoryApi = {
  // 1. Nhập kho
  importGoods: (data) => {
    return apiClient.post("/admin/inventory/import", data);
  },

  // 2. Lấy lịch sử giao dịch (Thẻ kho)
  getHistory: (variantId) => {
    return apiClient.get(`/admin/inventory/history/${variantId}`);
  },

  // 3. Kiểm kê / Điều chỉnh kho
  adjustStock: (data) => {
    // data = { variantId, actualQuantity, reason }
    return apiClient.post("/admin/inventory/adjust", data);
  }
};

export default inventoryApi;