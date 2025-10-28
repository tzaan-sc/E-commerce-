import React, { useState, useEffect } from "react";

const ProfileInfo = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setFormData((prev) => ({
        ...prev,
        email: userData.email || "",
        name: userData.name || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // giới hạn 1MB check
      if (file.size > 1024 * 1024) {
        alert("Dung lượng ảnh không được vượt quá 1MB");
        return;
      }
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // placeholder: call API sau
    alert("Cập nhật thành công!");
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Thông tin tài khoản</h2>
      <form className="profile-form" onSubmit={handleSubmit}>
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
            disabled
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

export default ProfileInfo;
