import { memo, useState } from "react";
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

const Header = () => {
  const [menus] = useState([
    {
      name: "Trang chủ",
      path: ROUTERS.USER.HOME,
    },
    {
      name: "Laptop",
      path: ROUTERS.USER.LAPTOP,
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
        { name: "Đăng nhập", path: ROUTERS.USER.LOGIN },
        { name: "Đăng ký", path: ROUTERS.USER.REGISTER },
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

    // Tài khoản
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
                  <Link to={ROUTERS.USER.SEARCH}><GrSearch /></Link>
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
