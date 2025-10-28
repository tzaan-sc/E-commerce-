import React from "react";

const sideBar = ({ onSelect }) => {
  return (
    <aside className="pp-sidebar">
      <div className="pp-section">
        <h3>Tài khoản của tôi</h3>
        <ul>
          <li onClick={() => onSelect("profile")}>Hồ sơ</li>
          <li onClick={() => onSelect("password")}>Đổi mật khẩu</li>
        </ul>
      </div>

      <div className="pp-section">
        <h3 onClick={() => onSelect("orders")}>Đơn mua</h3>
      </div>
    </aside>
  );
};

export default sideBar;
