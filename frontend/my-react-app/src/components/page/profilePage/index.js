import { memo } from "react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  // Kiểm tra user đăng nhập
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    } else {
      const userData = JSON.parse(user);
      setFormData((prev) => ({
        ...prev,
        email: userData.email || "",
        name: userData.name || "",
      }));
    }
  }, [navigate]);

  // Cập nhật thông tin form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Cập nhật avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Gửi form
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Cập nhật thành công!");
    // TODO: Gọi API cập nhật profile ở đây nếu backend sẵn sàng
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-header">
          <h2>Thông Tin Tài Khoản</h2>
          <p>Quản lý thông tin cá nhân của bạn</p>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          {/* Bên trái - Avatar */}
          <div className="profile-left">
            <div className="avatar-wrapper">
              {preview ? (
                <img src={preview} alt="avatar preview" className="avatar" />
              ) : (
                <div className="avatar-placeholder">👤</div>
              )}
              <label htmlFor="avatar-upload" className="avatar-button">
                Chọn Ảnh
              </label>
              <input
                type="file"
                id="avatar-upload"
                accept="image/jpeg,image/png"
                onChange={handleAvatarChange}
                hidden
              />
              <small>Dung lượng tối đa 1MB<br />Định dạng: JPEG, PNG</small>
            </div>
          </div>

          {/* Bên phải - Thông tin cá nhân */}
          <div className="profile-right">
            <div className="form-group">
              <label>Họ và tên</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
              />
            </div>

            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
                placeholder="Email đăng nhập"
              />
            </div>

            <div className="form-group">
              <label>Địa chỉ</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Nhập địa chỉ"
              />
            </div>

            <button type="submit" className="update-button">
              Cập Nhật Thông Tin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(ProfilePage);