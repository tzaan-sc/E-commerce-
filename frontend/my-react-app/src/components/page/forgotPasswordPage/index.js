// src/pages/ForgotPasswordPage.jsx
import React, { memo, useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1 = nhập email, 2 = nhập mật khẩu mới
  const [token, setToken] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Nếu có token từ query param (click link email) → tự động chuyển bước 2
  useEffect(() => {
    const tokenFromEmail = searchParams.get("token");
    if (tokenFromEmail) {
      setToken(tokenFromEmail);
      setStep(2);
    }
  }, [searchParams]);

  // 📨 Gửi email quên mật khẩu
  const handleSendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Đã gửi email khôi phục mật khẩu!");
      } else {
        setError(data.message || "Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (err) {
      setError("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  // 🔑 Đặt lại mật khẩu
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Đặt lại mật khẩu thành công!");
        setTimeout(() => navigate("/dang-nhap"), 2000);
      } else {
        setError(data.message || "Không thể đặt lại mật khẩu.");
      }
    } catch (err) {
      setError("Lỗi kết nối tới server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page registration-page container-fluid">
      <div className="row registration-row">
        <div className="col-lg-6 col-md-12 registration-left-panel d-none d-lg-flex">
          <div className="intro-content">
          <h1>Khôi phục mật khẩu</h1>
          </div>
        </div>

        <div className="col-lg-6 col-md-12 registration-right-panel d-flex justify-content-center align-items-center">
          <div className="registration-form-container">
            <h2 className="mb-4 text-center">
              {step === 1 ? "Khôi Phục Mật Khẩu" : "Đặt Lại Mật Khẩu"}
            </h2>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {step === 1 ? (
              <form onSubmit={handleSendEmail}>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập địa chỉ email của bạn"
                    required
                  />
                  <small className="form-text text-muted">
                    Chúng tôi sẽ gửi liên kết khôi phục mật khẩu đến email này.
                  </small>
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
                  {loading ? "Đang gửi..." : "Gửi Liên Kết Khôi Phục"}
                </button>

                <div className="text-center">
                  <Link to="/login" className="text-decoration-none">← Quay lại đăng nhập</Link>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword}>
                {/* <div className="mb-3">
                  <label htmlFor="token" className="form-label">Token đặt lại mật khẩu</label>
                  <input
                    type="text"
                    className="form-control"
                    id="token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Nhập token bạn nhận được qua email"
                    required
                  />
                </div> */}

                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">Mật khẩu mới</label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-success w-100 mb-3" disabled={loading}>
                  {loading ? "Đang xử lý..." : "Đặt Lại Mật Khẩu"}
                </button>

                <div className="text-center">
                  <Link to="/dang-nhap" className="text-decoration-none">← Quay lại đăng nhập</Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ForgotPasswordPage);