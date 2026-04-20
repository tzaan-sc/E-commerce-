import axios from "axios";
import { toast } from "react-toastify";

// ─── Cấu hình toastify mặc định (dùng chung toàn app) ───────────────────────
const TOAST_CONFIG = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// ─── Hàm trích xuất message từ nhiều cấu trúc lỗi khác nhau của Spring Boot ──
const extractErrorMessage = (data) => {
  if (!data) return null;
  if (typeof data === "string") return data;
  
  if (data.details && Array.isArray(data.details) && data.details.length > 0) {
    if (data.details.length === 1) {
      const parts = data.details[0].split(': ');
      return parts.length > 1 ? parts[1] : data.details[0];
    } else {
      return "Vui lòng kiểm tra lại:\n- " + data.details
        .map(detail => {
          const parts = detail.split(': ');
          return parts.length > 1 ? parts[1] : detail;
        })
        .join('\n- ');
    }
  }

  return data.message || data.error || null;
};

// ─── Tạo Axios instance ───────────────────────────────────────────────────────
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

// ─── Request Interceptor: Tự động đính kèm JWT token ─────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // 🔥 Log để Hiển theo dõi phương thức thực tế gửi đi (POST/GET)
    console.log(`[REQUEST] ${config.method.toUpperCase()} -> ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Xử lý lỗi tập trung ───────────────────────────────
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (!error.response) {
      toast.error("⚠️ Không thể kết nối đến máy chủ. Kiểm tra lại mạng!", TOAST_CONFIG);
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const serverMessage = extractErrorMessage(data);

    // 🔥 Debug log để Hiển nhìn thấy lỗi JPA hoặc Auth từ Backend
    console.error(`[RESPONSE ERROR ${status}]`, data);

    switch (status) {
      case 400:
        toast.error(
          serverMessage || "Dữ liệu gửi lên không hợp lệ. Vui lòng kiểm tra lại!",
          TOAST_CONFIG
        );
        break;

      case 401:
        toast.warning(
          "⏱️ Phiên đăng nhập đã hết hạn. Đang chuyển về trang đăng nhập...",
          { ...TOAST_CONFIG, autoClose: 2500, onClose: () => {
            localStorage.removeItem("token");
            localStorage.removeItem("user"); // Xóa thêm user cho sạch
            window.location.href = "/dang-nhap";
          }}
        );
        break;

      case 403:
        toast.warning(
          "🚫 Bạn không có quyền thực hiện thao tác này!",
          TOAST_CONFIG
        );
        break;

      case 404:
        toast.error(
          serverMessage || "Không tìm thấy dữ liệu yêu cầu.",
          TOAST_CONFIG
        );
        break;

      case 405:
        // 🔥 Xử lý lỗi "Method Not Allowed" (VD: POST bị biến thành GET)
        toast.error(
          "🛠️ Lỗi phương thức yêu cầu (405). Vui lòng kiểm tra lại quyền hoặc đường dẫn!",
          TOAST_CONFIG
        );
        break;

      case 500:
        // Hiển thị serverMessage nếu lỗi JPA trả về chi tiết (VD: "Không đủ số lượng kho")
        toast.error(
          serverMessage || "🛠️ Hệ thống đang gặp sự cố. Vui lòng thử lại sau!",
          TOAST_CONFIG
        );
        break;

      default:
        toast.error(
          serverMessage || `Đã xảy ra lỗi (${status}). Vui lòng thử lại!`,
          TOAST_CONFIG
        );
        break;
    }

    return Promise.reject(error);
  }
);

export default api;