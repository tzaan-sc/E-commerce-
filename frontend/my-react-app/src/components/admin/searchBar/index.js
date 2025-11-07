import React from 'react';
import { Search } from 'lucide-react';
import './style.scss';

const SearchBar = ({ placeholder, value, onChange }) => (
  <div className="search-box">
    <Search className="search-icon" size={18} />
    <input 
      type="text" 
      className="search-input" 
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

export default SearchBar;