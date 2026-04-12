import { memo, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; 
import { AiOutlineShoppingCart, AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import apiClient from "api/axiosConfig"; 
import { addToCart } from "api/cart";    
import { useCart } from "context/index"; 
import { formatter } from "utils/formatter"; 
import { ROUTERS } from "utils/router"; 
import "./style.scss";

const HotProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Hook điều hướng
  const location = useLocation(); 
  const navigate = useNavigate(); 
  
  // Hook giỏ hàng
  const { fetchCartCount } = useCart(); 

  // --- CẤU HÌNH SỐ LƯỢNG ---
  const ITEMS_PER_BATCH = 8; 
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);

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
        
        // Trộn sản phẩm
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

  // --- XỬ LÝ THÊM VÀO GIỎ ---
  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("token"); 
    
    // 1. Kiểm tra đăng nhập
    if (!token) { 
      const confirmLogin = window.confirm("Vui lòng đăng nhập để thêm vào giỏ hàng. Bạn có muốn đăng nhập ngay không?");
      if (confirmLogin) {
          navigate(ROUTERS.USER.LOGIN);
      }
      return; 
    }

    // 2. Logic thêm vào giỏ
    try {
      await addToCart(productId, 1); 
      fetchCartCount(); 
      alert("Đã thêm vào giỏ hàng thành công!");
    } catch (err) {
      console.error(err);
      alert("Thêm vào giỏ hàng thất bại!");
    }
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_BATCH);
  };

  const handleCollapse = () => {
    setVisibleCount(ITEMS_PER_BATCH);
    const section = document.querySelector('.hot-product');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  // --- LOGIC LINK SẢN PHẨM ---
  const getProductLink = (id) => {
    const isCustomerPage = location.pathname.includes("/customer");
    if (isCustomerPage) {
        return ROUTERS.CUSTOMER.PRODUCTDETAIL.replace(":id", id);
    }
    return ROUTERS.USER.PRODUCTDETAIL.replace(":id", id);
  };

  // --- 👇 HÀM MỚI: LẤY ẢNH ĐẠI DIỆN TỪ DANH SÁCH ẢNH ---
  const getProductImage = (item) => {
    // 1. Nếu có danh sách ảnh và có ít nhất 1 ảnh -> Lấy ảnh đầu tiên
    if (item.images && item.images.length > 0) {
        const firstImg = item.images[0];
        // firstImg có thể là object { urlImage: "..." } 
        const url = firstImg.urlImage || firstImg; 
        return `http://localhost:8080${url}`;
    }
    
    // 2. Fallback về trường cũ (nếu backend vẫn trả về)
    if (item.imageUrl) {
        return `http://localhost:8080${item.imageUrl}`;
    }

    // 3. Ảnh mặc định nếu không có gì
    return "https://via.placeholder.com/300x300?text=No+Image";
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
          {products.slice(0, visibleCount).map((item) => (
            <div key={item.id} className="product-card">
              <div className="product-card__image">
                 {/* Link ảnh */}
                 <Link to={getProductLink(item.id)}>
                    {/* 👇 SỬA Ở ĐÂY: Dùng hàm getProductImage */}
                    <img 
                      src={getProductImage(item)} 
                      alt={item.name} 
                    />
                 </Link>
              </div>

              <div className="product-card__content">
                <h3 className="product-name">
                  <Link to={getProductLink(item.id)}>
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
                    Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- NÚT ĐIỀU HƯỚNG --- */}
        <div className="view-more-container">
            {visibleCount < products.length ? (
                <button className="btn-view-more" onClick={handleLoadMore}>
                    Xem thêm <AiOutlineDown />
                </button>
            ) : (
                products.length > ITEMS_PER_BATCH && (
                    <button className="btn-view-more collapse-mode" onClick={handleCollapse}>
                        Thu gọn <AiOutlineUp />
                    </button>
                )
            )}
        </div>
        
      </div>
    </section>
  );
};

export default memo(HotProduct);
