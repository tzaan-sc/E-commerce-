import { memo, useState, useEffect } from "react";
import "./style.scss";
import { BsFillPersonFill } from "react-icons/bs";
import { GrSearch } from "react-icons/gr";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTERS } from "utils/router";
import { useAuth } from "hooks/useAuth";
import { useCart } from "context/index"; // Import Cart Context

import { 
  DEFAULT_MENU, 
  DEFAULT_CUSTOMER_MENU 
} from "services/navigationApi";

const Header = () => {
  const { logout } = useAuth(); // Hook auth
  const navigate = useNavigate();
  const location = useLocation();
  
  // 👇👇👇 SỬA LẠI DÒNG NÀY (GỌI TRỰC TIẾP, KHÔNG DÙNG ? :) 👇👇👇
  const { cartCount, fetchCartCount } = useCart(); 
  // 👆👆👆 ---------------------------------------------------- 👆👆👆

  const [menus, setMenus] = useState(DEFAULT_MENU); 
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // Kiểm tra xem đang ở trang customer hay user thường
  const isCustomerPage = location.pathname.includes("/customer");

  // 1. KHỞI TẠO HEADER
  useEffect(() => {
    const initHeader = () => {
      const userStored = JSON.parse(localStorage.getItem("user"));
      setCurrentUser(userStored);

      // Nếu đang ở route /customer hoặc có user -> Dùng menu Customer
      if (isCustomerPage || userStored) {
        setMenus(DEFAULT_CUSTOMER_MENU);
        // Gọi hàm update giỏ hàng nếu đã đăng nhập
        if (fetchCartCount) fetchCartCount(); 
      } else {
        setMenus(DEFAULT_MENU);
      }
    };

    initHeader();
    
    // Lắng nghe thay đổi localStorage để cập nhật header realtime
    const handleStorageChange = () => initHeader();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [location.pathname, fetchCartCount]); // Thêm fetchCartCount để fix Warning ESLint

  // 2. XỬ LÝ SEARCH
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const searchRoute = isCustomerPage ? ROUTERS.CUSTOMER.SEARCH : ROUTERS.USER.SEARCH;
      navigate(`${searchRoute}?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  // 3. XỬ LÝ ĐĂNG XUẤT
  const handleLogout = (e) => {
    e.preventDefault();
    logout(); 
    setCurrentUser(null);
    setMenus(DEFAULT_MENU);
    localStorage.removeItem("user");
    navigate(ROUTERS.USER.LOGIN);
  };

  // 4. RENDER MENU CON (DROPDOWN)
  const renderDropdown = (menu) => {
    if (!menu.child || menu.child.length === 0) return null;

    const hasColumns = menu.child.length > 0 && menu.child[0].subchild;

    // --- MEGA MENU (Laptop) ---
    if (hasColumns) {
      const laptopBasePath = isCustomerPage ? ROUTERS.CUSTOMER.LAPTOP : ROUTERS.USER.LAPTOP;

      return (
        <ul className="header__menu_dropdown laptop-dropdown">
          {menu.child.map((column, colKey) => (
            <li key={colKey} className="dropdown-column">
              <span className="section-title">{column.name}:</span>
              <ul className="sub-dropdown">
                {column.subchild?.map((item, itemKey) => {
                    let linkTo = item.path || "#";
                    const colName = column.name.toUpperCase();

                    if (item.id) {
                        if (colName.includes("THƯƠNG HIỆU")) {
                            linkTo = `${laptopBasePath}?brand=${item.id}`;
                        } else if (colName.includes("NHU CẦU")) {
                            linkTo = `${laptopBasePath}?purpose=${item.id}`;
                        } else if (colName.includes("MÀN HÌNH") || colName.includes("KÍCH THƯỚC")) {
                            linkTo = `${laptopBasePath}?screenSize=${item.id}`;
                        }
                    }

                    return (
                      <li key={itemKey}>
                        <Link to={linkTo}>{item.name}</Link>
                      </li>
                    );
                })}
              </ul>
            </li>
          ))}
        </ul>
      );
    }

    // --- DROPDOWN THƯỜNG (Tài khoản) ---
    return (
      <ul className="header__menu_dropdown">
        {menu.child.map((child, childKey) => {
          if (child.name === "Đăng xuất") {
             return (
               <li key={childKey}>
                 <a href="#!" onClick={handleLogout}>{child.name}</a>
               </li>
             );
          }
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
            Sản phẩm chính hãng - Đảm bảo chất lượng - Giao hàng toàn quốc
          </div>
        </div>
      </div>

      <div className="header__main">
        <div className="container">
          <div className="header__main_content">
            
            {/* LOGO */}
            <div className="header__logo">
              <Link to={isCustomerPage ? ROUTERS.CUSTOMER.HOME : ROUTERS.USER.HOME}>
                <h1>HTV</h1>
              </Link>
            </div>

            {/* MENU CHÍNH */}
            <nav className="header__menu">
              <ul>
                {menus.map((menu, menuKey) => {
                  if (menu.name === "Tài khoản" || menu.name === "Đăng nhập") return null;

                  return (
                    <li key={menuKey} className={location.pathname === menu.path ? "active" : ""}>
                      <Link to={menu.path || "#"}>{menu.name}</Link>
                      {menu.child && renderDropdown(menu)}
                    </li>
                  );
                })}

                {/* 👇 THÊM MỤC KHUYẾN MÃI CHO USER TẠI ĐÂY */}
                <li className={location.pathname.includes("khuyen-mai") ? "active" : ""}>
                <Link to={currentUser ? "/customer/home/khuyen-mai" : "/khuyen-mai"}>
                  Khuyến mãi
                </Link>
</li>
              </ul>
            </nav>

            <div className="header__utilities">
              
              {/* SEARCH */}
              <form className="header__search" onSubmit={handleSearch}>
                <input 
                  type="text" 
                  placeholder="Tìm kiếm sản phẩm..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button type="submit"><GrSearch /></button>
              </form>

              {/* CART */}
              <div className="header__cart">
                <Link to={isCustomerPage ? ROUTERS.CUSTOMER.CART : ROUTERS.USER.LOGIN} className="cart-icon-wrapper">
                  <AiOutlineShoppingCart />
                  {/* Chỉ hiện số lượng khi đã đăng nhập */}
                  {currentUser && cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                </Link>
              </div>

              {/* ACCOUNT */}
              <div className="header__account">
                {currentUser ? (
                  <div className="account-menu">
                    <BsFillPersonFill />
                    <span>{currentUser.username || "Tài khoản"}</span>
                    {/* Render dropdown tài khoản từ menu config */}
                    {renderDropdown(menus.find(m => m.name === "Tài khoản") || { child: [] })}
                  </div>
                ) : (
                  <Link to={ROUTERS.USER.LOGIN} className="account-menu login-link">
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