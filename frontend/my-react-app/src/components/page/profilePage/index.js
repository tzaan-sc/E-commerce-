import { memo } from "react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    address: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  // Form đổi mật khẩu
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Kiểm tra user đăng nhập
// Kiểm tra user đăng nhập và LẤY DỮ LIỆU MỚI NHẤT TỪ API
 // Kiểm tra user đăng nhập và LẤY DỮ LIỆU MỚI NHẤT TỪ API
 // Kiểm tra user đăng nhập và LẤY DỮ LIỆU MỚI NHẤT TỪ API
  useEffect(() => {
    const fetchUserData = async () => {
      const userStr = localStorage.getItem("user");
      
      if (!userStr) {
        navigate("/login");
        return;
      }

      const localUser = JSON.parse(userStr);
      
      // 1. Điền tạm dữ liệu từ LocalStorage (để hiện email, username trước)
      // Lưu ý: localUser.username có thể là null nếu lúc login chưa có
      setFormData({
        email: localUser.email || "",
        username: localUser.username || "",
        phone: localUser.phone || "",
        address: localUser.address || "",
      });
      setPreview(localUser.avatar || null);

      // 2. GỌI API ĐỂ LẤY DỮ LIỆU MỚI NHẤT TỪ DB (Quan trọng)
      try {
        // Dùng API /my-info mà bạn đã tạo ở bước trước (không cần ID)
        const response = await fetch(`http://localhost:8080/api/users/my-info`, {
             headers: {
                 // Nếu backend yêu cầu token, hãy thêm vào đây
                 // "Authorization": `Bearer ${localUser.token}` 
             }
        });
        
        if (response.ok) {
          const dbUser = await response.json();
          console.log("User data from API:", dbUser); // Debug: Xem API trả về gì

          // Cập nhật lại form với dữ liệu chuẩn từ Database
          setFormData(prev => ({
            ...prev,
            // Ưu tiên lấy từ DB, nếu DB null thì giữ nguyên hoặc rỗng
            username: dbUser.username || "", 
            phone: dbUser.phone || "",       
            address: dbUser.address || "",   
            email: dbUser.email || "",       
          }));
          
          // Cập nhật lại avatar nếu có
          if(dbUser.avatarUrl) {
             const avatarLink = dbUser.avatarUrl.startsWith("http") 
                ? dbUser.avatarUrl 
                : `http://localhost:8080${dbUser.avatarUrl}`;
             setPreview(avatarLink);
          }
          
          // (Tùy chọn) Cập nhật ngược lại vào localStorage để đồng bộ
          // localStorage.setItem("user", JSON.stringify({ ...localUser, ...dbUser }));
        } else {
            console.error("Failed to fetch user info");
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin user mới nhất:", error);
      }
    };

    fetchUserData();
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

  // Submit cập nhật thông tin
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user.id;

      const response = await fetch(
        `http://localhost:8080/api/auth/update-profile/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username,
            phone: formData.phone,
            address: formData.address,
            avatar: avatar ? avatar.name : null,
          }),
        }
      );

      if (!response.ok) throw new Error("Cập nhật thất bại");

      const updatedUser = await response.json();

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          username: updatedUser.username,
          phone: updatedUser.phone,
          address: updatedUser.address,
          avatar: updatedUser.avatar,
        })
      );

      setFormData((prev) => ({
        ...prev,
        username: updatedUser.username,
        phone: updatedUser.phone,
        address: updatedUser.address,
      }));

      alert("Cập nhật thông tin thành công!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Cập nhật form đổi mật khẩu
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // Submit đổi mật khẩu
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      alert("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user.id;

      const response = await fetch(
        `http://localhost:8080/api/auth/change-password/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            oldPassword: passwordData.oldPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Đổi mật khẩu thất bại");
      }

      alert("Đổi mật khẩu thành công!");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-header">
          <h2>Thông Tin Tài Khoản</h2>
          <p>Quản lý thông tin cá nhân của bạn</p>
        </div>

        {/* Form cập nhật thông tin cá nhân */}
        <form className="profile-form" onSubmit={handleSubmit}>
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
              <small>
                Dung lượng tối đa 1MB
                <br />
                Định dạng: JPEG, PNG
              </small>
            </div>
          </div>

          <div className="profile-right">
            <div className="form-group">
              <label>Họ và tên</label>
              <input
                type="text"
                name="username"
                value={formData.username}
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

        {/* Form đổi mật khẩu */}
<div className="password-change-section mt-5 p-4 border rounded shadow-sm bg-light">
  <h3 className="mb-4">Đổi Mật Khẩu</h3>
  <form onSubmit={handlePasswordSubmit}>
    <div className="mb-3">
      <label className="form-label">Mật khẩu hiện tại</label>
      <input
        type="password"
        name="oldPassword"
        value={passwordData.oldPassword}
        onChange={handlePasswordChange}
        placeholder="Nhập mật khẩu hiện tại"
        className="form-control"
        required
      />
    </div>

    <div className="mb-3">
      <label className="form-label">Mật khẩu mới</label>
      <input
        type="password"
        name="newPassword"
        value={passwordData.newPassword}
        onChange={handlePasswordChange}
        placeholder="Nhập mật khẩu mới"
        className="form-control"
        required
      />
    </div>

    <div className="mb-3">
      <label className="form-label">Xác nhận mật khẩu mới</label>
      <input
        type="password"
        name="confirmNewPassword"
        value={passwordData.confirmNewPassword}
        onChange={handlePasswordChange}
        placeholder="Nhập lại mật khẩu mới"
        className="form-control"
        required
      />
    </div>

    <button type="submit" className="btn btn-primary w-100">
      Đổi Mật Khẩu
    </button>
  </form>
</div>

      </div>
    </div>
  );
};

export default memo(ProfilePage);