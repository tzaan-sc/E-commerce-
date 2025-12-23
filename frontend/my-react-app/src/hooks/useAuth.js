// src/hooks/useAuth.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

export const useAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const register = async (formData) => {
    setLoading(true);
    try {
      const data = await authService.register(formData);
      alert("✅ Đăng ký thành công!");
      navigate("/dang-nhap");
      return data;
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "❌ Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const login = async (formData) => {
    setLoading(true);
    try {
      const data = await authService.login(formData);

      // Lưu token và user
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: data.username,
          email: data.email,
          role: data.role,
        })
      );

      // Điều hướng theo role
      if (data.role === "ADMIN") navigate("/admin/dashboard");
      else if (data.role === "CUSTOMER") navigate("/customer/home");
      else navigate("/");

      return data;
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "❌ Sai tài khoản hoặc mật khẩu!");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/dang-nhap");
  };

  return { register, login, logout, loading };
};
