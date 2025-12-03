// components/user/FilterSidebar/index.jsx
import { useState, useEffect } from "react";
import { AiOutlineFilter, AiOutlineClose, AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import apiClient from "api/axiosConfig";
import "./style.scss";

const FilterSidebar = ({ filters, onFilterChange, onClearFilters }) => {
  const [brands, setBrands] = useState([]);
  const [usagePurposes, setUsagePurposes] = useState([]);
  const [screenSizes, setScreenSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Quản lý trạng thái đóng/mở từng section
  const [expandedSections, setExpandedSections] = useState({
    brand: true,
    purpose: true,
    screen: true,
    price: true,
    sort: true
  });

  // Khoảng giá cố định
  const priceRanges = [
    { id: 1, label: 'Dưới 10 triệu', min: 0, max: 10000000 },
    { id: 2, label: '10 - 15 triệu', min: 10000000, max: 15000000 },
    { id: 3, label: '15 - 20 triệu', min: 15000000, max: 20000000 },
    { id: 4, label: '20 - 30 triệu', min: 20000000, max: 30000000 },
    { id: 5, label: 'Trên 30 triệu', min: 30000000, max: 999999999 }
  ];

  // Tùy chọn sắp xếp
  const sortOptions = [
    { value: 'default', label: 'Mặc định' },
    { value: 'price_asc', label: 'Giá tăng dần' },
    { value: 'price_desc', label: 'Giá giảm dần' },
    { value: 'name_asc', label: 'Tên A-Z' },
    { value: 'name_desc', label: 'Tên Z-A' }
  ];

  // Fetch dữ liệu brands, purposes, screen sizes
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        setLoading(true);
        const [brandsRes, purposesRes, screenSizesRes] = await Promise.all([
          apiClient.get("/brands"),
          apiClient.get("/usage-purposes"),
          apiClient.get("/screen-sizes")
        ]);

        setBrands(brandsRes.data || []);
        setUsagePurposes(purposesRes.data || []);
        setScreenSizes(screenSizesRes.data || []);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu filter:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterData();
  }, []);

  // Toggle section mở/đóng
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Xử lý chọn/bỏ chọn Brand (có thể chọn nhiều)
  const handleBrandToggle = (brandId) => {
    const newBrands = filters.brandIds.includes(brandId)
      ? filters.brandIds.filter(id => id !== brandId)
      : [...filters.brandIds, brandId];
    onFilterChange('brandIds', newBrands);
  };

  // Xử lý chọn Purpose (chỉ chọn 1)
  const handlePurposeChange = (purposeId) => {
    onFilterChange('purposeId', filters.purposeId === purposeId ? null : purposeId);
  };

  // Xử lý chọn Screen Size (chỉ chọn 1)
  const handleScreenSizeChange = (screenSizeId) => {
    onFilterChange('screenSizeId', filters.screenSizeId === screenSizeId ? null : screenSizeId);
  };

  // Xử lý chọn khoảng giá
  const handlePriceChange = (range) => {
    const isSameRange = filters.minPrice === range.min && filters.maxPrice === range.max;
    if (isSameRange) {
      onFilterChange('minPrice', null);
      onFilterChange('maxPrice', null);
    } else {
      onFilterChange('minPrice', range.min);
      onFilterChange('maxPrice', range.max);
    }
  };

  // Xử lý thay đổi sort
  const handleSortChange = (sortValue) => {
    onFilterChange('sortBy', sortValue);
  };

  // Kiểm tra có filter nào đang active không
  const hasActiveFilters = 
    filters.brandIds.length > 0 || 
    filters.purposeId || 
    filters.screenSizeId || 
    filters.minPrice !== null ||
    filters.sortBy !== 'default';

  if (loading) {
    return (
      <div className="filter-sidebar">
        <div className="filter-loading">Đang tải bộ lọc...</div>
      </div>
    );
  }

  return (
    <div className="filter-sidebar">
      {/* Header */}
      <div className="filter-header">
        <div className="filter-title">
          <AiOutlineFilter size={20} />
          <h3>Bộ lọc</h3>
        </div>
        {hasActiveFilters && (
          <button className="btn-clear-all" onClick={onClearFilters}>
            <AiOutlineClose size={16} />
            Xóa tất cả
          </button>
        )}
      </div>

      {/* Sắp xếp */}
      <div className="filter-section">
        <div 
          className="filter-section-header"
          onClick={() => toggleSection('sort')}
        >
          <h4>Sắp xếp theo</h4>
          {expandedSections.sort ? <AiOutlineUp /> : <AiOutlineDown />}
        </div>
        {expandedSections.sort && (
          <div className="filter-section-content">
            {sortOptions.map(option => (
              <label key={option.value} className="filter-radio">
                <input
                  type="radio"
                  name="sort"
                  checked={filters.sortBy === option.value}
                  onChange={() => handleSortChange(option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Thương hiệu */}
      <div className="filter-section">
        <div 
          className="filter-section-header"
          onClick={() => toggleSection('brand')}
        >
          <h4>Thương hiệu</h4>
          {expandedSections.brand ? <AiOutlineUp /> : <AiOutlineDown />}
        </div>
        {expandedSections.brand && (
          <div className="filter-section-content">
            {brands.map(brand => (
              <label key={brand.id} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.brandIds.includes(brand.id)}
                  onChange={() => handleBrandToggle(brand.id)}
                />
                <span>{brand.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Nhu cầu sử dụng */}
      <div className="filter-section">
        <div 
          className="filter-section-header"
          onClick={() => toggleSection('purpose')}
        >
          <h4>Nhu cầu sử dụng</h4>
          {expandedSections.purpose ? <AiOutlineUp /> : <AiOutlineDown />}
        </div>
        {expandedSections.purpose && (
          <div className="filter-section-content">
            {usagePurposes.map(purpose => (
              <label key={purpose.id} className="filter-radio">
                <input
                  type="radio"
                  name="purpose"
                  checked={filters.purposeId === purpose.id}
                  onChange={() => handlePurposeChange(purpose.id)}
                />
                <span>{purpose.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Kích thước màn hình */}
      <div className="filter-section">
        <div 
          className="filter-section-header"
          onClick={() => toggleSection('screen')}
        >
          <h4>Kích thước màn hình</h4>
          {expandedSections.screen ? <AiOutlineUp /> : <AiOutlineDown />}
        </div>
        {expandedSections.screen && (
          <div className="filter-section-content">
            {screenSizes.map(size => (
              <label key={size.id} className="filter-radio">
                <input
                  type="radio"
                  name="screenSize"
                  checked={filters.screenSizeId === size.id}
                  onChange={() => handleScreenSizeChange(size.id)}
                />
                <span>{size.value} inch</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Khoảng giá */}
      <div className="filter-section">
        <div 
          className="filter-section-header"
          onClick={() => toggleSection('price')}
        >
          <h4>Khoảng giá</h4>
          {expandedSections.price ? <AiOutlineUp /> : <AiOutlineDown />}
        </div>
        {expandedSections.price && (
          <div className="filter-section-content">
            {priceRanges.map(range => {
              const isActive = filters.minPrice === range.min && filters.maxPrice === range.max;
              return (
                <label key={range.id} className="filter-radio">
                  <input
                    type="radio"
                    name="price"
                    checked={isActive}
                    onChange={() => handlePriceChange(range)}
                  />
                  <span>{range.label}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSidebar;