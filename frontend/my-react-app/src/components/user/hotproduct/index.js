import { memo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
// Import thêm icon mũi tên
import { AiOutlineShoppingCart, AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import apiClient from "api/axiosConfig"; 
import { addToCart } from "api/cart";    
import { useCart } from "context/index"; 
import { formatter } from "utils/formatter"; 
import { ROUTERS } from "utils/router"; // Import router để link đúng
import "./style.scss";

const HotProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- CẤU HÌNH SỐ LƯỢNG ---
  // 4 cột x 4 hàng = 16 sản phẩm mỗi lần tải
  const ITEMS_PER_BATCH = 8; 
  
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);
  const { fetchCartCount } = useCart(); 

  // Hàm trộn mảng (Shuffle)
  const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get("/products");
        const data = res.data; 
        const allProducts = Array.isArray(data) ? data : data.data || [];
        
        // --- LOGIC TRỘN TẤT CẢ ---
        // Không bỏ qua sản phẩm nào cả, trộn hết toàn bộ danh sách
        const shuffledList = shuffleArray([...allProducts]);

        setProducts(shuffledList);

      } catch (err) {
        console.error("Lỗi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  // Xử lý Xem thêm
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_BATCH);
  };

  // Xử lý Thu gọn
  const handleCollapse = () => {
    setVisibleCount(ITEMS_PER_BATCH);
    // Cuộn lên đầu section HotProduct
    const section = document.querySelector('.hot-product');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) return null;
  if (products.length === 0) return null; 

  return (
    <section className="hot-product">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
        </div>
        
        <div className="product-grid">
          {/* Cắt mảng hiển thị theo visibleCount */}
          {products.slice(0, visibleCount).map((item) => (
            <div key={item.id} className="product-card">
              <div className="product-card__image">
                 <Link to={ROUTERS.USER.PRODUCTDETAIL.replace(":id", item.id)}>
                    {/* Tự động nhận diện imageUrl hoặc image */}
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
                    Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- NÚT ĐIỀU HƯỚNG (Xem thêm / Thu gọn) --- */}
        <div className="view-more-container">
            {visibleCount < products.length ? (
                <button className="btn-view-more" onClick={handleLoadMore}>
                    Xem thêm sản phẩm <AiOutlineDown />
                </button>
            ) : (
                // Chỉ hiện nút thu gọn nếu tổng sản phẩm > số lượng mặc định
                products.length > ITEMS_PER_BATCH && (
                    <button className="btn-view-more collapse-mode" onClick={handleCollapse}>
                        Thu gọn danh sách <AiOutlineUp />
                    </button>
                )
            )}
        </div>
        
      </div>
    </section>
  );
};

export default memo(HotProduct);