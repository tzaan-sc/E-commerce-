// // src/components/Header/index.js

// import { memo, useState, useEffect } from "react";
// import "./style.scss";
// import {
//   BsFillPersonFill,
// } from "react-icons/bs";
// import { GrSearch } from "react-icons/gr";
// import { AiOutlineShoppingCart } from "react-icons/ai";
// import { Link, useNavigate } from "react-router-dom"; 
// import { formatter } from "utils/formatter";
// import { ROUTERS } from "utils/router";
// import { useAuth } from "hooks/useAuth"; 

// import { useCart } from "../../../context/index"; 

// const Header = () => {
//   const { logout } = useAuth();
//   const navigate = useNavigate();
  
//   // 👇 2. LẤY CART COUNT
//   const { cartCount, fetchCartCount } = useCart(); 
  
//   const [currentUser, setCurrentUser] = useState(null);

//   // Kiểm tra user khi component load hoặc khi localstorage thay đổi
//   useEffect(() => {
//     const userFromStorage = JSON.parse(localStorage.getItem("user"));
//     setCurrentUser(userFromStorage);
    
//     // Lần đầu load, nếu có user thì fetch cart count
//     if (userFromStorage) {
//         fetchCartCount();
//     }
    
//     // Lắng nghe sự thay đổi của localstorage
//     const handleStorageChange = () => {
//       const updatedUser = JSON.parse(localStorage.getItem("user"));
//       setCurrentUser(updatedUser);
//       if (updatedUser) {
//         fetchCartCount(); // Fetch lại giỏ hàng nếu đăng nhập/thay đổi
//       } else {
//         // Xóa số lượng giỏ hàng nếu đăng xuất
//         // Lỗi: Hàm useCart không cung cấp setCartCount
//         // setGlobalCartCount(0); // Thay thế bằng hàm nào đó nếu có
//       }
//     };
    
//     window.addEventListener('storage', handleStorageChange);
    
//     // Cleanup
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []); // Giữ nguyên dependency array rỗng


//   const [menus] = useState([
//     {
//       name: "Trang chủ",
//       path: ROUTERS.CUSTOMER.HOME,
//     },
//     {
//       name: "Laptop",
//       path: ROUTERS.CUSTOMER.LAPTOP,
//       child: [
//         {
//           name: "Thương hiệu",
//           subchild: [
//             { name: "Dell", path: "" },
//             { name: "HP", path: "" },
//             { name: "Asus", path: "" },
//             { name: "Lenovo", path: "" },
//           ],
//         },
//         {
//           name: "Nhu cầu sử dụng",
//           subchild: [
//             { name: "Gaming", path: "" },
//             { name: "Văn phòng", path: "" },
//             { name: "Thiết kế - Kĩ thuật", path: "" },
//             { name: "Học tập", path: "" },
//           ],
//         },
//         {
//           name: "Kích thước màn hình",
//           subchild: [
//             { name: "13-14 inch", path: "" },
//             { name: "15-16 inch", path: "" },
//             { name: "17 inch trở lên", path: "" },
//           ],
//         },
//       ],
//     },
//     {
//       name: "Tài khoản",
//       child: [
//         { name: "Thông tin tài khoản", path: ROUTERS.CUSTOMER.PROFILE },
//         { name: "Đơn mua", path: ROUTERS.CUSTOMER.MYORDER },
//         { name: "Đăng xuất", path: "#" },
//       ],
//     },
//   ]);

//   const renderDropdown = (menu) => {
//     if (menu.name === "Laptop") {
//       return (
//         <ul className="header__menu_dropdown laptop-dropdown">
//           {menu.child.map((section, sectionKey) => (
//             <li key={sectionKey} className="dropdown-column">
//               <span className="section-title">{section.name}:</span>
//               <ul className="sub-dropdown">
//                 {section.subchild.map((subItem, subKey) => (
//                   <li key={subKey}>
//                     <Link to={subItem.path}>{subItem.name}</Link>
//                   </li>
//                 ))}
//               </ul>
//             </li>
//           ))}
//         </ul>
//       );
//     }

//     // Tài khoản Dropdown
//     return (
//       <ul className="header__menu_dropdown">
//         {menu.child.map((child, childKey) => {
          
//           // Xử lý riêng cho nút "Đăng xuất"
//           if (child.name === "Đăng xuất") {
//             return (
//               <li key={childKey}>
//                 <a
//                   href="#!" 
//                   onClick={(e) => {
//                     e.preventDefault(); 
//                     logout(); 
//                     setCurrentUser(null); // Cập nhật state ngay lập tức
//                     navigate(ROUTERS.USER.LOGIN); // Điều hướng về trang đăng nhập
//                   }}
//                 >
//                   {child.name}
//                 </a>
//               </li>
//             );
//           }

//           // Render bình thường cho các link khác
//           return (
//             <li key={childKey}>
//               <Link to={child.path}>{child.name}</Link>
//             </li>
//           );
//         })}
//       </ul>
//     );
//   };

//   return (
//     <header className="header">
//       <div className="header__top">
//         <div className="container">
//           <div className="header__top_content">
//             Freeship đơn từ {formatter(100000)}, vận chuyển toàn quốc
//           </div>
//         </div>
//       </div>

//       <div className="header__main">
//         <div className="container">
//           <div className="header__main_content">
//             <div className="header__logo">
//               <Link to={ROUTERS.CUSTOMER.HOME}>
//                 <h1>LOGO</h1>
//               </Link>
//             </div>

//             <nav className="header__menu">
//               <ul>
//                 {menus.slice(0, 2).map((menu, menuKey) => (
//                   <li key={menuKey} className={menuKey === 0 ? "active" : ""}>
//                     <Link to={menu.path}>{menu.name}</Link>
//                     {menu.child && renderDropdown(menu)}
//                   </li>
//                 ))}
//               </ul>
//             </nav>

//             <div className="header__utilities">
//               <div className="header__search">
//                 <input type="text" placeholder="Tìm kiếm sản phẩm..." />
//                 <button type="button">
//                   <Link to={ROUTERS.CUSTOMER.SEARCH}>
//                     <GrSearch />
//                   </Link>
//                 </button>
//               </div>

//               {/* 👇 3. CẬP NHẬT CART ICON */}
//               <div className="header__cart">
//                 <Link to={ROUTERS.CUSTOMER.CART} className="cart-icon-wrapper">
//                   <AiOutlineShoppingCart />
//                   {/* Hiển thị badge */}
//                   {cartCount !== null && ( 
//                   <span className="cart-count">{cartCount}</span>
// )}
//                 </Link>
//               </div>

//               <div className="header__account">
//                 {currentUser ? (
//                   // Đã đăng nhập: Hiển thị menu tài khoản
//                   <div className="account-menu">
//                     <BsFillPersonFill />
//                     <span>{currentUser.username || "Tài khoản"}</span>
//                     {renderDropdown(menus[2])}
//                   </div>
//                 ) : (
//                   // Chưa đăng nhập: Hiển thị link Đăng nhập
//                   <Link to={ROUTERS.USER.LOGIN || "/dang-nhap"} className="account-menu login-link">
//                     <BsFillPersonFill />
//                     <span>Đăng nhập</span>
//                   </Link>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default memo(Header); 

// src/components/Header/index.js (Hoặc đường dẫn file header customer của bạn)

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

// Import Menu Data
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

  // =========================================================
  // LOGIC SỬA ĐỔI: ÉP DÙNG MENU CUSTOMER KHI Ở TRANG CUSTOMER
  // =========================================================
  useEffect(() => {
    const initHeader = async () => {
      setLoading(true);
      
      const userStored = JSON.parse(localStorage.getItem("user"));
      setCurrentUser(userStored);

      // 👇 CHECK QUAN TRỌNG: Đang ở trang customer?
      const isCustomerPage = location.pathname.includes("/customer");

      try {
        let menuData = [];

        if (isCustomerPage || userStored) {
          // --- TRƯỜNG HỢP: LÀ CUSTOMER ---
          if(userStored) fetchCartCount();

          // Ưu tiên 1: Lấy từ API
          try {
             // const apiData = await getCustomerMenu(); 
             // ⚠️ TẠM THỜI TẮT API ĐỂ TEST - DÙNG MENU CỨNG ĐỂ ĐẢM BẢO LINK ĐÚNG 100%
             // Nếu API backend trả về link sai, dòng này sẽ gây lỗi. 
             // Hãy dùng DEFAULT_CUSTOMER_MENU trước để chắc chắn frontend đúng.
             const apiData = null; 

             menuData = apiData && apiData.length > 0 ? apiData : DEFAULT_CUSTOMER_MENU;
          } catch (err) {
             menuData = DEFAULT_CUSTOMER_MENU;
          }
        } else {
          // --- TRƯỜNG HỢP: LÀ KHÁCH ---
          try {
             // const apiData = await getMainMenu();
             const apiData = null; // Tương tự, test menu cứng trước
             menuData = apiData && apiData.length > 0 ? apiData : DEFAULT_MENU;
          } catch (err) {
             menuData = DEFAULT_MENU;
          }
        }

        setMenus(menuData);

      } catch (error) {
        console.error("Lỗi header:", error);
        // Fallback cuối cùng
        setMenus(isCustomerPage ? DEFAULT_CUSTOMER_MENU : DEFAULT_MENU);
      } finally {
        setLoading(false);
      }
    };

    initHeader();

    const handleStorageChange = () => initHeader();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);

  }, [location.pathname]); // Chạy lại khi đổi trang

  // ... (Phần renderDropdown giữ nguyên như cũ) ...
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
          
          // 1. CHỈ CHO PHÉP HIỂN THỊ CÁC MỤC SAU:
          const allowedItems = ["Thông tin tài khoản", "Đơn mua", "Đăng xuất"];
          
          // Nếu tên menu KHÔNG nằm trong danh sách cho phép -> Bỏ qua
          if (!allowedItems.includes(child.name)) {
            return null;
          }

          // 2. Xử lý nút Đăng xuất
          if (child.name === "Đăng xuất") {
            return (
              <li key={childKey}>
                <a
                  href="#!" 
                  onClick={(e) => {
                    e.preventDefault(); 
                    logout(); 
                    setCurrentUser(null); 
                    localStorage.removeItem("user");
                    setMenus(DEFAULT_MENU);
                    navigate(ROUTERS.USER.LOGIN); 
                  }}
                >
                  {child.name}
                </a>
              </li>
            );
          }

          // 3. Render các mục còn lại (Thông tin cá nhân, Đơn mua)
          return (
            <li key={childKey}>
              <Link to={child.path}>{child.name}</Link>
            </li>
          );
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
            Freeship đơn từ {formatter(100000)}, vận chuyển toàn quốc
          </div>
        </div>
      </div>

      <div className="header__main">
        <div className="container">
          <div className="header__main_content">
            
            {/* LOGO: Link động */}
            <div className="header__logo">
              <Link to={currentUser ? ROUTERS.CUSTOMER.HOME : ROUTERS.USER.HOME}>
                <h1>LOGO</h1>
              </Link>
            </div>

            {/* MENU: Link từ state menus */}
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
              <div className="header__search">
                <input type="text" placeholder="Tìm kiếm sản phẩm..." />
                <button type="button">
                  <Link to={currentUser ? ROUTERS.CUSTOMER.SEARCH : ROUTERS.USER.SEARCH}>
                    <GrSearch />
                  </Link>
                </button>
              </div>

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
                    {/* Render menu con của phần Tài khoản */}
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