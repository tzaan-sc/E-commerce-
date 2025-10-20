import React, { memo, useState } from "react";
import "./style.scss";
import { Link, useNavigate } from "react-router-dom";

const RegistrationPage = () => {
  const navigate = useNavigate(); // 👉 để chuyển hướng sau khi đăng ký
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Kiểm tra mật khẩu khớp ở frontend
    if (formData.password !== formData.confirmPassword) {
      alert("❌ Mật khẩu không khớp!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Chỉ gửi các trường cần thiết (không gửi confirmPassword)
        body: JSON.stringify({
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          password: formData.password,
        }),
      });

      const text = await response.text(); // ⚠️ backend trả về chuỗi, không phải JSON

      if (response.ok) {
        alert("✅ " + text);
        navigate("/dang-nhap"); // 👉 Chuyển về trang đăng nhập
      } else {
        alert("❌ " + text);
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("⚠️ Không thể kết nối đến server.");
    }
  };

  return (
    <div className="registration-page container-fluid">
      <div className="row registration-row">
        {/* Bên trái: ảnh + mô tả */}
        <div className="col-lg-6 col-md-12 registration-left-panel d-none d-lg-flex">
          <div className="intro-content">
            <h1>Chào mừng bạn đến với chúng tôi!</h1>
            <p>Đăng kí ngay để khám phá những điều tuyệt vời.</p>
          </div>
        </div>

        {/* Bên phải: form */}
        <div className="col-lg-6 col-md-12 registration-right-panel d-flex justify-content-center align-items-center">
          <div className="registration-form-container">
            <h2 className="mb-4 text-center">Đăng Kí Tài Khoản</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">Họ Tên</label>
                <input
                  type="text"
                  className="form-control"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="phoneNumber" className="form-label">Số Điện Thoại</label>
                <input
                  type="tel"
                  className="form-control"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Mật Khẩu</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="confirmPassword" className="form-label">Nhập Lại Mật Khẩu</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 mb-3">
                Đăng Kí
              </button>

              <p className="text-center mt-3">
                Bạn đã có tài khoản?{" "}
                <Link to="/dang-nhap">Đăng nhập</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(RegistrationPage);
