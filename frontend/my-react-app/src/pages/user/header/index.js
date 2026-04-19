// import { memo, useState, useEffect } from "react";
// import "./style.scss";
// import {
//   BsFillPersonFill,
// } from "react-icons/bs";
// import { GrSearch } from "react-icons/gr";
// import { AiOutlineShoppingCart } from "react-icons/ai";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { formatter } from "utils/formatter";
// import { ROUTERS } from "utils/router";
// import { getMainMenu, getCustomerMenu, DEFAULT_MENU, DEFAULT_CUSTOMER_MENU } from "services/navigationApi";

// const Header = () => {
//   const [menus, setMenus] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const location = useLocation();
//   const navigate = useNavigate();

//   // ✅ THÊM STATE CHO SEARCH
//   const [searchQuery, setSearchQuery] = useState("");

//   const isCustomerPage = location.pathname.includes("/customer/home");

//   useEffect(() => {
//     const fetchMenu = async () => {
//       try {
//         const data = isCustomerPage ? await getCustomerMenu() : await getMainMenu();
//         setMenus(data);
//       } catch (error) {
//         console.error("Lỗi tải menu:", error);
//         setMenus(isCustomerPage ? DEFAULT_CUSTOMER_MENU : DEFAULT_MENU);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMenu();
//   }, [isCustomerPage]);

//   // ✅ HÀM XỬ LÝ SEARCH
//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       const searchRoute = isCustomerPage ? ROUTERS.CUSTOMER.SEARCH : ROUTERS.USER.SEARCH;
//       navigate(`${searchRoute}?q=${encodeURIComponent(searchQuery.trim())}`);
//     }
//   };

//   // ✅ XỬ LÝ KHI NHẤN ENTER
//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSearch(e);
//     }
//   };

//   const renderDropdown = (menu) => {
//     if (!menu.child || menu.child.length === 0) return null;

//     const hasColumns = menu.child.length > 0 && menu.child[0].subchild;

//     if (hasColumns) {
//       return (
//         <ul className="header__menu_dropdown laptop-dropdown">
//           {menu.child.map((column, columnKey) => (
//             <li key={columnKey} className="dropdown-column">
//               <span className="section-title">{column.name}:</span>
//               <ul className="sub-dropdown">
//                 {column.subchild.map((item, itemKey) => (
//                   <li key={itemKey}>
//                     <Link to={item.path}>{item.name}</Link>
//                   </li>
//                 ))}
//               </ul>
//             </li>
//           ))}
//         </ul>
//       );
//     }

//     return (
//       <ul className="header__menu_dropdown">
//         {menu.child.map((child, childKey) => (
//           <li key={childKey}>
//             <Link to={child.path}>{child.name}</Link>
//           </li>
//         ))}
//       </ul>
//     );
//   };

//   if (loading) return <header className="header">...</header>;

//   return (
//     <header className="header">
//       <div className="header__top">
//         <div className="container">
//           <div className="header__top_content">
//             Sản phẩm chính hãng - Đảm bảo chất lượng - Giao hàng toàn quốc
//           </div>
//         </div>
//       </div>

//       <div className="header__main">
//         <div className="container">
//           <div className="header__main_content">
//             <div className="header__logo">
//               <Link to={isCustomerPage ? ROUTERS.CUSTOMER.HOME : ROUTERS.USER.HOME}>
//                 <h1>HTV</h1>
//               </Link>
//             </div>

//             <nav className="header__menu">
//               <ul>
//                 {menus.slice(0, 2).map((menu, menuKey) => (
//                   <li key={menuKey} className={location.pathname === menu.path ? "active" : ""}>
//                     <Link to={menu.path || "#"}>{menu.name}</Link>
//                     {menu.child && renderDropdown(menu)}
//                   </li>
//                 ))}
//               </ul>
//             </nav>

//             <div className="header__utilities">
//               {/* ✅ SỬA PHẦN SEARCH */}
//               <form className="header__search" onSubmit={handleSearch}>
//                 <input 
//                   type="text" 
//                   placeholder="Tìm kiếm sản phẩm..." 
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                 />
//                 <button type="submit">
//                   <GrSearch />
//                 </button>
//               </form>

//               <div className="header__cart">
//                 <Link to={isCustomerPage ? ROUTERS.CUSTOMER.CART : ROUTERS.USER.LOGIN}>
//                   <AiOutlineShoppingCart />
//                 </Link>
//               </div>

//               <div className="header__account">
//                 {menus.length > 2 && (
//                   <div className="account-menu">
//                     <BsFillPersonFill />
//                     <span>{menus[2].name}</span>
//                     {menus[2].child && renderDropdown(menus[2])}
//                   </div>
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
import { memo, useState, useEffect } from "react";
import "./style.scss";
import { BsFillPersonFill } from "react-icons/bs";
import { GrSearch } from "react-icons/gr";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTERS } from "utils/router";
import { suggestSearch } from "api/searchApi";
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
  const [suggestions, setSuggestions] = useState([]);
const [showSuggest, setShowSuggest] = useState(false);
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
  }, [location.pathname]); // Chạy lại khi đổi trang
useEffect(() => {
  if (!searchQuery.trim()) {
    setSuggestions([]);
    setShowSuggest(false);
    return;
  }

  const delay = setTimeout(async () => {
    try {
      const data = await suggestSearch(searchQuery);
      setSuggestions(data);
      setShowSuggest(true);
    } catch (e) {
      console.error("Suggest error:", e);
    }
  }, 300);

  return () => clearTimeout(delay);
}, [searchQuery]);
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
                  // Ẩn menu Tài khoản/Đăng nhập khỏi thanh menu chính (vì nó nằm góc phải)
                  if (menu.name === "Tài khoản" || menu.name === "Đăng nhập") return null;

                  return (
                    <li key={menuKey} className={location.pathname === menu.path ? "active" : ""}>
                      <Link to={menu.path || "#"}>{menu.name}</Link>
                      {menu.child && renderDropdown(menu)}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="header__utilities">
              
              {/* SEARCH */}
              <div className="header__search">
  <form onSubmit={handleSearch}>
    <input 
      type="text" 
      placeholder="Tìm kiếm sản phẩm..." 
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyPress={handleKeyPress}
      onFocus={() => searchQuery && setShowSuggest(true)}
      onBlur={() => setTimeout(() => setShowSuggest(false), 200)}
    />
    <button type="submit"><GrSearch /></button>
  </form>

  {showSuggest && (
    <div className="suggest-box">
      {suggestions.length === 0 && (
        <div className="no-result">Không tìm thấy</div>
      )}

      {suggestions.map((item) => (
        <div
          key={item.id}
          className="suggest-item"
          onMouseDown={() => {
  navigate(ROUTERS.USER.PRODUCTDETAIL.replace(":id", item.id));
  setShowSuggest(false);
  setSearchQuery("");
}}
        >
          <img 
  src={item.image ? `http://localhost:8080${item.image}` : "/no-image.png"} 
  alt={item.name}
  style={{
    width: "50px",
    height: "50px",
    objectFit: "cover",
    borderRadius: "6px"
  }}
/>

          <div className="info">
            <div className="name">{item.name}</div>
            <div className="price">
              {item.price?.toLocaleString()}₫
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

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