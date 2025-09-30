import { memo } from "react";
import { Link } from 'react-router-dom'; // Dùng Link để điều hướng
import './style.scss';

// Component Icon cho sinh động
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const Sidebar = () => {
  // Dữ liệu cho các danh mục, bao gồm tên và 'slug' để dùng trong URL
  const categories = [
    { name: 'Laptop', slug: 'laptop' },
    { name: 'Điện thoại', slug: 'dien-thoai' },
    { name: 'Phụ kiện khác', slug: 'phu-kien-khac' },
  ];

  return (
    <aside className="sidebar">
      <div className="category-header">
        <MenuIcon />
        <span>Danh mục</span>
      </div>
      <nav>
        <ul className="category-list">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link to={`/danh-muc/${category.slug}`}>{category.name}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;