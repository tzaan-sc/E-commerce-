import { memo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";

const ProfilePage = () => {
  const navigate = useNavigate();

  // State Form thông tin cá nhân
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    address: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  // State Form đổi mật khẩu
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // 1. LẤY DỮ LIỆU KHI LOAD TRANG
  useEffect(() => {
    const fetchUserData = async () => {
      const userStr = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!userStr || !token) {
        navigate("/dang-nhap");
        return;
      }

      const localUser = JSON.parse(userStr);

      // Điền tạm dữ liệu cũ
      setFormData({
        email: localUser.email || "",
        username: localUser.username || "",
        phone: localUser.phone || "",
        address: localUser.address || "",
      });

      if (localUser.avatarUrl) {
        const avatarLink = localUser.avatarUrl.startsWith("http") 
            ? localUser.avatarUrl 
            : `http://localhost:8080${localUser.avatarUrl}`;
        setPreview(avatarLink);
      }

      // Gọi API lấy dữ liệu MỚI NHẤT
      try {
        const response = await fetch(`http://localhost:8080/api/users/my-info`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const dbUser = await response.json();
          
          setFormData(prev => ({
            ...prev,
            username: dbUser.username || "",
            phone: dbUser.phone || "",       
            address: dbUser.address || "",   
            email: dbUser.email || "",       
          }));

          if (dbUser.avatarUrl) {
             const avatarLink = dbUser.avatarUrl.startsWith("http") 
                ? dbUser.avatarUrl 
                : `http://localhost:8080${dbUser.avatarUrl}`;
             setPreview(avatarLink);
          }
          
          const mergedUser = { ...localUser, ...dbUser };
          localStorage.setItem("user", JSON.stringify(mergedUser));

        } else if (response.status === 401) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            navigate("/dang-nhap");
        }
      } catch (error) {
        console.error("Lỗi kết nối:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Cập nhật input state
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Chọn ảnh avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Xử lý input mật khẩu
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // 2. XỬ LÝ CẬP NHẬT THÔNG TIN
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      
      if (!token || !userStr) {
          navigate("/dang-nhap");
          return;
      }
      
      const localUser = JSON.parse(userStr);
      let currentAvatarUrl = localUser.avatarUrl;

      // BƯỚC 1: UPLOAD ẢNH (NẾU CÓ CHỌN ẢNH MỚI)
      if (avatar) {
          const formDataImage = new FormData();
          formDataImage.append("file", avatar);

          const uploadRes = await fetch("http://localhost:8080/api/uploads/image", {
              method: "POST",
              body: formDataImage // Không cần header Content-Type
          });
          
          const uploadData = await uploadRes.json();
          if (uploadRes.ok) {
              currentAvatarUrl = uploadData.url; // Lấy đường dẫn ảnh mới
          } else {
              alert("Lỗi upload ảnh: " + uploadData.error);
              return; 
          }
      }

      // BƯỚC 2: CẬP NHẬT PROFILE (Gửi kèm avatarUrl)
      const response = await fetch(
        `http://localhost:8080/api/profile/update`,
        {
          method: "PUT",
          headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            username: formData.username,
            phone: formData.phone,
            address: formData.address,
            email: formData.email,
            avatarUrl: currentAvatarUrl // Gửi link ảnh
          }),
        }
      );

      if (!response.ok) {
         const errData = await response.json().catch(() => ({}));
         throw new Error(errData.message || "Cập nhật thất bại");
      }

      const updatedUser = await response.json();

      const newUserStorage = { ...localUser, ...updatedUser };
      localStorage.setItem("user", JSON.stringify(newUserStorage));

      alert("Cập nhật thông tin thành công!");
      window.dispatchEvent(new Event("storage"));

    } catch (err) {
      console.error(err);
      alert("Lỗi: " + err.message);
    }
  };

  // 3. XỬ LÝ ĐỔI MẬT KHẨU
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/profile/change-password`,
        {
          method: "PUT",
          headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}` 
          },
          body: JSON.stringify({
            oldPassword: passwordData.oldPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Thất bại");

      alert("Đổi mật khẩu thành công!");
      setPasswordData({ oldPassword: "", newPassword: "", confirmNewPassword: "" });

    } catch (err) {
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

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="profile-left">
            <div className="avatar-wrapper">
              {preview ? (
                <img src={preview} alt="avatar" className="avatar" />
              ) : (
                <div className="avatar-placeholder">👤</div>
              )}
              <label htmlFor="avatar-upload" className="avatar-button">Chọn Ảnh</label>
              <input type="file" id="avatar-upload" accept="image/*" onChange={handleAvatarChange} hidden />
            </div>
          </div>

          <div className="profile-right">
            <div className="form-group">
              <label>Họ và tên</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Nhập họ tên" />
            </div>

            <div className="form-group">
              <label>Số điện thoại</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Nhập SĐT" />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} disabled placeholder="Email" />
            </div>

            <div className="form-group">
              <label>Địa chỉ</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Nhập địa chỉ" />
            </div>

            <button type="submit" className="update-button">Cập Nhật Thông Tin</button>
          </div>
        </form>

        <div className="password-change-section mt-5 p-4 border rounded shadow-sm bg-light">
          <h3 className="mb-4">Đổi Mật Khẩu</h3>
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-3">
              <label className="form-label">Mật khẩu hiện tại</label>
              <input type="password" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Mật khẩu mới</label>
              <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Xác nhận mật khẩu mới</label>
              <input type="password" name="confirmNewPassword" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} className="form-control" required />
            </div>
            <button type="submit" className="btn btn-primary w-100">Đổi Mật Khẩu</button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default memo(ProfilePage);