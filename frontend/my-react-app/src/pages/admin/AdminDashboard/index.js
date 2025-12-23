import React, { useState, useEffect, useRef, useMemo } from 'react';
import ProductsPage from '../ProductsPage';
import OrdersPage from '../OrdersPage';
import AccountsPage from '../AccountsPage';
import BrandsPage from '../BrandsPage';
import UsagePurposePage from '../UsagePurposePage';
import ScreenSizePage from '../ScreenSizePage';
import DashboardPage from '../dashboardPage';
import {
  LayoutDashboard,
  Laptop,
  Users,
  ShoppingCart,
  Tag,
  Monitor,
  Target,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import '../style.scss';

// Router simulation
const AdminDashboard = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', name: 'Sản phẩm', icon: Laptop },
    { id: 'orders', name: 'Đơn hàng', icon: ShoppingCart },
    { id: 'accounts', name: 'Tài khoản', icon: Users },
    {
      id: 'categories',
      name: 'Danh mục',
      icon: Tag,
      submenu: [
        { id: 'brands', name: 'Thương hiệu', icon: Tag },
        { id: 'usage', name: 'Nhu cầu sử dụng', icon: Target },
        { id: 'screensize', name: 'Kích thước màn hình', icon: Monitor },
      ],
    },
  ];

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      // Xóa token khỏi localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redirect về trang đăng nhập
      window.location.href = '/dang-nhap';
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': // 👇 THAY ĐỔI: Truyền setter xuống DashboardPage
        return <DashboardPage setCurrentPage={setCurrentPage} />;
      case 'products':
        return <ProductsPage />;
      case 'orders':
        return <OrdersPage />;
      case 'accounts':
        return <AccountsPage />;
      case 'brands':
        return <BrandsPage />;
      case 'usage':
        return <UsagePurposePage />;
      case 'screensize':
        return <ScreenSizePage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside
        className={`sidebar ${
          sidebarOpen ? 'sidebar--open' : 'sidebar--closed'
        }`}
      >
        <div className="sidebar__header">
          {sidebarOpen && <h1 className="sidebar__title">Admin Panel</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="sidebar__toggle"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar__nav">
          {menuItems.map((item) => (
            <div key={item.id} className="sidebar__menu-group">
              <button
                onClick={() => !item.submenu && setCurrentPage(item.id)}
                className={`sidebar__menu-item ${
                  currentPage === item.id ? 'sidebar__menu-item--active' : ''
                }`}
              >
                <item.icon size={20} />
                {sidebarOpen && (
                  <span className="sidebar__menu-text">{item.name}</span>
                )}
              </button>

              {item.submenu && sidebarOpen && (
                <div className="sidebar__submenu">
                  {item.submenu.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => setCurrentPage(subItem.id)}
                      className={`sidebar__submenu-item ${
                        currentPage === subItem.id
                          ? 'sidebar__submenu-item--active'
                          : ''
                      }`}
                    >
                      <subItem.icon size={16} />
                      <span>{subItem.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="sidebar__footer">
          <button className="sidebar__logout" onClick={handleLogout}>
            <LogOut size={20} />
            {sidebarOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="main-content__header">
          <h2 className="main-content__title">
            {menuItems.find((m) => m.id === currentPage)?.name ||
              menuItems
                .flatMap((m) => m.submenu || [])
                .find((s) => s.id === currentPage)?.name}
          </h2>
        </div>
        <div className="main-content__body">{renderPage()}</div>
      </main>
    </div>
  );
};

export default AdminDashboard;
