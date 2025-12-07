import axios from "axios";

// Cấu hình base URL cho API
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

// Tạo axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Lấy cấu trúc menu chính (cho user chưa đăng nhập)
 */
export const getMainMenu = async () => {
  try {
    const response = await apiClient.get("/navigation/main");
    return response.data;
  } catch (error) {
    console.error("Không thể tải menu:", error);
    throw error;
  }
};

/**
 * Lấy cấu trúc menu cho customer đã đăng nhập
 */
export const getCustomerMenu = async () => {
  try {
    const response = await apiClient.get("/navigation/customer");
    return response.data;
  } catch (error) {
    console.error("Không thể tải customer menu:", error);
    throw error;
  }
};

/**
 * Menu mặc định (Cho Khách vãng lai)
 */
export const DEFAULT_MENU = [
  {
    name: "Trang chủ",
    path: "/",
    child: null,
  },
  {
    name: "Laptop",
    path: "/laptop",
    child: [
      {
        name: "THƯƠNG HIỆU",
        subchild: [
          { id: 1, name: "Asus", path: "/brand/1" },
          { id: 2, name: "Dell", path: "/brand/2" },
          { id: 3, name: "HP", path: "/brand/3" },
          { id: 4, name: "Lenovo", path: "/brand/4" },
          { id: 5, name: "Acer", path: "/brand/5" },
          { id: 6, name: "MSI", path: "/brand/6" },
          { id: 7, name: "Mac book", path: "/brand/7" },
        ],
      },
      {
        name: "NHU CẦU SỬ DỤNG",
        subchild: [
          { id: 1, name: "Gaming", path: "/usage-purpose/1" },
          { id: 2, name: "Văn phòng", path: "/usage-purpose/2" },
          { id: 3, name: "Thiết kế - Kĩ thuật", path: "/usage-purpose/3" },
          { id: 4, name: "Học tập", path: "/usage-purpose/4" },
        ],
      },
      // 👇👇👇 ĐÃ CẬP NHẬT ID CHO KÍCH THƯỚC MÀN HÌNH 👇👇👇
      {
        name: "KÍCH THƯỚC MÀN HÌNH",
        subchild: [
          { id: 1, name: "13.3 inch", path: "#" },
          { id: 2, name: "14.0 inch", path: "#" },
          { id: 3, name: "14.2 inch", path: "#" },
          { id: 4, name: "15.3 inch", path: "#" },
          { id: 5, name: "15.6 inch", path: "#" },
          { id: 6, name: "16.0 inch", path: "#" },
          { id: 7, name: "17.3 inch", path: "#" },
        ],
      },
      // 👆👆👆 --------------------------------------- 👆👆👆
    ],
  },
  {
    name: "Tài khoản",
    path: null,
    child: [
      { name: "Đăng nhập", path: "/dang-nhap" },
      { name: "Đăng ký", path: "/dang-ky" },
    ],
  },
];

/**
 * Menu mặc định (Cho Customer đã đăng nhập)
 */
export const DEFAULT_CUSTOMER_MENU = [
  {
    name: "Trang chủ",
    path: "/customer/home",
    child: null,
  },
  {
    name: "Laptop",
    path: "/customer/home/laptop",
    child: [
      {
        name: "THƯƠNG HIỆU",
        subchild: [
          { id: 1, name: "Asus", path: "/customer/home/brand/1" },
          { id: 2, name: "Dell", path: "/customer/home/brand/2" },
          { id: 3, name: "HP", path: "/customer/home/brand/3" },
          { id: 4, name: "Lenovo", path: "/customer/home/brand/4" },
          { id: 5, name: "Acer", path: "/customer/home/brand/5" },
          { id: 6, name: "MSI", path: "/customer/home/brand/6" },
          { id: 7, name: "Mac book", path: "/customer/home/brand/7" },
        ],
      },
      {
        name: "NHU CẦU SỬ DỤNG",
        subchild: [
          { id: 1, name: "Gaming", path: "/customer/home/usage-purpose/1" },
          { id: 2, name: "Văn phòng", path: "/customer/home/usage-purpose/2" },
          { id: 3, name: "Thiết kế - Kĩ thuật", path: "/customer/home/usage-purpose/3" },
          { id: 4, name: "Học tập", path: "/customer/home/usage-purpose/4" },
        ],
      },
      // 👇👇👇 ĐÃ CẬP NHẬT ID CHO CUSTOMER MENU 👇👇👇
      {
        name: "KÍCH THƯỚC MÀN HÌNH",
        subchild: [
          { id: 1, name: "13.3 inch", path: "#" },
          { id: 2, name: "14.0 inch", path: "#" },
          { id: 3, name: "14.2 inch", path: "#" },
          { id: 4, name: "15.3 inch", path: "#" },
          { id: 5, name: "15.6 inch", path: "#" },
          { id: 6, name: "16.0 inch", path: "#" },
          { id: 7, name: "17.3 inch", path: "#" },
        ],
      },
      // 👆👆👆 --------------------------------- 👆👆👆
    ],
  },
  {
    name: "Tài khoản",
    path: null,
    child: [
      { name: "Thông tin tài khoản", path: "/customer/home/thong-tin-ca-nhan" },
      { name: "Đơn mua", path: "/customer/home/don-mua" },
      { name: "Giỏ hàng", path: "/customer/home/gio-hang" },
      { name: "Đăng xuất", path: "/" },
    ],
  },
];

export default {
  getMainMenu,
  getCustomerMenu,
  DEFAULT_MENU,
  DEFAULT_CUSTOMER_MENU,
};