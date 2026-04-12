import axiosClient from "./axiosClient";

/**
 * Lấy danh sách biến thể theo ID sản phẩm
 * @param {number|string} productId - ID của sản phẩm (VD: 1, 2...)
 * @returns {Promise<Array>} - Mảng các biến thể (RAM, Color, Price...)
 */
export const getVariantsByProductId = async (productId) => {
  try {
    const data = await axiosClient.get(`/variants/product/${productId}`);
    return data;
  } catch (error) {
    console.error(`Lỗi khi lấy biến thể cho sản phẩm ID ${productId}:`, error);
    return [];
  }
};

/**
 * (Tùy chọn) Lấy chi tiết 1 biến thể cụ thể theo ID biến thể
 */
export const getVariantById = async (variantId) => {
  try {
    const data = await axiosClient.get(`/variants/${variantId}`);
    return data;
  } catch (error) {
    console.error("Lỗi lấy chi tiết biến thể:", error);
    return null;
  }
};

const variantApi = {
    getVariantsByProductId,
    getVariantById
};

export default variantApi;
