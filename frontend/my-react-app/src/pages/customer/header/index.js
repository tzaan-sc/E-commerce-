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
  
  // --- 1. THÊM STATE CHO TÌM KIẾM ---
  const [searchQuery, setSearchQuery] = useState("");

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
             const apiData = null; // Tạm thời dùng menu cứng
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

  // --- 2. HÀM XỬ LÝ TÌM KIẾM (MỚI) ---
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
        // Kiểm tra đang là khách hay customer để điều hướng đúng trang search
        const isCustomer = !!currentUser;
        const searchPath = isCustomer ? ROUTERS.CUSTOMER.SEARCH : ROUTERS.USER.SEARCH;
        
        // Chuyển trang kèm từ khóa
        navigate(`${searchPath}?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const renderDropdown = (menu) => {
    if (!menu.child || menu.child.length === 0) return null;
    const hasColumns = menu.child.length > 0 && menu.child[0].subchild;

    if (hasColumns) {
      return (
        <ul className="header__menu_dropdown laptop-dropdown">
          {menu.child.map((column, colKey) => (
            <li key={colKey} className="dropdown-column">
              <span className="section-title">{column.name}:</span>
              <ul className="sub-dropdown">
                {column.subchild.map((item, itemKey) => (
                  <li key={itemKey}><Link to={item.path}>{item.name}</Link></li>
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
          // Bỏ qua 'Giỏ hàng'
          if (child.name === "Giỏ hàng") return null;
          
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
            Freeship đơn từ {formatter(100000)}, vận chuyển toàn quốc
          </div>
        </div>
      </div>

      <div className="header__main">
        <div className="container">
          <div className="header__main_content">
            
            <div className="header__logo">
              <Link to={currentUser ? ROUTERS.CUSTOMER.HOME : ROUTERS.USER.HOME}>
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
              
              {/* --- 3. FORM TÌM KIẾM ĐÃ CẬP NHẬT --- */}
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

// import { memo, useState, useEffect } from "react";
// import "./style.scss";
// import { BsFillPersonFill } from "react-icons/bs";
// import { GrSearch } from "react-icons/gr";
// import { AiOutlineShoppingCart } from "react-icons/ai";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { formatter } from "utils/formatter";
// import { ROUTERS } from "utils/router";
// import { useAuth } from "hooks/useAuth";
// import { useCart } from "context/index";

// // Import Menu Data
// import { 
//   getMainMenu, 
//   getCustomerMenu, 
//   DEFAULT_MENU, 
//   DEFAULT_CUSTOMER_MENU 
// } from "services/navigationApi";

// const Header = () => {
//   const { logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { cartCount, fetchCartCount } = useCart();

//   const [currentUser, setCurrentUser] = useState(null);
//   const [menus, setMenus] = useState([]); 
//   const [loading, setLoading] = useState(true);

//   // =========================================================
//   // LOGIC SỬA ĐỔI: ÉP DÙNG MENU CUSTOMER KHI Ở TRANG CUSTOMER
//   // =========================================================
//   useEffect(() => {
//     const initHeader = async () => {
//       setLoading(true);
      
//       const userStored = JSON.parse(localStorage.getItem("user"));
//       setCurrentUser(userStored);

//       // 👇 CHECK QUAN TRỌNG: Đang ở trang customer?
//       const isCustomerPage = location.pathname.includes("/customer");

//       try {
//         let menuData = [];

//         if (isCustomerPage || userStored) {
//           // --- TRƯỜNG HỢP: LÀ CUSTOMER ---
//           if(userStored) fetchCartCount();

//           // Ưu tiên 1: Lấy từ API
//           try {
//              // const apiData = await getCustomerMenu(); 
//              // ⚠️ TẠM THỜI TẮT API ĐỂ TEST - DÙNG MENU CỨNG ĐỂ ĐẢM BẢO LINK ĐÚNG 100%
//              // Nếu API backend trả về link sai, dòng này sẽ gây lỗi. 
//              // Hãy dùng DEFAULT_CUSTOMER_MENU trước để chắc chắn frontend đúng.
//              const apiData = null; 

//              menuData = apiData && apiData.length > 0 ? apiData : DEFAULT_CUSTOMER_MENU;
//           } catch (err) {
//              menuData = DEFAULT_CUSTOMER_MENU;
//           }
//         } else {
//           // --- TRƯỜNG HỢP: LÀ KHÁCH ---
//           try {
//              // const apiData = await getMainMenu();
//              const apiData = null; // Tương tự, test menu cứng trước
//              menuData = apiData && apiData.length > 0 ? apiData : DEFAULT_MENU;
//           } catch (err) {
//              menuData = DEFAULT_MENU;
//           }
//         }

//         setMenus(menuData);

//       } catch (error) {
//         console.error("Lỗi header:", error);
//         // Fallback cuối cùng
//         setMenus(isCustomerPage ? DEFAULT_CUSTOMER_MENU : DEFAULT_MENU);
//       } finally {
//         setLoading(false);
//       }
//     };

//     initHeader();

//     const handleStorageChange = () => initHeader();
//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);

//   }, [location.pathname]); // Chạy lại khi đổi trang

//   // ... (Phần renderDropdown giữ nguyên như cũ) ...
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
//         {menu.child.map((child, childKey) => {
          
//           // 1. CHỈ CHO PHÉP HIỂN THỊ CÁC MỤC SAU:
//           const allowedItems = ["Thông tin tài khoản", "Đơn mua", "Đăng xuất"];
          
//           // Nếu tên menu KHÔNG nằm trong danh sách cho phép -> Bỏ qua
//           if (!allowedItems.includes(child.name)) {
//             return null;
//           }

//           // 2. Xử lý nút Đăng xuất
//           if (child.name === "Đăng xuất") {
//             return (
//               <li key={childKey}>
//                 <a
//                   href="#!" 
//                   onClick={(e) => {
//                     e.preventDefault(); 
//                     logout(); 
//                     setCurrentUser(null); 
//                     localStorage.removeItem("user");
//                     setMenus(DEFAULT_MENU);
//                     navigate(ROUTERS.USER.LOGIN); 
//                   }}
//                 >
//                   {child.name}
//                 </a>
//               </li>
//             );
//           }

//           // 3. Render các mục còn lại (Thông tin cá nhân, Đơn mua)
//           return (
//             <li key={childKey}>
//               <Link to={child.path}>{child.name}</Link>
//             </li>
//           );
//         })}
//       </ul>
//     );
//   };

//   if (loading) return <header className="header"></header>;

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
            
//             {/* LOGO: Link động */}
//             <div className="header__logo">
//               <Link to={currentUser ? ROUTERS.CUSTOMER.HOME : ROUTERS.USER.HOME}>
//                 <h1>LOGO</h1>
//               </Link>
//             </div>

//             {/* MENU: Link từ state menus */}
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
//               <div className="header__search">
//                 <input type="text" placeholder="Tìm kiếm sản phẩm..." />
//                 <button type="button">
//                   <Link to={currentUser ? ROUTERS.CUSTOMER.SEARCH : ROUTERS.USER.SEARCH}>
//                     <GrSearch />
//                   </Link>
//                 </button>
//               </div>

//               <div className="header__cart">
//                 <Link to={currentUser ? ROUTERS.CUSTOMER.CART : ROUTERS.USER.LOGIN} className="cart-icon-wrapper">
//                   <AiOutlineShoppingCart />
//                   {currentUser && cartCount !== null && cartCount > 0 && (
//                     <span className="cart-count">{cartCount}</span>
//                   )}
//                 </Link>
//               </div>

//               <div className="header__account">
//                 {currentUser ? (
//                   <div className="account-menu">
//                     <BsFillPersonFill />
//                     <span>{currentUser.username || "Tài khoản"}</span>
//                     {/* Render menu con của phần Tài khoản */}
//                     {menus.length > 2 && renderDropdown(menus[menus.length - 1])}
//                   </div>
//                 ) : (
//                   <Link to={ROUTERS.USER.LOGIN} className="account-menu login-link">
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