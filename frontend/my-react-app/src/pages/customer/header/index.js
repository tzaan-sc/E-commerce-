// import { memo, useState, useEffect } from "react";
// import "./style.scss";
// import { BsFillPersonFill } from "react-icons/bs";
// import { GrSearch } from "react-icons/gr";
// import { AiOutlineShoppingCart } from "react-icons/ai";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { ROUTERS } from "utils/router";
// import { useAuth } from "hooks/useAuth";
// import { useCart } from "context/index";

// import { 
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
//   const [searchQuery, setSearchQuery] = useState("");

//   // 1. KHỞI TẠO DỮ LIỆU HEADER
//   useEffect(() => {
//     const initHeader = () => {
//       // Lấy user từ localStorage
//       const userStored = JSON.parse(localStorage.getItem("user"));
//       setCurrentUser(userStored);

//       // Xác định Menu dựa trên trạng thái đăng nhập
//       if (userStored) {
//         setMenus(DEFAULT_CUSTOMER_MENU);
//         fetchCartCount(); // Cập nhật giỏ hàng nếu đã đăng nhập
//       } else {
//         setMenus(DEFAULT_MENU);
//       }
//     };

//     initHeader();

//     // Lắng nghe sự kiện storage để đồng bộ giữa các tab (nếu cần)
//     const handleStorageChange = () => initHeader();
//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []); // Chỉ chạy 1 lần khi mount

//   // 2. XỬ LÝ TÌM KIẾM
//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//         const isCustomer = !!currentUser;
//         const searchPath = isCustomer ? ROUTERS.CUSTOMER.SEARCH : ROUTERS.USER.SEARCH;
//         // encodeURIComponent để xử lý ký tự đặc biệt
//         navigate(`${searchPath}?q=${encodeURIComponent(searchQuery.trim())}`);
//     }
//   };

//   // 3. XỬ LÝ ĐĂNG XUẤT
//   const handleLogout = (e) => {
//     e.preventDefault();
//     logout();
//     setCurrentUser(null);
//     setMenus(DEFAULT_MENU);
//     localStorage.removeItem("user");
//     navigate(ROUTERS.USER.LOGIN);
//   };

//   // 4. RENDER MENU CON (DROPDOWN)
//   const renderDropdown = (menu) => {
//     if (!menu.child || menu.child.length === 0) return null;

//     // Kiểm tra xem menu này có phải dạng Mega Menu (có cột con) không
//     const hasColumns = menu.child.length > 0 && menu.child[0].subchild;

//     // --- TRƯỜNG HỢP 1: MEGA MENU (Laptop) ---
//     if (hasColumns) {
//       const laptopBasePath = currentUser ? ROUTERS.CUSTOMER.LAPTOP : ROUTERS.USER.LAPTOP;

//       return (
//         <ul className="header__menu_dropdown laptop-dropdown">
//           {menu.child.map((column, colKey) => (
//             <li key={colKey} className="dropdown-column">
//               <span className="section-title">{column.name}:</span>
//               <ul className="sub-dropdown">
//                 {column.subchild?.map((item, itemKey) => {
//                     let linkTo = item.path;
//                     const colName = column.name.toUpperCase();

//                     // Logic tạo link filter: /laptop?brand=1 hoặc /laptop?purpose=2
//                     if (colName.includes("THƯƠNG HIỆU") && item.id) {
//                         linkTo = `${laptopBasePath}?brand=${item.id}`;
//                     } else if (colName.includes("NHU CẦU") && item.id) {
//                         linkTo = `${laptopBasePath}?purpose=${item.id}`;
//                     } else if ((colName.includes("MÀN HÌNH") || colName.includes("KÍCH THƯỚC")) && item.id) {
//                         linkTo = `${laptopBasePath}?screenSize=${item.id}`;
//                     }

//                     return (
//                       <li key={itemKey}>
//                         <Link to={linkTo}>{item.name}</Link>
//                       </li>
//                     );
//                 })}
//               </ul>
//             </li>
//           ))}
//         </ul>
//       );
//     }

//     // --- TRƯỜNG HỢP 2: DROPDOWN ĐƠN GIẢN (Tài khoản) ---
//     return (
//       <ul className="header__menu_dropdown">
//         {menu.child.map((child, childKey) => {
//           // Lọc các item được phép hiển thị
//           const allowedItems = ["Thông tin tài khoản", "Đơn mua", "Đăng xuất"];
//           if (!allowedItems.includes(child.name)) return null;
          
//           if (child.name === "Đăng xuất") {
//             return (
//               <li key={childKey}>
//                 <a href="#!" onClick={handleLogout}>{child.name}</a>
//               </li>
//             );
//           }
//           return <li key={childKey}><Link to={child.path}>{child.name}</Link></li>;
//         })}
//       </ul>
//     );
//   };

//   return (
//     <header className="header">
//       <div className="header__top">
//         <div className="container">
//           <div className="header__top_content">
//              Sản phẩm chính hãng - Đảm bảo chất lượng - Giao hàng toàn quốc
//           </div>
//         </div>
//       </div>

//       <div className="header__main">
//         <div className="container">
//           <div className="header__main_content">
            
//             {/* LOGO */}
//             <div className="header__logo">
//               <Link to={currentUser ? ROUTERS.CUSTOMER.HOME : ROUTERS.USER.HOME}>
//                 <h1>HTV</h1>
//               </Link>
//             </div>

//             {/* MENU CHÍNH */}
//             <nav className="header__menu">
//               <ul>
//                 {menus.map((menu, menuKey) => {
//                   // Chỉ hiển thị các menu chính (Trang chủ, Laptop, Liên hệ...) 
//                   // Bỏ qua menu "Tài khoản" vì nó nằm ở góc phải
//                   if (menu.name === "Tài khoản" || menu.name === "Đăng nhập") return null;

//                   // Xử lý link cho menu "Laptop"
//                   let menuPath = menu.path;
//                   if (menu.name === "Laptop" && currentUser) {
//                       menuPath = ROUTERS.CUSTOMER.LAPTOP; 
//                   }

//                   return (
//                     <li key={menuKey} className={location.pathname === menuPath ? "active" : ""}>
//                       <Link to={menuPath || "#"}>{menu.name}</Link>
//                       {menu.child && renderDropdown(menu)}
//                     </li>
//                   );
//                 })}
//               </ul>
//             </nav>

//             <div className="header__utilities">
//               {/* SEARCH BOX */}
//               <form className="header__search" onSubmit={handleSearch}>
//                 <input 
//                     type="text" 
//                     placeholder="Tìm kiếm sản phẩm..." 
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//                 <button type="submit">
//                     <GrSearch />
//                 </button>
//               </form>

//               {/* CART ICON */}
//               <div className="header__cart">
//                 <Link to={currentUser ? ROUTERS.CUSTOMER.CART : ROUTERS.USER.LOGIN} className="cart-icon-wrapper">
//                   <AiOutlineShoppingCart />
//                   {currentUser && cartCount > 0 && (
//                     <span className="cart-count">{cartCount}</span>
//                   )}
//                 </Link>
//               </div>

//               {/* ACCOUNT ICON */}
//               <div className="header__account">
//                 {currentUser ? (
//                   <div className="account-menu">
//                     <BsFillPersonFill />
//                     <span>{currentUser.username || "Tài khoản"}</span>
//                     {/* Tìm menu có tên "Tài khoản" trong danh sách menus để render dropdown */}
//                     {renderDropdown(menus.find(m => m.name === "Tài khoản") || { child: [] })}
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
  }, []);

  // ... (Các hàm handleSearch, handleLogout, renderDropdown GIỮ NGUYÊN) ...
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

  // 👇 HÀM HIỂN THỊ AVATAR HOẶC ICON
  const renderUserAvatar = () => {
    if (currentUser?.avatarUrl) {
        // Nếu đường dẫn là URL đầy đủ (http...) thì dùng luôn, nếu không thì thêm localhost
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
                onError={(e) => { // Nếu ảnh lỗi thì quay về icon mặc định
                    e.target.style.display = 'none'; 
                    e.target.nextSibling.style.display = 'block'; 
                }}
            />
        );
    }
    // Mặc định hiển thị Icon nếu không có avatar
    return <BsFillPersonFill className="default-icon" />;
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
                    {/* 👇 GỌI HÀM RENDER AVATAR Ở ĐÂY */}
                    {renderUserAvatar()}
                    {/* Fallback Icon (ẩn mặc định, chỉ hiện khi ảnh lỗi) */}
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