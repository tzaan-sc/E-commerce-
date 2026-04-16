import axios from "axios";

const API_URL = "http://localhost:8080/api/search";

export const suggestSearch = async (keyword) => {
  // ✅ tránh gọi API rác
  if (!keyword || keyword.trim() === "") {
    return [];
  }

  try {
    const res = await axios.get(`${API_URL}/suggest`, {
      params: { keyword },
    });

    // ✅ luôn trả về array (rất quan trọng)
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error("Search suggest error:", error);
    return [];
  }
};