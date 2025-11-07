// src/services/authService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

const register = async (data) => {
  const res = await api.post("/register", data);
  return res.data;
};

const login = async (data) => {
  const res = await api.post("/login", data);
  return res.data;
};

const forgotPassword = async (data) => {
  const res = await api.post("/forgot-password", data);
  return res.data;
};

const resetPassword = async (data) => {
  const res = await api.post("/reset-password", data);
  return res.data;
};

const authService = { register, login, forgotPassword, resetPassword };
export default authService;
