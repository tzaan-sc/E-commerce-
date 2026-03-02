import axios from "axios";

// Cấu hình đường dẫn API gốc
// Nếu bạn đã cấu hình biến môi trường thì dùng process.env, nếu không thì dùng cứng localhost
const API_BASE_URL = "http://localhost:8080/api/variants";

/**
 * Lấy danh sách biến thể theo ID sản phẩm
 * @param {number|string} productId - ID của sản phẩm (VD: 1, 2...)
 * @returns {Promise<Array>} - Mảng các biến thể (RAM, Color, Price...)
 */
export const getVariantsByProductId = async (productId) => {
  try {
    // Gọi API: GET http://localhost:8080/api/variants/product/{id}
    const response = await axios.get(`${API_BASE_URL}/product/${productId}`);
    
    // Trả về dữ liệu (mảng các ProductVariantDTO)
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy biến thể cho sản phẩm ID ${productId}:`, error);
    // Trả về mảng rỗng để giao diện không bị lỗi crash khi map()
    return [];
  }
};

/**
 * (Tùy chọn) Lấy chi tiết 1 biến thể cụ thể theo ID biến thể
 * Dùng khi cần check lại tồn kho chính xác trước khi Add to Cart
 */
export const getVariantById = async (variantId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${variantId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy chi tiết biến thể:", error);
    return null;
  }
};

// Xuất mặc định object (nếu bạn thích import kiểu import variantApi from...)
const variantApi = {
    getVariantsByProductId,
    getVariantById
};

export default variantApi;