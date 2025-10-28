import React from "react";

const myOrders = () => {
  return (
    <div className="profile-container">
      <h2 className="profile-title">Đơn mua</h2>
      <div className="orders-placeholder">
        <p>Chưa có đơn hàng hoặc dữ liệu sẽ hiển thị ở đây.</p>
        {/* Bạn có thể thay bằng bảng đơn hàng thật khi có API */}
      </div>
    </div>
  );
};

export default myOrders;
