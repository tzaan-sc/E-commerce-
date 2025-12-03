import { memo, useState, useEffect } from "react";
import "./style.scss";
import {
  BsFillPersonFill,
} from "react-icons/bs";
import { GrSearch } from "react-icons/gr";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { formatter } from "utils/formatter";
import { ROUTERS } from "utils/router";
import { getMainMenu, getCustomerMenu, DEFAULT_MENU, DEFAULT_CUSTOMER_MENU } from "services/navigationApi";

const Header = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ THÊM STATE CHO SEARCH
  const [searchQuery, setSearchQuery] = useState("");

  const isCustomerPage = location.pathname.includes("/customer/home");

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = isCustomerPage ? await getCustomerMenu() : await getMainMenu();
        setMenus(data);
      } catch (error) {
        console.error("Lỗi tải menu:", error);
        setMenus(isCustomerPage ? DEFAULT_CUSTOMER_MENU : DEFAULT_MENU);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [isCustomerPage]);

  // ✅ HÀM XỬ LÝ SEARCH
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const searchRoute = isCustomerPage ? ROUTERS.CUSTOMER.SEARCH : ROUTERS.USER.SEARCH;
      navigate(`${searchRoute}?q=${encodeURIComponent(searchQuery.trim())}`);
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
        {menu.child.map((child, childKey) => (
          <li key={childKey}>
            <Link to={child.path}>{child.name}</Link>
          </li>
        ))}
      </ul>
    );
  };

  if (loading) return <header className="header">...</header>;

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
              <Link to={isCustomerPage ? ROUTERS.CUSTOMER.HOME : ROUTERS.USER.HOME}>
                <h1>LOGO</h1>
              </Link>
            </div>

            <nav className="header__menu">
              <ul>
                {menus.slice(0, 2).map((menu, menuKey) => (
                  <li key={menuKey} className={location.pathname === menu.path ? "active" : ""}>
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
                <Link to={isCustomerPage ? ROUTERS.CUSTOMER.CART : ROUTERS.USER.LOGIN}>
                  <AiOutlineShoppingCart />
                </Link>
              </div>

              <div className="header__account">
                {menus.length > 2 && (
                  <div className="account-menu">
                    <BsFillPersonFill />
                    <span>{menus[2].name}</span>
                    {menus[2].child && renderDropdown(menus[2])}
                  </div>
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