import React, { useState, useEffect } from "react";
import Sidebar from "./components/sideBar";
import ProfileInfo from './components/profileInfo';
import MyOrders from './components/myOrders';
import ChangePasswordForm from './components/changePasswordForm';
import "./style.scss";;

const ProfilePage = () => {
  const [active, setActive] = useState("profile"); // "profile" | "password" | "orders"

  useEffect(() => {
    // Kiểm tra user login (giữ logic bạn có sẵn)
    const user = localStorage.getItem("user");
    if (!user) {
      // nếu bạn muốn navigate, import useNavigate ở đây hoặc xử lý ngoài
      // For now chỉ console
      console.log("User chưa đăng nhập");
    }
  }, []);

  return (
    <div className="profile-page-wrapper">
      <Sidebar onSelect={(key) => setActive(key)} />
      <div className="profile-content">
        {active === "profile" && <ProfileInfo />}
        {active === "password" && <ChangePasswordForm />}
        {active === "orders" && <MyOrders />}
      </div>
    </div>
  );
};

export default ProfilePage;
