// api/user.js (hoặc api/auth.js tùy project bạn)
import axios from "axios";

// Hàm cập nhật thông tin user
export const updateUserProfile = async (userData) => {
  const token = localStorage.getItem("token"); 
  const response = await axios.put("http://localhost:8080/api/profile/update", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
      // Content-Type tự động xử lý, nếu gửi JSON thì application/json
    },
  });
  return response.data;
};