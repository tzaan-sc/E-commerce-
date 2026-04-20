// src/components/StaffSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Star } from 'lucide-react';
import '../pages/admin/dashboardPage/style.scss'; // Dùng chung style với ADMIN

const StaffSidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <aside className={`sidebar ${isOpen ? "sidebar--open" : "sidebar--closed"}`}>
      <div className="sidebar__header" style={{ justifyContent: isOpen ? "space-between" : "center" }}>
        {isOpen && <h2 className="sidebar__title">Nhân Viên</h2>}
        {/* toggle nút bấm */}
      </div>

      <nav className="sidebar__nav">
        <NavLink 
          to="/staff/dashboard" 
          className={({ isActive }) => `sidebar__menu-item ${isActive ? 'sidebar__menu-item--active' : ''}`}
        >
          <LayoutDashboard size={20} />
          {isOpen && <span className="sidebar__menu-text">Bảng điều khiển</span>}
        </NavLink>

        <NavLink 
          to="/staff/orders" 
          className={({ isActive }) => `sidebar__menu-item ${isActive ? 'sidebar__menu-item--active' : ''}`}
        >
          <ShoppingCart size={20} />
          {isOpen && <span className="sidebar__menu-text">Đơn hàng</span>}
        </NavLink>

        <NavLink 
          to="/staff/reviews" 
          className={({ isActive }) => `sidebar__menu-item ${isActive ? 'sidebar__menu-item--active' : ''}`}
        >
          <Star size={20} />
          {isOpen && <span className="sidebar__menu-text">Đánh giá</span>}
        </NavLink>
      </nav>
    </aside>
  );
};

export default StaffSidebar;
