import axios from 'axios';
import { API_BASE_URL } from '../constants/config';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptors để quản lý token hoặc common errors nếu cần
axiosClient.interceptors.request.use(
  (config) => {
    // Có thể gán token ở đây
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data; // Chỉ return data để code ở nơi gọi gọn hơn
    }
    return response;
  },
  (error) => {
    // Xử lý lỗi toàn cục (ví dụ token hết hạn -> redirect login)
    console.error('API Call Error:', error);
    return Promise.reject(error);
  }
);

export default axiosClient;
