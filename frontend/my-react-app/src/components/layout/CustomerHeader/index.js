import { memo, useState, useEffect } from "react";
import "./style.scss";
import { BsFillPersonFill } from "react-icons/bs";
import { GrSearch } from "react-icons/gr";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ROUTERS } from "utils/router";
import { useAuth } from "hooks/useAuth";
import { useCart } from "context/index";

import { 
  DEFAULT_MENU, 
  DEFAULT_CUSTOMER_MENU 
} from "services/navigationApi";

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, fetchCartCount } = useCart();

  const [currentUser, setCurrentUser] = useState(null);
  const [menus, setMenus] = useState([]); 
  const [searchQuery, setSearchQuery] = useState("");

  // 1. KHỞI TẠO HEADER
  useEffect(() => {
    const initHeader = async () => {
      const userStored = JSON.parse(localStorage.getItem("user"));
      setCurrentUser(userStored);

      if (userStored) {
        setMenus(DEFAULT_CUSTOMER_MENU);
        fetchCartCount(); 
      } else {
        setMenus(DEFAULT_MENU);
      }
    };

    initHeader();
    const handleStorageChange = () => initHeader();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchCartCount]); // Thêm fetchCartCount để fix cảnh báo ESLint

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
        const isCustomer = !!currentUser;
        const searchPath = isCustomer ? ROUTERS.CUSTOMER.SEARCH : ROUTERS.USER.SEARCH;
        navigate(`${searchPath}?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    setCurrentUser(null);
    setMenus(DEFAULT_MENU);
    localStorage.removeItem("user");
    navigate(ROUTERS.USER.LOGIN);
  };

  const renderDropdown = (menu) => {
    if (!menu.child || menu.child.length === 0) return null;
    const hasColumns = menu.child.length > 0 && menu.child[0].subchild;

    if (hasColumns) {
      const laptopBasePath = currentUser ? ROUTERS.CUSTOMER.LAPTOP : ROUTERS.USER.LAPTOP;
      return (
        <ul className="header__menu_dropdown laptop-dropdown">
          {menu.child.map((column, colKey) => (
            <li key={colKey} className="dropdown-column">
              <span className="section-title">{column.name}:</span>
              <ul className="sub-dropdown">
                {column.subchild.map((item, itemKey) => {
                    let linkTo = item.path || "#"; 
                    const colName = column.name.toUpperCase();
                    if (item.id) {
                        if (colName.includes("THƯƠNG") || colName.includes("BRAND")) linkTo = `${laptopBasePath}?brand=${item.id}`;
                        else if (colName.includes("NHU CẦU") || colName.includes("PURPOSE")) linkTo = `${laptopBasePath}?purpose=${item.id}`;
                        else if (colName.includes("MÀN") || colName.includes("SIZE")) linkTo = `${laptopBasePath}?screenSize=${item.id}`;
                    }
                    return (
                      <li key={itemKey}><Link to={linkTo}>{item.name}</Link></li>
                    );
                })}
              </ul>
            </li>
          ))}
        </ul>
      );
    }
    return (
      <ul className="header__menu_dropdown">
        {menu.child.map((child, childKey) => {
          if (!["Thông tin tài khoản", "Đơn mua", "Đăng xuất"].includes(child.name)) return null;
          if (child.name === "Đăng xuất") return <li key={childKey}><a href="#!" onClick={handleLogout}>{child.name}</a></li>;
          return <li key={childKey}><Link to={child.path}>{child.name}</Link></li>;
        })}
      </ul>
    );
  };

  const renderUserAvatar = () => {
    if (currentUser?.avatarUrl) {
        const avatarSrc = currentUser.avatarUrl.startsWith("http") 
            ? currentUser.avatarUrl 
            : `http://localhost:8080${currentUser.avatarUrl}`;
            
        return (
            <img 
                src={avatarSrc} 
                alt="Avatar" 
                style={{
                    width: "24px", 
                    height: "24px", 
                    borderRadius: "50%", 
                    objectFit: "cover",
                    marginRight: "5px",
                    border: "1px solid #ddd"
                }} 
                onError={(e) => {
                    e.target.style.display = 'none'; 
                    e.target.nextSibling.style.display = 'block'; 
                }}
            />
        );
    }
    return <BsFillPersonFill className="default-icon" />;
  };

  // 👇 HÀM XỬ LÝ ĐƯỜNG DẪN KHUYẾN MÃI LINH HOẠT
  const getPromoPath = () => {
    return currentUser ? "/customer/home/khuyen-mai" : "/khuyen-mai";
  };

  return (
    <header className="header">
      <div className="header__top">
        <div className="container">
          <div className="header__top_content">Sản phẩm chính hãng - Đảm bảo chất lượng</div>
        </div>
      </div>

      <div className="header__main">
        <div className="container">
          <div className="header__main_content">
            <div className="header__logo">
              <Link to={currentUser ? ROUTERS.CUSTOMER.HOME : ROUTERS.USER.HOME}><h1>HTV</h1></Link>
            </div>

            <nav className="header__menu">
              <ul>
                {menus.map((menu, menuKey) => {
                  if (menu.name === "Tài khoản" || menu.name === "Đăng nhập") return null;
                  let menuPath = menu.path;
                  if (menu.name === "Laptop" && currentUser) menuPath = ROUTERS.CUSTOMER.LAPTOP; 
                  return (
                    <li key={menuKey} className={location.pathname === menuPath ? "active" : ""}>
                      <Link to={menuPath || "#"}>{menu.name}</Link>
                      {menu.child && renderDropdown(menu)}
                    </li>
                  );
                })}

                {/* 👇 THÊM MỤC KHUYẾN MÃI CHO CUSTOMER TẠI ĐÂY */}
                <li className={location.pathname.includes("khuyen-mai") ? "active" : ""}>
                  <Link to={getPromoPath()}>
                    Khuyến mãi
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="header__utilities">
              <form className="header__search" onSubmit={handleSearch}>
                <input type="text" placeholder="Tìm kiếm..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <button type="submit"><GrSearch /></button>
              </form>

              <div className="header__cart">
                <Link to={currentUser ? ROUTERS.CUSTOMER.CART : ROUTERS.USER.LOGIN} className="cart-icon-wrapper">
                  <AiOutlineShoppingCart />
                  {currentUser && cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                </Link>
              </div>

              <div className="header__account">
                {currentUser ? (
                  <div className="account-menu">
                    {renderUserAvatar()}
                    <BsFillPersonFill className="fallback-icon" style={{display: 'none'}} />
                    <span>{currentUser.username || "Tài khoản"}</span>
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