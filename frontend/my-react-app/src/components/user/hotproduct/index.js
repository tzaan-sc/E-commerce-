import { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart, AiOutlineHeart, AiOutlineEye } from "react-icons/ai";
import { BsStarFill } from "react-icons/bs";
import { formatter } from "utils/formatter";
import { ROUTERS } from "utils/router";
// Đảm bảo file api/cart này đã được sửa để dùng axiosConfig
import { addToCart } from "api/cart"; 
import apiClient from "api/axiosConfig"; // <-- Dùng apiClient cho fetchProducts
import { useCart } from "context/index"; // <-- 1. IMPORT HOOK CART MỚI THÊM
import "./style.scss";

const HotProduct = ({ onCartUpdated }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 2. LẤY HÀM CẬP NHẬT TỪ CONTEXT
  const { fetchCartCount } = useCart(); 

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // ✅ Sửa: Dùng apiClient.get thay vì fetch để tận dụng cấu hình baseURL
      const res = await apiClient.get("/products");
      
      const data = res.data; 
      const productList = Array.isArray(data) ? data : data.data || [];
      setProducts(productList);
    } catch (err) {
      console.error("Lấy sản phẩm thất bại:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // --- HÀM SỬ LÝ THÊM VÀO GIỎ HÀNG (ĐÃ CẬP NHẬT) ---
  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("token"); 
    
    if (!token) { 
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng");
      return;
    }

    try {
      // Gọi hàm addToCart bạn đã định nghĩa (sử dụng apiClient)
      await addToCart(productId, 1); 
      
      // 3. KÍCH HOẠT CẬP NHẬT SỐ LƯỢNG GIỎ HÀNG TRÊN HEADER
      fetchCartCount(); 
      
      if (onCartUpdated) onCartUpdated();
      alert("Đã thêm vào giỏ hàng!");
      
    } catch (err) {
      console.error(err);
      // Sửa: Thông báo lỗi chung chung hơn
      alert("Thêm giỏ hàng thất bại! (Token có thể hết hạn)");
    }
  };
  // --- KẾT THÚC PHẦN SỬA ---

  if (loading) return <div>Đang tải sản phẩm...</div>;
  if (!products.length) return <div>Chưa có sản phẩm nào</div>;

  return (
    <section className="hot-product">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <Link to={ROUTERS.USER.PRODUCTDETAIL.replace(":id", product.id)}>
                  <img src={`http://localhost:8080${product.imageUrl}`} alt={product.name} />
                </Link>
              </div>

              <div className="product-info">
                <h3 className="product-name">
                  <Link to={ROUTERS.USER.PRODUCTDETAIL.replace(":id", product.id)}>
                    {product.name}
                  </Link>
                </h3>

                <div className="product-price">
                  <span className="current-price">{formatter(product.price)}</span>
                  {product.oldPrice && (
                    <span className="old-price">{formatter(product.oldPrice)}</span>
                  )}
                </div>

                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product.id)} // Hàm này đã được sửa
                >
                  <AiOutlineShoppingCart />
                  <span>Thêm vào giỏ</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(HotProduct);