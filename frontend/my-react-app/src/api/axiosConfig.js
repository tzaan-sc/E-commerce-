// src/api/axiosConfig.js
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
// Xử lý được:  { message: "..." }  /  { error: "..." }  /  chuỗi text thuần
const extractErrorMessage = (data) => {
  if (!data) return null;
  if (typeof data === "string") return data;
  
  // Nếu có danh sách chi tiết lỗi (từ Validation của backend), gom chúng lại hiển thị cho rõ
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
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Xử lý lỗi tập trung ───────────────────────────────
// ⚠️  KHÔNG auto-unwrap response.data để không làm hỏng code hiện tại.
//     Toàn bộ code cũ vẫn tự truy cập .data như bình thường.
api.interceptors.response.use(
  (response) => response, // Trả nguyên response, không thay đổi

  (error) => {
    // Trường hợp không có phản hồi từ server (mất mạng, backend sập)
    if (!error.response) {
      toast.error("⚠️ Không thể kết nối đến máy chủ. Kiểm tra lại mạng!", TOAST_CONFIG);
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const serverMessage = extractErrorMessage(data);

    switch (status) {
      case 400:
        // Lỗi dữ liệu: hiển thị message từ server nếu có, fallback về mặc định
        toast.error(
          serverMessage || "Dữ liệu gửi lên không hợp lệ. Vui lòng kiểm tra lại!",
          TOAST_CONFIG
        );
        break;

      case 401:
        // Hết phiên đăng nhập: thông báo và redirect
        toast.warning(
          "⏱️ Phiên đăng nhập đã hết hạn. Đang chuyển về trang đăng nhập...",
          { ...TOAST_CONFIG, autoClose: 2500, onClose: () => {
            localStorage.removeItem("token");
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

      case 500:
        toast.error(
          "🛠️ Hệ thống đang gặp sự cố. Vui lòng thử lại sau!",
          TOAST_CONFIG
        );
        // Log chi tiết lỗi kỹ thuật ra console để dev debug, không show ra user
        console.error("[500 Server Error]", data);
        break;

      default:
        toast.error(
          serverMessage || `Đã xảy ra lỗi (${status}). Vui lòng thử lại!`,
          TOAST_CONFIG
        );
        break;
    }

    // Vẫn reject để các try/catch trong component có thể bắt tiếp nếu cần
    return Promise.reject(error);
  }
);

export default api;
