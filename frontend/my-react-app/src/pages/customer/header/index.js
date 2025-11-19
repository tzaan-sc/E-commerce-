// src/components/Header/index.js

import { memo, useState, useEffect } from "react";
import "./style.scss";
import {
  BsFillPersonFill,
} from "react-icons/bs";
import { GrSearch } from "react-icons/gr";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom"; 
import { formatter } from "utils/formatter";
import { ROUTERS } from "utils/router";
import { useAuth } from "hooks/useAuth"; 

import { useCart } from "../../../context/index"; 

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  // 👇 2. LẤY CART COUNT
  const { cartCount, fetchCartCount } = useCart(); 
  
  const [currentUser, setCurrentUser] = useState(null);

  // Kiểm tra user khi component load hoặc khi localstorage thay đổi
  useEffect(() => {
    const userFromStorage = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(userFromStorage);
    
    // Lần đầu load, nếu có user thì fetch cart count
    if (userFromStorage) {
        fetchCartCount();
    }
    
    // Lắng nghe sự thay đổi của localstorage
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      setCurrentUser(updatedUser);
      if (updatedUser) {
        fetchCartCount(); // Fetch lại giỏ hàng nếu đăng nhập/thay đổi
      } else {
        // Xóa số lượng giỏ hàng nếu đăng xuất
        // Lỗi: Hàm useCart không cung cấp setCartCount
        // setGlobalCartCount(0); // Thay thế bằng hàm nào đó nếu có
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []); // Giữ nguyên dependency array rỗng


  const [menus] = useState([
    {
      name: "Trang chủ",
      path: ROUTERS.CUSTOMER.HOME,
    },
    {
      name: "Laptop",
      path: ROUTERS.CUSTOMER.LAPTOP,
      child: [
        {
          name: "Thương hiệu",
          subchild: [
            { name: "Dell", path: "" },
            { name: "HP", path: "" },
            { name: "Asus", path: "" },
            { name: "Lenovo", path: "" },
          ],
        },
        {
          name: "Nhu cầu sử dụng",
          subchild: [
            { name: "Gaming", path: "" },
            { name: "Văn phòng", path: "" },
            { name: "Thiết kế - Kĩ thuật", path: "" },
            { name: "Học tập", path: "" },
          ],
        },
        {
          name: "Kích thước màn hình",
          subchild: [
            { name: "13-14 inch", path: "" },
            { name: "15-16 inch", path: "" },
            { name: "17 inch trở lên", path: "" },
          ],
        },
      ],
    },
    {
      name: "Tài khoản",
      child: [
        { name: "Thông tin tài khoản", path: ROUTERS.CUSTOMER.PROFILE },
        { name: "Đơn mua", path: ROUTERS.CUSTOMER.MYORDER },
        { name: "Đăng xuất", path: "#" },
      ],
    },
  ]);

  const renderDropdown = (menu) => {
    if (menu.name === "Laptop") {
      return (
        <ul className="header__menu_dropdown laptop-dropdown">
          {menu.child.map((section, sectionKey) => (
            <li key={sectionKey} className="dropdown-column">
              <span className="section-title">{section.name}:</span>
              <ul className="sub-dropdown">
                {section.subchild.map((subItem, subKey) => (
                  <li key={subKey}>
                    <Link to={subItem.path}>{subItem.name}</Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      );
    }

    // Tài khoản Dropdown
    return (
      <ul className="header__menu_dropdown">
        {menu.child.map((child, childKey) => {
          
          // Xử lý riêng cho nút "Đăng xuất"
          if (child.name === "Đăng xuất") {
            return (
              <li key={childKey}>
                <a
                  href="#!" 
                  onClick={(e) => {
                    e.preventDefault(); 
                    logout(); 
                    setCurrentUser(null); // Cập nhật state ngay lập tức
                    navigate(ROUTERS.USER.LOGIN); // Điều hướng về trang đăng nhập
                  }}
                >
                  {child.name}
                </a>
              </li>
            );
          }

          // Render bình thường cho các link khác
          return (
            <li key={childKey}>
              <Link to={child.path}>{child.name}</Link>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <header className="header">
      <div className="header__top">
        <div className="container">
          <div className="header__top_content">
            Freeship đơn từ {formatter(100000)}, vận chuyển toàn quốc
          </div>
        </div>
      </div>

      <div className="header__main">
        <div className="container">
          <div className="header__main_content">
            <div className="header__logo">
              <Link to={ROUTERS.CUSTOMER.HOME}>
                <h1>LOGO</h1>
              </Link>
            </div>

            <nav className="header__menu">
              <ul>
                {menus.slice(0, 2).map((menu, menuKey) => (
                  <li key={menuKey} className={menuKey === 0 ? "active" : ""}>
                    <Link to={menu.path}>{menu.name}</Link>
                    {menu.child && renderDropdown(menu)}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="header__utilities">
              <div className="header__search">
                <input type="text" placeholder="Tìm kiếm sản phẩm..." />
                <button type="button">
                  <Link to={ROUTERS.CUSTOMER.SEARCH}>
                    <GrSearch />
                  </Link>
                </button>
              </div>

              {/* 👇 3. CẬP NHẬT CART ICON */}
              <div className="header__cart">
                <Link to={ROUTERS.CUSTOMER.CART} className="cart-icon-wrapper">
                  <AiOutlineShoppingCart />
                  {/* Hiển thị badge */}
                  {cartCount !== null && ( 
                  <span className="cart-count">{cartCount}</span>
)}
                </Link>
              </div>

              <div className="header__account">
                {currentUser ? (
                  // Đã đăng nhập: Hiển thị menu tài khoản
                  <div className="account-menu">
                    <BsFillPersonFill />
                    <span>{currentUser.username || "Tài khoản"}</span>
                    {renderDropdown(menus[2])}
                  </div>
                ) : (
                  // Chưa đăng nhập: Hiển thị link Đăng nhập
                  <Link to={ROUTERS.USER.LOGIN || "/dang-nhap"} className="account-menu login-link">
                    <BsFillPersonFill />
                    <span>Đăng nhập</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);