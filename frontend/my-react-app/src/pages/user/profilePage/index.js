import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 🟢 cần import để điều hướng
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

  // 🟢 Kiểm tra user đăng nhập
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login"); // nếu chưa đăng nhập, chuyển hướng về login
    } else {
      const userData = JSON.parse(user);
      setFormData((prev) => ({
        ...prev,
        email: userData.email || "",
        name: userData.name || "",
      }));
    }
  }, [navigate]);

  // 🟢 Cập nhật thông tin form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🟢 Cập nhật avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🟢 Gửi form
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Cập nhật thành công!");
    // 👉 Gọi API cập nhật profile ở đây nếu backend sẵn sàng
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Thông tin tài khoản</h2>
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
              Chọn ảnh
            </label>
            <input
              type="file"
              id="avatar-upload"
              accept="image/jpeg,image/png"
              onChange={handleAvatarChange}
              hidden
            />
            <small>Dung lượng tối đa 1MB. Định dạng: JPEG, PNG</small>
          </div>
        </div>

        {/* Bên phải - Thông tin cá nhân */}
        <div className="profile-right">
          <label>Họ và tên:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <label>Số điện thoại:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled // email thường không cho sửa
          />

          <label>Địa chỉ:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />

          <button type="submit" className="update-button">
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
