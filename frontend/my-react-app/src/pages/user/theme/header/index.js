import { memo, useState } from "react";
import "./style.scss";
import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsFillPersonFill,
} from "react-icons/bs";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from "react-router-dom";
import { formatter } from "utils/formatter";
import Cauousel from "components/carousel";
import Sidebar from "components/sideBar";
import Navbar from "components/navBar";
import { ROUTERS } from "utils/router";
const Header = () => {
    const [menus, setMenus] =useState([
        {
            name: "Trang chủ",
            path: ROUTERS.USER.HOME,
        },
        {
            name: "ThÔng báo",
            path: ROUTERS.USER.NOTIFICATION,
        },
        {
            name: "Hỗ trợ",
            path: ROUTERS.USER.SUPPORT,
        },
        {
            name: "Tài khoản",
            path: "",
            isShowSubmenu: false,
            child: [
                {
                    name: "Tài khoản của tôi",
                    path: ROUTERS.USER.ACCOUNT,
                },
                {
                    name: "Đăng xuất",
                    path: "",
                },
            ],

        },
    ])
  return (
    <>
      <div className="header__top">
        <div className="container">
          <div className="row">    
              <div className="header__top_top"> 
                Freeship đơn từ {formatter(100000)}, vận chuyển toàn quốc
              </div>    
                          
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-xl-3">
            <div className="header__logo">
              <h1>ITSHOP</h1>
            </div>
          </div>
          <div className="col-lg-6 col-xl-6">
            <nav className="header__menu">
                {/* render giao diện*/}
                <ul>
                    {
                        menus?.map((menu, menuKey) => (
                            <li key={menuKey} className={menuKey === 0 ? "active" : ""}>
                                <Link to={menus?.path}>{menu?.name}</Link>
                            {menu?.child && (
        <ul>
          {menu?.child.map((child, childKey) => (
            <li key={childKey}>
              <Link to={child?.path}>{child?.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  ))}
</ul>
                {/* <ul>
                    
                    <li>
                        <Link to="">Hỗ trợ</Link>
                    </li>
                    <li>Tài khoản
                        <ul>
                            <li>
                                <Link to="">Tài khoản của tôi</Link>
                            </li>
                            <li> Đăng xuất</li>
                        </ul>
                    </li>
                </ul> */}
            </nav>
          </div>
          <div className="col-lg-3 col-xl-3">
            <div className="header__cart">
              <ul>
                <li>
                  <Link to="#">
                    <AiOutlineShoppingCart /> <span>   5</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default memo(Header);
