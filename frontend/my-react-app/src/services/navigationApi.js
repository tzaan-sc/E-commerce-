// import axios from "axios";

// // Cấu hình base URL cho API
// const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

// // Tạo axios instance với cấu hình mặc định
// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000, // 10 giây
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Interceptor để xử lý lỗi toàn cục
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error("API Error:", error.response?.data || error.message);
//     return Promise.reject(error);
//   }
// );

// /**
//  * Lấy cấu trúc menu chính (cho user chưa đăng nhập)
//  * @returns {Promise<Array>} Danh sách menu
//  */
// export const getMainMenu = async () => {
//   try {
//     const response = await apiClient.get("/navigation/main");
//     return response.data;
//   } catch (error) {
//     console.error("Không thể tải menu:", error);
//     throw error;
//   }
// };

// /**
//  * Lấy cấu trúc menu cho customer đã đăng nhập
//  * @returns {Promise<Array>} Danh sách menu
//  */
// export const getCustomerMenu = async () => {
//   try {
//     const response = await apiClient.get("/navigation/customer");
//     return response.data;
//   } catch (error) {
//     console.error("Không thể tải customer menu:", error);
//     throw error;
//   }
// };

// /**
//  * Menu mặc định khi API lỗi
//  */
// export const DEFAULT_MENU = [
//   {
//     name: "Trang chủ",
//     path: "/",
//     child: null,
//   },
//   {
//     name: "Laptop",
//     path: "/laptop",
//     child: [
//       {
//         name: "Thương hiệu",
//         subchild: [
//           { name: "Dell", path: "/laptop?brand=1" },
//           { name: "HP", path: "/laptop?brand=2" },
//           { name: "Asus", path: "/laptop?brand=3" },
//           { name: "Lenovo", path: "/laptop?brand=4" },
//         ],
//       },
//       {
//         name: "Nhu cầu sử dụng",
//         subchild: [
//           { name: "Gaming", path: "/laptop?usage=1" },
//           { name: "Văn phòng", path: "/laptop?usage=2" },
//           { name: "Thiết kế - Kĩ thuật", path: "/laptop?usage=3" },
//           { name: "Học tập", path: "/laptop?usage=4" },
//         ],
//       },
//       {
//         name: "Kích thước màn hình",
//         subchild: [
//           { name: "13-14 inch", path: "/laptop?size=1" },
//           { name: "15-16 inch", path: "/laptop?size=2" },
//           { name: "17 inch trở lên", path: "/laptop?size=3" },
//         ],
//       },
//     ],
//   },
//   {
//     name: "Tài khoản",
//     path: null,
//     child: [
//       { name: "Đăng nhập", path: "/dang-nhap" },
//       { name: "Đăng ký", path: "/dang-ky" },
//     ],
//   },
// ];

// /**
//  * Menu mặc định cho customer khi API lỗi
//  */
// export const DEFAULT_CUSTOMER_MENU = [
//   {
//     name: "Trang chủ",
//     path: "/customer/home",
//     child: null,
//   },
//   {
//     name: "Laptop",
//     path: "/customer/laptop",
//     child: [
//       {
//         name: "Thương hiệu",
//         subchild: [
//           { name: "Dell", path: "/customer/laptop?brand=1" },
//           { name: "HP", path: "/customer/laptop?brand=2" },
//           { name: "Asus", path: "/customer/laptop?brand=3" },
//           { name: "Lenovo", path: "/customer/laptop?brand=4" },
//         ],
//       },
//       {
//         name: "Nhu cầu sử dụng",
//         subchild: [
//           { name: "Gaming", path: "/customer/laptop?usage=1" },
//           { name: "Văn phòng", path: "/customer/laptop?usage=2" },
//           { name: "Thiết kế - Kĩ thuật", path: "/customer/laptop?usage=3" },
//           { name: "Học tập", path: "/customer/laptop?usage=4" },
//         ],
//       },
//       {
//         name: "Kích thước màn hình",
//         subchild: [
//           { name: "13-14 inch", path: "/customer/laptop?size=1" },
//           { name: "15-16 inch", path: "/customer/laptop?size=2" },
//           { name: "17 inch trở lên", path: "/customer/laptop?size=3" },
//         ],
//       },
//     ],
//   },
//   {
//     name: "Tài khoản",
//     path: null,
//     child: [
//       { name: "Thông tin tài khoản", path: "/customer/thong-tin-ca-nhan" },
//       { name: "Đơn mua", path: "/customer/don-mua" },
//       { name: "Đăng xuất", path: "/" },
//     ],
//   },
// ];

// export default {
//   getMainMenu,
//   getCustomerMenu,
//   DEFAULT_MENU,
//   DEFAULT_CUSTOMER_MENU,
// };
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
          { id: 7, name: "Apple", path: "/brand/7" },
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
      {
        name: "KÍCH THƯỚC MÀN HÌNH",
        subchild: [
          { name: "13-14 inch", path: "#" },
          { name: "15-16 inch", path: "#" },
          { name: "17 inch trở lên", path: "#" },
        ],
      },
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
          { id: 7, name: "Apple", path: "/customer/home/brand/7" },
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
      {
        name: "KÍCH THƯỚC MÀN HÌNH",
        subchild: [
          { name: "13-14 inch", path: "#" },
          { name: "15-16 inch", path: "#" },
          { name: "17 inch trở lên", path: "#" },
        ],
      },
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