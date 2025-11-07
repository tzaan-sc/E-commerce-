import React from 'react';
import { Package, ShoppingCart, Users, Tag, Menu } from 'lucide-react';
import './style.scss';

const Sidebar = ({ collapsed, onToggle, activeMenu, onMenuChange }) => {
  const menuItems = [
    { id: 'products', icon: Package, label: 'Sản phẩm' },
    { id: 'orders', icon: ShoppingCart, label: 'Đơn hàng' },
    { id: 'accounts', icon: Users, label: 'Tài khoản' },
    { id: 'categories', icon: Tag, label: 'Danh mục' }
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : 'expanded'}`}>
      <div className="sidebar-header">
        {!collapsed && <div className="sidebar-title">QUẢN TRỊ</div>}
        <button className="menu-toggle" onClick={onToggle}>
          <Menu size={24} />
        </button>
      </div>
      
      <ul className="sidebar-menu">
        {menuItems.map(item => (
          <li 
            key={item.id}
            className={`menu-item ${activeMenu === item.id ? 'active' : ''}`} 
            onClick={() => onMenuChange(item.id)}
          >
            <item.icon className="menu-icon" size={24} />
            {!collapsed && <span>{item.label}</span>}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;