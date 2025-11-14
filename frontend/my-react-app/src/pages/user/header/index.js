import { memo, useState, useEffect } from "react";
import "./style.scss";
import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsFillPersonFill,
} from "react-icons/bs";
import { GrSearch } from "react-icons/gr";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from "react-router-dom";
import { formatter } from "utils/formatter";
import { ROUTERS } from "utils/router";
import { getMainMenu, DEFAULT_MENU } from "services/navigationApi";

const Header = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch menu từ API khi component mount
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        console.log("🔄 Đang gọi API navigation...");
        console.log("📍 API URL:", process.env.REACT_APP_API_URL);
        
        const data = await getMainMenu();
        
        console.log("✅ Dữ liệu nhận được:", data);
        setMenus(data);
        setLoading(false);
      } catch (error) {
        console.error("❌ Lỗi khi tải menu:", error);
        console.error("❌ Error message:", error.message);
        console.error("❌ Error response:", error.response);
        
        // Fallback: dùng menu mặc định nếu API lỗi
        console.log("⚠️ Sử dụng menu mặc định");
        setMenus(DEFAULT_MENU);
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const renderDropdown = (menu) => {
    if (!menu.child || menu.child.length === 0) return null;

    // Kiểm tra xem child có cấu trúc column không (dành cho Laptop)
    const hasColumns = menu.child.length > 0 && menu.child[0].subchild;

    if (hasColumns) {
      // Render dropdown dạng nhiều cột (cho Laptop)
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

    // Render dropdown đơn giản (cho Tài khoản)
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

  if (loading) {
    return (
      <header className="header">
        <div className="header__top">
          <div className="container">
            <div className="header__top_content">Đang tải...</div>
          </div>
        </div>
      </header>
    );
  }

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
              <Link to={ROUTERS.USER.HOME}>
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
              <div className="header__search">
                <input type="text" placeholder="Tìm kiếm sản phẩm..." />
                <button type="button">
                  <Link to={ROUTERS.USER.SEARCH}>
                    <GrSearch />
                  </Link>
                </button>
              </div>

              <div className="header__cart">
                <Link to={ROUTERS.USER.LOGIN}>
                  <AiOutlineShoppingCart />
                  {/* <span className="cart-count">5</span> */}
                </Link>
              </div>

              <div className="header__account">
                {menus.slice(2).map((menu, menuKey) => (
                  <div key={`account-${menuKey}`} className="account-menu">
                    <BsFillPersonFill />
                    <span>{menu.name}</span>
                    {menu.child && renderDropdown(menu)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);