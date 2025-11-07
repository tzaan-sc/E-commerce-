import React, { useState } from 'react';
import { User } from 'lucide-react';
import './style.scss';

const Header = ({ onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="main-header">
      <div className="user-menu">
        <button 
          className="user-button" 
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <User size={20} />
        </button>
        {showDropdown && (
          <div className="user-dropdown">
            <div className="dropdown-item" onClick={onLogout}>
              Đăng xuất
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;