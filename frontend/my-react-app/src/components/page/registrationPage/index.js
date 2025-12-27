import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import './style.scss';

const RegistrationPage = () => {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  
const handleGoogleRegister = async (credentialResponse) => {
  try {
    const res = await axios.post(
      "http://localhost:8080/api/auth/google",
      {
        token: credentialResponse.credential,
      }
    );

    // Lưu token vào localStorage và chuyển hướng về trang chính
    localStorage.setItem("token", res.data.token);
    window.location.href = "/";
  } catch (error) {
    console.error("Google registration/login failed", error);
  }
};

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('❌ Mật khẩu không khớp!');
      return;
    }
    register(formData);
  };

  return (
    <div className="registration-page container-fluid">
      <div className="row registration-row">
        <div className="col-lg-6 col-md-12 registration-left-panel d-none d-lg-flex">
          <div className="intro-content">
            <h1>Chào mừng bạn đến với chúng tôi!</h1>
            <p>Đăng ký ngay để khám phá những điều tuyệt vời.</p>
          </div>
        </div>

        <div className="col-lg-6 col-md-12 registration-right-panel d-flex justify-content-center align-items-center">
          <div className="registration-form-container">
            <h2 className="mb-4 text-center">Đăng Ký Tài Khoản</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="phone" className="form-label">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

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

              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Mật khẩu
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

              <div className="mb-4">
                <label htmlFor="confirmPassword" className="form-label">
                  Nhập lại mật khẩu
                </label>
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
              
              <div className="text-center my-3">
  <span>Hoặc đăng ký bằng</span>
</div>

<div className="d-flex justify-content-center mb-3">
  <GoogleLogin
    onSuccess={handleGoogleRegister}
    onError={() => console.log("Google Login Failed")}
  />
</div>


              <p className="text-center mt-3">
                Đã có tài khoản? <Link to="/dang-nhap">Đăng nhập</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(RegistrationPage);
