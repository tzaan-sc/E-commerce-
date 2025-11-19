// src/utils/router.js
export const ROUTERS = {
  USER: {
    HOME: "/",                          // Trang chủ
    LAPTOP: "/laptop",                  // Danh sách laptop
    NOTIFICATION: "/thong-bao",         // Thông báo
    SUPPORT: "/ho-tro",                 // Hỗ trợ
    LOGIN: "/dang-nhap",                // Đăng nhập
    REGISTER: "/dang-ky",               // Đăng ký
    PRODUCTDETAIL: "/product/:id",      // Chi tiết sản phẩm
    SEARCH: "/tim-kiem",               // Tìm kiếm
    FORGOTPASSWORD: "/quen-mat-khau", // Quên mật khẩu

  },
  ADMIN: {
    DASHBOARD: "/admin/dashboard",               
  },

  CUSTOMER: { 
    HOME: "/customer/home",
    PROFILE: "/customer/home/thong-tin-ca-nhan",      // Thông tin cá nhân
    MYORDER: "/customer/home/don-mua",
    ORDERDETAIL: "/customer/home/don-mua/:id",                  // Đơn mua
    CART: "/customer/home/gio-hang",
    LAPTOP: "/customer/home/laptop",                  // Danh sách laptop
    SUPPORT: "/ho-tro",                 // Hỗ trợ
    PRODUCTDETAIL: "/customer/home/product/:id",      // Chi tiết sản phẩm
    SEARCH: "/customer/home/tim-kiem",               // Tìm kiếm
  }
};




