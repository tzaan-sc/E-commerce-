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
import { useCart } from "context/index"; 
import { getCustomerMenu, DEFAULT_CUSTOMER_MENU } from "services/navigationApi";

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { cartCount, fetchCartCount } = useCart(); 
  
  const [currentUser, setCurrentUser] = useState(null);
  const [menus, setMenus] = useState([]);
  
  // ✅ THÊM STATE CHO SEARCH INPUT
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const userFromStorage = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(userFromStorage);
    
    if (userFromStorage) {
        fetchCartCount();
    }
    
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      setCurrentUser(updatedUser);
      if (updatedUser) {
        fetchCartCount(); 
      } 
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []); 

  useEffect(() => {
    const fetchMenu = async () => {
        try {
            const data = await getCustomerMenu();
            setMenus(data);
        } catch (error) {
            console.error("Lỗi tải menu customer:", error);
            setMenus(DEFAULT_CUSTOMER_MENU);
        }
    };
    fetchMenu();
  }, []);

  // ✅ HÀM XỬ LÝ SEARCH
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Chuyển đến trang search với query parameter
      navigate(`${ROUTERS.CUSTOMER.SEARCH}?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // ✅ XỬ LÝ KHI NHẤN ENTER
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const renderDropdown = (menu) => {
    if (!menu.child || menu.child.length === 0) return null;

    const hasColumns = menu.child.length > 0 && menu.child[0].subchild;

    if (hasColumns) {
      return (
        <ul className="header__menu_dropdown laptop-dropdown">
          {menu.child.map((column, columnKey) => (
            <li key={columnKey} className="dropdown-column">
              <span className="section-title">{column.name}:</span>
              <ul className="sub-dropdown">
                {column.subchild.map((item, itemKey) => (
                  <li key={itemKey}>
                    <Link to={item.path}>{item.name}</Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <ul className="header__menu_dropdown">
        {menu.child.map((child, childKey) => {
          if (child.name === "Đăng xuất") {
            return (
              <li key={childKey}>
                <a
                  href="#!" 
                  onClick={(e) => {
                    e.preventDefault(); 
                    logout(); 
                    setCurrentUser(null); 
                    navigate(ROUTERS.USER.LOGIN); 
                  }}
                >
                  {child.name}
                </a>
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
                    <Link to={menu.path || "#"}>{menu.name}</Link>
                    {menu.child && renderDropdown(menu)}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="header__utilities">
              {/* ✅ SỬA PHẦN SEARCH */}
              <form className="header__search" onSubmit={handleSearch}>
                <input 
                  type="text" 
                  placeholder="Tìm kiếm sản phẩm..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button type="submit">
                  <GrSearch />
                </button>
              </form>

              <div className="header__cart">
                <Link to={ROUTERS.CUSTOMER.CART} className="cart-icon-wrapper">
                  <AiOutlineShoppingCart />
                  {cartCount !== null && ( 
                    <span className="cart-count">{cartCount}</span>
                  )}
                </Link>
              </div>

              <div className="header__account">
                {currentUser ? (
                  <div className="account-menu">
                    <BsFillPersonFill />
                    <span>{currentUser.username || "Tài khoản"}</span>
                    {menus.length > 2 && renderDropdown(menus[2])}
                  </div>
                ) : (
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