import React, { memo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // 👉 Cập nhật input khi người dùng nhập
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 👉 Gửi dữ liệu đăng nhập đến backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Đăng nhập thành công!");
        // Lưu thông tin người dùng vào localStorage
        localStorage.setItem("user", JSON.stringify(data));

        // Điều hướng sang trang hồ sơ
        navigate("/thong-tin-ca-nhan");
      } else {
        alert("❌ " + data);
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("⚠️ Không thể kết nối đến server.");
    }
  };
  
  return (
    <div className="login-page registration-page container-fluid"> {/* Tái sử dụng class registration-page */}
      <div className="row registration-row">
        
        {/* Phần bên trái: Hình ảnh/Thông tin giới thiệu (Giống trang Đăng kí) */}
        <div className="col-lg-6 col-md-12 registration-left-panel d-none d-lg-flex">
          <div className="intro-content">
            <h1>Chào mừng trở lại!</h1>
            <p>Đăng nhập để tiếp tục mua sắm.</p>
            {/* Thêm ảnh minh họa */}
          </div>
        </div>

        {/* Phần bên phải: Form Đăng Nhập */}
        <div className="col-lg-6 col-md-12 registration-right-panel d-flex justify-content-center align-items-center">
          <div className="registration-form-container">
            <h2 className="mb-4 text-center">Đăng Nhập Tài Khoản</h2>
            <form onSubmit={handleSubmit}>
              
              {/* Email */}
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

              {/* Mật Khẩu */}
              <div className="mb-4">
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

              <div className="d-flex justify-content-end mb-4">
                  <Link to="/forgot-password" className="text-decoration-none">Quên mật khẩu?</Link>
              </div>

              {/* Nút Đăng Nhập */}
              <button type="submit" className="btn btn-primary w-100 mb-3">
                Đăng Nhập
              </button>

              {/* Đường dẫn về trang đăng kí */}
              <p className="text-center mt-3">
                Bạn chưa có tài khoản? <Link to="/dang-ky">Đăng ký</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(LoginPage);