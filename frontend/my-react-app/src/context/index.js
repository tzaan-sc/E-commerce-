import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../api/axiosConfig"; // Import file api của bạn

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  // Hàm lấy số lượng giỏ hàng từ API
  const fetchCartCount = async () => {
    try {
      // Gọi API lấy danh sách giỏ hàng
      const response = await apiClient.get("/cart"); 
      const cartItems = response.data;

      // Cách 1: Đếm tổng số sản phẩm (VD: 2 cái áo + 3 cái quần = 5)
      const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
      
      // Cách 2: Đếm số loại sản phẩm (VD: 2 cái áo + 3 cái quần = 2 loại)
      // const totalCount = cartItems.length;

      setCartCount(totalCount);
    } catch (error) {
      console.error("Lỗi lấy giỏ hàng:", error);
      setCartCount(0);
    }
  };

  // Gọi hàm này mỗi khi App chạy để hiện số cũ
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCartCount();
    }
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);