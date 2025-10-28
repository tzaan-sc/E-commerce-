import React, { useState } from "react";
import "./style.scss";

const ShoppingCartTable = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Dell XPS 13",
      category: "Màu đen",
      image:
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300&h=300&fit=crop",
      price: 25990000,
      quantity: 1,
    },
    {
      id: 2,
      name: "HP Pavilion Gaming",
      category: "Màu trắng",
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop",
      price: 18990000,
      quantity: 2,
    },
    {
      id: 3,
      name: "Asus ROG Strix G15",
      category: "Đen RGB",
      image:
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300&h=300&fit=crop",
      price: 32990000,
      quantity: 1,
    },
  ]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN").format(price) + "đ";

  const updateQuantity = (id, amount) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <div className="cart-container">
      <h2>🛒 Giỏ Hàng Của Bạn</h2>

      <div className="cart-header">
        <div className="cart-col select"><input type="checkbox" /></div>
        <div className="cart-col product">Sản Phẩm</div>
        <div className="cart-col price">Đơn Giá</div>
        <div className="cart-col quantity">Số Lượng</div>
        <div className="cart-col total">Số Tiền</div>
        <div className="cart-col action">Thao Tác</div>
      </div>

      {cartItems.map((item) => (
        <div className="cart-item" key={item.id}>
          <div className="cart-col select">
            <input type="checkbox" />
          </div>
          <div className="cart-col product">
            <img src={item.image} alt={item.name} />
            <div className="info">
              <div className="name">{item.name}</div>
              <div className="category">
                Phân Loại Hàng: {item.category}
              </div>
            </div>
          </div>
          <div className="cart-col price">{formatPrice(item.price)}</div>
          <div className="cart-col quantity">
            <button onClick={() => updateQuantity(item.id, -1)}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQuantity(item.id, 1)}>+</button>
          </div>
          <div className="cart-col total red">
            {formatPrice(item.price * item.quantity)}
          </div>
          <div className="cart-col action">
            <button className="delete-btn" onClick={() => removeItem(item.id)}>
              Xóa
            </button>
          </div>
        </div>
      ))}

      <div className="cart-footer">
        <div className="left">
          <input type="checkbox" /> Chọn Tất Cả ({cartItems.length}){" "}
          <span className="delete-all">Xóa</span>
        </div>
        <div className="right">
          <span>
            Tổng thanh toán ({cartItems.length} Sản phẩm):{" "}
            <strong className="red">{formatPrice(total)}</strong>
          </span>
          <button className="buy-btn">Mua Hàng</button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartTable;
