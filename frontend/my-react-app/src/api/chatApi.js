import apiClient from "./axiosConfig";

export const sendChatMessage = (message) => {
  return apiClient.post("/ai/chat", { message });
};

// Gọi cái này 1 lần bên phía Admin hoặc dùng Postman để khởi tạo data
export const syncAiData = () => {
  return apiClient.post("/ai/sync");
};