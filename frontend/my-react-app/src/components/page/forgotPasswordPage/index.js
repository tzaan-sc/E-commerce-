// src/pages/ForgotPasswordPage.jsx
import React, { memo, useState } from "react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      // Gọi API quên mật khẩu ở đây
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Đã gửi email khôi phục mật khẩu. Vui lòng kiểm tra hộp thư của bạn.");
        setEmail("");
      } else {
        setError(data.message || "Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (err) {
      setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page registration-page container-fluid">
      <div className="row registration-row">
        <div className="col-lg-6 col-md-12 registration-left-panel d-none d-lg-flex">
          <div className="intro-content">
            <h1>Quên Mật Khẩu?</h1>
            <p>Nhập email của bạn để nhận liên kết khôi phục mật khẩu.</p>
          </div>
        </div>

        <div className="col-lg-6 col-md-12 registration-right-panel d-flex justify-content-center align-items-center">
          <div className="registration-form-container">
            <h2 className="mb-4 text-center">Khôi Phục Mật Khẩu</h2>
            
            {message && (
              <div className="alert alert-success" role="alert">
                {message}
              </div>
            )}

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập địa chỉ email của bạn"
                  required
                />
                <small className="form-text text-muted">
                  Chúng tôi sẽ gửi liên kết khôi phục mật khẩu đến email này.
                </small>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 mb-3"
                disabled={loading}
              >
                {loading ? "Đang gửi..." : "Gửi Liên Kết Khôi Phục"}
              </button>

              <div className="text-center">
                <Link to="/dang-nhap" className="text-decoration-none">
                  ← Quay lại đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ForgotPasswordPage);