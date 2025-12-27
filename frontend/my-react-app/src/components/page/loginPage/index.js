// src/pages/LoginPage.jsx
import React, { memo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../../../hooks/useAuth';
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
const handleGoogleLogin = async (credentialResponse) => {
  try {
    const res = await axios.post(
      "http://localhost:8080/api/auth/google",
      {
        token: credentialResponse.credential,
      }
    );

    localStorage.setItem("token", res.data.token);
    window.location.href = "/";
  } catch (error) {
    console.error("Google login failed", error);
  }
};


const LoginPage = () => {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
  };

  return (
    <div className="login-page registration-page container-fluid">
      <div className="row registration-row">
        <div className="col-lg-6 col-md-12 registration-left-panel d-none d-lg-flex">
          <div className="intro-content">
            <h1>Chào mừng trở lại!</h1>
            <p>Đăng nhập để tiếp tục mua sắm.</p>
          </div>
        </div>

        <div className="col-lg-6 col-md-12 registration-right-panel d-flex justify-content-center align-items-center">
          <div className="registration-form-container">
            <h2 className="mb-4 text-center">Đăng Nhập Tài Khoản</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
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

              <div className="mb-4">
                <label htmlFor="password" className="form-label">
                  Mật Khẩu
                </label>
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
                <Link to="/quen-mat-khau" className="text-decoration-none">
                  Quên mật khẩu?
                </Link>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 mb-3"
                disabled={loading}
              >
                {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
              </button>

              <div className="text-center my-3">
  <span>Hoặc đăng nhập bằng</span>
</div>

<div className="d-flex justify-content-center mb-3">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => console.log("Google Login Failed")}
                  clientId="733137263298-rd2c4so8vnreuua7dvtgrmgg90cnu72i.apps.googleusercontent.com" // <-- thêm dòng này
                />
              </div>


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
