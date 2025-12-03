import { memo, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Import thêm hook điều hướng
import { AiOutlineShoppingCart, AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import apiClient from "api/axiosConfig"; 
import { addToCart } from "api/cart";    
import { useCart } from "context/index"; 
import { formatter } from "utils/formatter"; 
import { ROUTERS } from "utils/router";
import "./style.scss"; 

const FeaturedProducts = ({ filterBrandId, filterUsageId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("Có Thể Bạn Sẽ Thích");
  
  // Hook
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchCartCount } = useCart(); 

  const ITEMS_PER_BATCH = 8; 
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);

  // Hàm trộn mảng
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
        setVisibleCount(ITEMS_PER_BATCH);
        let res;
        let isFiltering = false;

        if (filterBrandId && filterUsageId) {
             res = await apiClient.get(`/products/filter?purpose=${filterUsageId}&brand=${filterBrandId}`);
             setTitle("Sản phẩm theo Thương hiệu & Nhu cầu");
             isFiltering = true;
        } 
        else if (filterBrandId) {
             res = await apiClient.get(`/products/brand/${filterBrandId}`);
             setTitle("Sản phẩm theo Thương hiệu");
             isFiltering = true;
        }
        else if (filterUsageId) {
             res = await apiClient.get(`/products/usage-purpose/${filterUsageId}`);
             setTitle("Sản phẩm theo Nhu cầu");
             isFiltering = true;
        }
        else {
             res = await apiClient.get("/products");
             setTitle("Có Thể Bạn Sẽ Thích");
             isFiltering = false;
        }

        const data = res.data; 
        const allProducts = Array.isArray(data) ? data : data.data || [];
        
        if (isFiltering) {
            setProducts(allProducts);
        } else {
            const shuffledList = shuffleArray([...allProducts]); 
            setProducts(shuffledList);
        }

      } catch (err) {
        console.error("Lỗi tải sản phẩm:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filterBrandId, filterUsageId]); 

  // --- 1. XỬ LÝ THÊM VÀO GIỎ (ĐÃ UPDATE) ---
  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("token"); 
    
    if (!token) { 
        const confirmLogin = window.confirm("Vui lòng đăng nhập để thêm vào giỏ hàng. Bạn có muốn đăng nhập ngay không?");
        if (confirmLogin) {
            navigate(ROUTERS.USER.LOGIN);
        }
        return; 
    }

    try { 
        await addToCart(productId, 1); 
        fetchCartCount(); 
        alert("Đã thêm vào giỏ hàng thành công!"); 
    } catch (err) { 
        console.error(err);
        alert("Thêm vào giỏ hàng thất bại!");
    }
  };

  const handleLoadMore = () => setVisibleCount(prev => prev + ITEMS_PER_BATCH);
  
  const handleCollapse = () => {
    setVisibleCount(ITEMS_PER_BATCH);
    const section = document.querySelector('.featured-products');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  // --- 2. LOGIC LINK ĐỘNG (ĐÃ UPDATE) ---
  const getProductLink = (id) => {
    const isCustomerPage = location.pathname.includes("/customer");
    if (isCustomerPage) {
        return ROUTERS.CUSTOMER.PRODUCTDETAIL.replace(":id", id);
    }
    return ROUTERS.USER.PRODUCTDETAIL.replace(":id", id);
  };

  // --- 3. LOGIC LẤY ẢNH (ĐÃ UPDATE) ---
  const getProductImage = (item) => {
    if (item.images && item.images.length > 0) {
        const firstImg = item.images[0];
        const url = firstImg.urlImage || firstImg;
        return `http://localhost:8080${url}`;
    }
    if (item.imageUrl) {
        return `http://localhost:8080${item.imageUrl}`;
    }
    return "https://via.placeholder.com/300x300?text=No+Image";
  };

  if (loading) return <div style={{textAlign: 'center', padding: '20px'}}>Đang tải...</div>;
  
  if (products.length === 0) {
      return (
        <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
            <h3>Không tìm thấy sản phẩm phù hợp.</h3>
        </div>
      );
  }

  return (
    <section className="featured-products">
      <div className="container">
        
        {title && <h2 className="section-title">{title}</h2>}
        
        <div className="product-grid">
          {products.slice(0, visibleCount).map((item) => (
            <div key={item.id} className="product-card">
              <div className="product-card__image">
                 {/* Link và Ảnh đã dùng hàm dynamic */}
                 <Link to={getProductLink(item.id)}>
                    <img 
                        src={getProductImage(item)} 
                        alt={item.name} 
                    />
                 </Link>
              </div>
              <div className="product-card__content">
                <div className="product-brand" style={{fontSize: '12px', color: '#999', textTransform: 'uppercase', marginBottom: '5px', fontWeight: 'bold'}}>
                    {item.brand?.name}
                </div>
                <h3 className="product-name">
                  <Link to={getProductLink(item.id)}>{item.name}</Link>
                </h3>
                <div className="product-price">{formatter(item.price)}</div>
                <button className="btn-add-cart" onClick={() => handleAddToCart(item.id)}>
                    <AiOutlineShoppingCart style={{marginRight: '5px'}}/> Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          ))}
        </div>

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

export default memo(FeaturedProducts);