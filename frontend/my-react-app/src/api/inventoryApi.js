import apiClient from "./axiosConfig"; 

const inventoryApi = {
  // 1. Nhập kho lẻ (Dùng cho Form nhập hàng thủ công)
  importGoods: (data) => {
    return apiClient.post("/admin/inventory/import", data);
  },

  // 2. Lấy lịch sử giao dịch (Thẻ kho)
  getHistory: (variantId) => {
    return apiClient.get(`/admin/inventory/history/${variantId}`);
  },

  // 3. Kiểm kê / Điều chỉnh kho (Blind Audit)
  adjustStock: (data) => {
    // data = { variantId, actualQuantity, reason }
    return apiClient.post("/admin/inventory/adjust", data);
  },

  // 4. Dry Run - Kiểm tra file Excel trước khi nhập (Chưa lưu DB)
  dryRunImport: (formData) => {
    return apiClient.post("/admin/inventory/import/dry-run", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // 5. Bulk Import - Lưu hàng loạt sau khi Admin đã duyệt Preview
  bulkImport: (items) => {
    return apiClient.post("/admin/inventory/import/bulk", items);
  },

  // ✅ CẬP NHẬT HÀM XUẤT FILE: Thêm tham số params
  // params có thể là: { type: 'SUMMARY' } hoặc { type: 'STOCK_CARD_SINGLE', variantId: 123 }
  exportReport: (params) => {
    return apiClient.get("/admin/inventory/export", {
      params: params, // Truyền tham số vào Query String (?type=...&variantId=...)
      responseType: "blob", // Bắt buộc phải có để xử lý file Excel nhị phân
    });
  }
};

export default inventoryApi;