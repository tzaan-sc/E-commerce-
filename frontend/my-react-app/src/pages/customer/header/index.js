import { memo, useState, useEffect } from "react";
import "./style.scss";
import { BsFillPersonFill } from "react-icons/bs";
import { GrSearch } from "react-icons/gr";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { formatter } from "utils/formatter";
import { ROUTERS } from "utils/router";
import { useAuth } from "hooks/useAuth";
import { useCart } from "context/index";

import { 
  getMainMenu, 
  getCustomerMenu, 
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
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // 1. KHỞI TẠO HEADER
  useEffect(() => {
    const initHeader = async () => {
      setLoading(true);
      const userStored = JSON.parse(localStorage.getItem("user"));
      setCurrentUser(userStored);

      const isCustomerPage = location.pathname.includes("/customer");

      try {
        let menuData = [];
        if (isCustomerPage || userStored) {
          if(userStored) fetchCartCount();
          try {
             const apiData = null; 
             menuData = apiData && apiData.length > 0 ? apiData : DEFAULT_CUSTOMER_MENU;
          } catch (err) {
             menuData = DEFAULT_CUSTOMER_MENU;
          }
        } else {
          try {
             const apiData = null; 
             menuData = apiData && apiData.length > 0 ? apiData : DEFAULT_MENU;
          } catch (err) {
             menuData = DEFAULT_MENU;
          }
        }
        setMenus(menuData);
      } catch (error) {
        console.error("Lỗi header:", error);
        setMenus(isCustomerPage ? DEFAULT_CUSTOMER_MENU : DEFAULT_MENU);
      } finally {
        setLoading(false);
      }
    };

    initHeader();
    const handleStorageChange = () => initHeader();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
        const isCustomer = !!currentUser;
        const searchPath = isCustomer ? ROUTERS.CUSTOMER.SEARCH : ROUTERS.USER.SEARCH;
        navigate(`${searchPath}?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // 2. RENDER DROPDOWN
  const renderDropdown = (menu) => {
    if (!menu.child || menu.child.length === 0) return null;
    const hasColumns = menu.child.length > 0 && menu.child[0].subchild;

    if (hasColumns) {
      // 👇 Logic tạo link chuẩn cho menu con (Brand, Nhu cầu)
      const laptopBasePath = currentUser ? ROUTERS.CUSTOMER.LAPTOP : ROUTERS.USER.LAPTOP;

      return (
        <ul className="header__menu_dropdown laptop-dropdown">
          {menu.child.map((column, colKey) => (
            <li key={colKey} className="dropdown-column">
              <span className="section-title">{column.name}:</span>
              <ul className="sub-dropdown">
                {column.subchild.map((item, itemKey) => {
                    // Mặc định lấy path từ data
                    let linkTo = item.path; 
                    
                    // Nếu data là link tĩnh (/brand/1), chuyển thành query param (/laptop?brand=1)
                    // để tận dụng trang Laptop hiện tại
                    if (column.name.toUpperCase().includes("THƯƠNG HIỆU") && item.id) {
                        linkTo = `${laptopBasePath}?brand=${item.id}`;
                    } else if (column.name.toUpperCase().includes("NHU CẦU") && item.id) {
                        linkTo = `${laptopBasePath}?purpose=${item.id}`;
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

    return (
      <ul className="header__menu_dropdown">
        {menu.child.map((child, childKey) => {
          const allowedItems = ["Thông tin tài khoản", "Đơn mua", "Đăng xuất"];
          if (!allowedItems.includes(child.name)) return null;
          
          if (child.name === "Đăng xuất") {
            return (
              <li key={childKey}>
                <a href="#!" onClick={(e) => {
                    e.preventDefault();
                    logout();
                    setCurrentUser(null);
                    localStorage.removeItem("user");
                    setMenus(DEFAULT_MENU);
                    navigate(ROUTERS.USER.LOGIN);
                  }}>{child.name}</a>
              </li>
            );
          }
          return <li key={childKey}><Link to={child.path}>{child.name}</Link></li>;
        })}
      </ul>
    );
  };

  if (loading) return <header className="header"></header>;

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
            
            <div className="header__logo">
              <Link to={currentUser ? ROUTERS.CUSTOMER.HOME : ROUTERS.USER.HOME}>
                <h1>HTV</h1>
              </Link>
            </div>

            <nav className="header__menu">
              <ul>
                {menus.slice(0, 2).map((menu, menuKey) => {
                  // 👇 3. SỬA LỖI Ở ĐÂY: Ép link "Laptop" cho đúng
                  let menuPath = menu.path;
                  
                  // Nếu là menu Laptop và đang đăng nhập -> Dùng link Customer Laptop
                  if (menu.name === "Laptop" && currentUser) {
                      menuPath = ROUTERS.CUSTOMER.LAPTOP; 
                  }

                  return (
                    <li key={menuKey} className={location.pathname === menuPath ? "active" : ""}>
                      <Link to={menuPath || "#"}>{menu.name}</Link>
                      {menu.child && renderDropdown(menu)}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="header__utilities">
              <form className="header__search" onSubmit={handleSearch}>
                <input 
                    type="text" 
                    placeholder="Tìm kiếm sản phẩm..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">
                    <GrSearch />
                </button>
              </form>

              <div className="header__cart">
                <Link to={currentUser ? ROUTERS.CUSTOMER.CART : ROUTERS.USER.LOGIN} className="cart-icon-wrapper">
                  <AiOutlineShoppingCart />
                  {currentUser && cartCount !== null && cartCount > 0 && (
                    <span className="cart-count">{cartCount}</span>
                  )}
                </Link>
              </div>

              <div className="header__account">
                {currentUser ? (
                  <div className="account-menu">
                    <BsFillPersonFill />
                    <span>{currentUser.username || "Tài khoản"}</span>
                    {menus.length > 2 && renderDropdown(menus[menus.length - 1])}
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