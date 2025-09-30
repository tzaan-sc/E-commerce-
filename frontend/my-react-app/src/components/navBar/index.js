import { memo } from "react";

import React, { useState } from 'react';
import './style.scss'; // Import file SCSS

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="narbar">
      <div className="header__container">
        <a href="/" className="header__logo">🛒 TechStore</a>

        {/* --- Desktop Menu --- */}
        <nav className="header__nav header__nav--desktop">
          <a href="/" className="header__nav-link header__nav-link--active">Trang chủ</a>
          <a href="/products" className="header__nav-link">Sản phẩm</a>
          <a href="/about" className="header__nav-link">Về chúng tôi</a>
          <a href="/contact" className="header__nav-link">Liên hệ</a>
        </nav>

        <div className="header__searchbar header__searchbar--desktop">
          <input type="search" placeholder="Tìm kiếm sản phẩm..." />
          {/* Icon SVG có thể được chèn vào đây hoặc qua CSS background */}
        </div>

        <div className="header__actions">
          <button className="header__action-btn">🛒</button>
          <button className="header__action-btn header__action-btn--primary">Đăng nhập</button>
          <button 
            className="header__action-btn header__action-btn--mobile-menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* --- Mobile Menu --- */}
      {isMobileMenuOpen && (
        <div className="header__mobile-nav">
          <div className="header__searchbar header__searchbar--mobile">
            <input type="search" placeholder="Tìm kiếm sản phẩm..." />
          </div>
          <nav className="header__nav header__nav--mobile">
            <a href="/" className="header__nav-link header__nav-link--active">Trang chủ</a>
            <a href="/products" className="header__nav-link">Sản phẩm</a>
            <a href="/about" className="header__nav-link">Về chúng tôi</a>
            <a href="/contact" className="header__nav-link">Liên hệ</a>
          </nav>
        </div>
      )}
    </div>
  );
};



export default Navbar;