import { memo, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
// 1. IMPORT THÊM ICON MŨI TÊN
import { AiOutlineShoppingCart, AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import apiClient from "api/axiosConfig"; 
import { addToCart } from "api/cart";    
import { useCart } from "context/index"; 
import { formatter } from "utils/formatter"; 
import { ROUTERS } from "utils/router";
import "./style.scss"; 

const BrandProductsPage = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchCartCount } = useCart(); 

  // --- 2. CẤU HÌNH SỐ LƯỢNG HIỂN THỊ ---
  const ITEMS_PER_BATCH = 8; // Mặc định hiện 8 sản phẩm (2 hàng)
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);

  useEffect(() => {
    const fetchProductsByBrand = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/products/brand/${id}`);
        setProducts(response.data);
        
        // Reset lại số lượng hiển thị về mặc định khi chuyển sang brand khác
        setVisibleCount(ITEMS_PER_BATCH);
      } catch (err) {
        console.error("Lỗi tải sản phẩm:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByBrand();
  }, [id]);

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("token"); 
    if (!token) { 
      alert("Vui lòng đăng nhập!");
      return;
    }
    try {
      await addToCart(productId, 1); 
      fetchCartCount(); 
      alert("Đã thêm vào giỏ hàng!");
    } catch (err) {
      console.error(err);
    }
  };

  // --- 3. CÁC HÀM XỬ LÝ NÚT BẤM ---
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_BATCH);
  };

  const handleCollapse = () => {
    setVisibleCount(ITEMS_PER_BATCH);
    // Cuộn lên đầu danh sách
    const section = document.querySelector('.brand-products-page');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="container brand-products-page">
      
      <div className="section-header">
        <h2 className="section-title">Sản Phẩm Thuộc Thương Hiệu</h2>
      </div>

      {loading ? (
        <div className="loading">Đang tải dữ liệu...</div>
      ) : products.length === 0 ? (
        <div className="no-products">Chưa có sản phẩm nào.</div>
      ) : (
        <>
          <div className="product-grid">
            {/* 4. CẮT MẢNG HIỂN THỊ THEO visibleCount */}
            {products.slice(0, visibleCount).map((item) => (
              <div key={item.id} className="product-card">
                <div className="product-card__image">
                   <Link to={ROUTERS.USER.PRODUCTDETAIL.replace(":id", item.id)}>
                      <img 
                        src={`http://localhost:8080${item.imageUrl || item.image}`} 
                        alt={item.name} 
                      />
                   </Link>
                </div>

                <div className="product-card__content">
                  <h3 className="product-name">
                    <Link to={ROUTERS.USER.PRODUCTDETAIL.replace(":id", item.id)}>
                      {item.name}
                    </Link>
                  </h3>
                  
                  <div className="product-price">
                      {formatter(item.price)}
                  </div>
                  
                  <button 
                      className="btn-add-cart"
                      onClick={() => handleAddToCart(item.id)}
                  >
                      <AiOutlineShoppingCart style={{marginRight: '5px'}}/>
                      Thêm
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 5. KHU VỰC NÚT BẤM (Copy từ FeaturedProducts) */}
          <div className="view-more-container">
            {visibleCount < products.length ? (
                // Trường hợp 1: Vẫn còn sản phẩm chưa hiện hết -> Nút Xem Thêm
                <button className="btn-view-more" onClick={handleLoadMore}>
                    Xem thêm sản phẩm <AiOutlineDown />
                </button>
            ) : (
                // Trường hợp 2: Đã hiện hết VÀ tổng sản phẩm nhiều hơn 1 trang -> Nút Thu Gọn
                products.length > ITEMS_PER_BATCH && (
                    <button className="btn-view-more collapse-mode" onClick={handleCollapse}>
                        Thu gọn danh sách <AiOutlineUp />
                    </button>
                )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default memo(BrandProductsPage);