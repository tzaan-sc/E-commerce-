// components/page/searchPage/index.jsx
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCard from "components/user/productCard";
import FilterSidebar from "components/user/filterSidebar";
import apiClient from "api/axiosConfig";
import { addToCart } from "api/cart";
import { useCart } from "context/index";
import "./style.scss";

const SearchPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";
  const { fetchCartCount } = useCart();
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State quản lý filters
  const [filters, setFilters] = useState({
    keyword: query,
    brandIds: [],
    purposeId: null,
    screenSizeId: null,
    minPrice: null,
    maxPrice: null,
    sortBy: 'default'
  });

  // Cập nhật keyword khi query thay đổi
  useEffect(() => {
    setFilters(prev => ({ ...prev, keyword: query }));
  }, [query]);

  // Fetch products khi filters thay đổi
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Chuẩn bị params cho API
      const params = {};
      
      if (filters.keyword) params.keyword = filters.keyword;
      if (filters.brandIds.length > 0) params.brandIds = filters.brandIds;
      if (filters.purposeId) params.purposeId = filters.purposeId;
      if (filters.screenSizeId) params.screenSizeId = filters.screenSizeId;
      if (filters.minPrice !== null) params.minPrice = filters.minPrice;
      if (filters.maxPrice !== null) params.maxPrice = filters.maxPrice;
      if (filters.sortBy !== 'default') params.sortBy = filters.sortBy;

      // Gọi API advanced-filter
      const response = await apiClient.get("/products/advanced-filter", { params });
      
      const data = response.data;
      setResults(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", err);
      setError("Có lỗi xảy ra khi tải sản phẩm. Vui lòng thử lại!");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Hàm thay đổi filter
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Hàm xóa tất cả filters
  const handleClearFilters = () => {
    setFilters({
      keyword: query,
      brandIds: [],
      purposeId: null,
      screenSizeId: null,
      minPrice: null,
      maxPrice: null,
      sortBy: 'default'
    });
  };

  // Hàm thêm vào giỏ hàng
  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng");
      return;
    }

    try {
      await addToCart(productId, 1);
      fetchCartCount();
      alert("Đã thêm vào giỏ hàng!");
    } catch (err) {
      console.error(err);
      alert("Thêm giỏ hàng thất bại!");
    }
  };

  return (
    <div className="search-page">
      <div className="container">
        <div className="search-page-header">
          <h2 className="search-title">
            {query ? `Kết quả tìm kiếm cho: "${query}"` : 'Tất cả sản phẩm'}
          </h2>
          {!loading && (
            <p className="search-result-count">
              Tìm thấy <strong>{results.length}</strong> sản phẩm
            </p>
          )}
        </div>

        <div className="search-page-content">
          {/* Sidebar Filter */}
          <aside className="search-sidebar">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </aside>

          {/* Main Content */}
          <main className="search-main">
            {loading ? (
              <div className="search-loading">
                <div className="spinner"></div>
                <p>Đang tìm kiếm sản phẩm...</p>
              </div>
            ) : error ? (
              <div className="search-error">
                <p>{error}</p>
                <button onClick={fetchProducts} className="btn-retry">
                  Thử lại
                </button>
              </div>
            ) : results.length > 0 ? (
              <div className="product-grid">
                {results.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <div className="no-results-icon">😢</div>
                <h3>Không tìm thấy sản phẩm phù hợp</h3>
                <p>Hãy thử thay đổi từ khóa hoặc bộ lọc khác</p>
                <button onClick={handleClearFilters} className="btn-clear-filters">
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;