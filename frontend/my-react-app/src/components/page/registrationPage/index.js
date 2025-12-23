import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import './style.scss';

const RegistrationPage = () => {
  const { register, loading } = useAuth();

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  // --- CẬP NHẬT HÀM VALIDATE ---
  const validateForm = () => {
    const newErrors = {};
    const { phone, password, confirmPassword } = formData;

    // 1. Validate Số điện thoại
    const phoneRegex = /^(03|05|07|08|09)+([0-9]{8})$/; // Regex check đầu số VN

    if (!phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại.';
    } else if (!/^\d+$/.test(phone)) {
      newErrors.phone = 'Số điện thoại chỉ được chứa số.';
    } else if (phone.length !== 10) {
      newErrors.phone = 'Số điện thoại phải có đúng 10 chữ số.';
    } else if (!phoneRegex.test(phone)) {
      // 👇 THÔNG BÁO BẠN MUỐN THÊM NẰM Ở ĐÂY
      newErrors.phone = 'Số điện thoại không hợp lệ (VD: 0912345678).';
    }

    // 2. Validate Mật khẩu
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp!';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      register(formData);
    }
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

              {/* Input Số điện thoại */}
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && (
                  <div
                    className="invalid-feedback"
                    style={{
                      display: 'block',
                      color: 'red',
                      fontSize: '0.875rem',
                      marginTop: '0.25rem',
                    }}
                  >
                    {errors.phone}
                  </div>
                )}
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
                  className={`form-control ${
                    errors.confirmPassword ? 'is-invalid' : ''
                  }`}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {errors.confirmPassword && (
                  <div
                    className="invalid-feedback"
                    style={{ display: 'block', color: 'red' }}
                  >
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 mb-3"
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Đăng Kí'}
              </button>

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
