import React, { memo, useState } from "react"; // Bỏ useEffect, useSearchParams vì không dùng token link nữa
import { Link, useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(""); // Thêm state OTP
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const [step, setStep] = useState(1); // 1: Nhập Email, 2: Nhập OTP & Pass mới

  const navigate = useNavigate();

  // 📨 BƯỚC 1: Gửi mã OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      // Gọi API gửi OTP
      const response = await fetch(`http://localhost:8080/api/auth/forgot-password-otp?email=${email}`, {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Mã OTP đã được gửi đến email của bạn!");
        setStep(2); // Chuyển sang giao diện nhập mã
      } else {
        setError(data.error || "Email không tồn tại hoặc có lỗi xảy ra.");
      }
    } catch (err) {
      setError("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  // 🔑 BƯỚC 2: Đặt lại mật khẩu với OTP
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
    
    if (newPassword.length < 6) {
        setError("Mật khẩu phải có ít nhất 6 ký tự.");
        setLoading(false);
        return;
    }

    try {
      // Gọi API Reset bằng OTP
      const response = await fetch("http://localhost:8080/api/auth/reset-password-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            email,       // Gửi kèm email để backend xác định user
            otp,         // Mã 6 số user nhập
            newPassword 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Đổi mật khẩu thành công!");
        setTimeout(() => navigate("/dang-nhap"), 2000);
      } else {
        setError(data.error || "Mã OTP không chính xác hoặc đã hết hạn.");
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
        
        {/* Cột trái: Hình ảnh/Intro */}
        <div className="col-lg-6 col-md-12 registration-left-panel d-none d-lg-flex">
          <div className="intro-content">
            <h1>Khôi phục mật khẩu</h1>
            <p>Nhập email để nhận mã xác thực OTP</p>
          </div>
        </div>

        {/* Cột phải: Form */}
        <div className="col-lg-6 col-md-12 registration-right-panel d-flex justify-content-center align-items-center">
          <div className="registration-form-container">
            <h2 className="mb-4 text-center">
              {step === 1 ? "Quên Mật Khẩu" : "Đặt Lại Mật Khẩu"}
            </h2>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {step === 1 ? (
              // --- FORM BƯỚC 1: NHẬP EMAIL ---
              <form onSubmit={handleSendOtp}>
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
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
                  {loading ? "Đang gửi..." : "Gửi Mã OTP"}
                </button>

                <div className="text-center">
                  <Link to="/dang-nhap" className="text-decoration-none">← Quay lại đăng nhập</Link>
                </div>
              </form>
            ) : (
              // --- FORM BƯỚC 2: NHẬP OTP & MẬT KHẨU MỚI ---
              <form onSubmit={handleResetPassword}>
                <div className="mb-3 text-center">
                    <small className="text-muted">Mã OTP đã được gửi tới: <strong>{email}</strong></small>
                </div>

                <div className="mb-3">
                  <label htmlFor="otp" className="form-label">Mã OTP (6 số)</label>
                  <input
                    type="text"
                    className="form-control"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Nhập mã xác thực"
                    maxLength={6}
                    required
                  />
                </div>

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
                  <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu</label>
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
                  {loading ? "Đang xử lý..." : "Xác Nhận & Đổi Mật Khẩu"}
                </button>
                
                <div className="text-center">
                    <button type="button" className="btn btn-link text-decoration-none" onClick={() => setStep(1)}>
                        Gửi lại mã?
                    </button>
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
