import { toast } from 'react-toastify';
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
  
  const location = useLocation(); 
  const navigate = useNavigate(); 
  const { fetchCartCount } = useCart(); 

  const ITEMS_PER_BATCH = 8; 
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);

  // 👇 1. LOGIC TÍNH GIÁ KHUYẾN MÃI (ĐÃ CẬP NHẬT LẤY GIÁ TỪ BIẾN THỂ)
  const getProductDisplayData = (product) => {
    // Ưu tiên lấy biến thể đầu tiên
    const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
    
    // Lấy giá gốc: Ưu tiên giá biến thể, nếu không có mới dùng product.price
    const basePrice = firstVariant ? firstVariant.price : (product.price || 0);
    const promo = product.promotion;

    let discountedPrice = null;
    let hasPromo = false;

    if (promo && promo.status === "ACTIVE") {
      hasPromo = true;
      if (promo.discountType === "PERCENTAGE") {
        discountedPrice = basePrice - (basePrice * promo.discountValue) / 100;
      } else if (promo.discountType === "FIXED_AMOUNT") {
        discountedPrice = Math.max(0, basePrice - promo.discountValue);
      }
    }

    return {
      basePrice,
      discountedPrice,
      hasPromo,
      variantId: firstVariant ? firstVariant.id : null // Để dùng khi thêm vào giỏ
    };
  };

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

  // 👇 CẬP NHẬT: Truyền thêm variantId để Backend không lỗi 400
  const handleAddToCart = async (productId, variantId) => {
    const token = localStorage.getItem("token"); 
    if (!token) { 
      const confirmLogin = window.confirm("Vui lòng đăng nhập để thêm vào giỏ hàng. Bạn có muốn đăng nhập ngay không?");
      if (confirmLogin) {
          navigate(ROUTERS.USER.LOGIN);
      }
      return; 
    }

    if (!variantId) {
      toast.warning("Sản phẩm chưa có cấu hình biến thể!");
      return;
    }

    try {
      // Gửi variantId của biến thể đầu tiên ra ngoài
      await addToCart(productId, variantId, 1); 
      fetchCartCount(); 
      toast.success("Đã thêm vào giỏ hàng thành công!");
    } catch (err) {
      console.error(err);
      toast.error("Thêm vào giỏ hàng thất bại!");
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

  const getProductLink = (id) => {
    const isCustomerPage = location.pathname.includes("/customer");
    if (isCustomerPage) {
        return ROUTERS.CUSTOMER.PRODUCTDETAIL.replace(":id", id);
    }
    return ROUTERS.USER.PRODUCTDETAIL.replace(":id", id);
  };

  // 👇 CẬP NHẬT: ƯU TIÊN LẤY ẢNH TỪ BIẾN THỂ ĐẦU TIÊN
 const getProductImage = (item) => {
  // 1. Lấy biến thể đầu tiên của sản phẩm
  const firstVariant = item.variants && item.variants.length > 0 ? item.variants[0] : null;

  // 2. Logic lấy ảnh từ bảng variant_images (Trong Entity ProductVariant là List<VariantImage> images)
  if (firstVariant && firstVariant.images && firstVariant.images.length > 0) {
    // Lấy đối tượng ảnh đầu tiên
    const firstImgObj = firstVariant.images[0];
    
    // Khớp đúng với trường 'imageUrl' trong Entity VariantImage của Hiển
    const path = firstImgObj.imageUrl; 
    
    return path ? `http://localhost:8080${path}` : "https://via.placeholder.com/300x300?text=No+Image";
  }

  // 3. Dự phòng: Nếu bảng variant_images trống nhưng cột image trong product_variants có dữ liệu
  if (firstVariant && firstVariant.image) {
    return `http://localhost:8080${firstVariant.image}`;
  }

  // 4. Dự phòng cuối: Ảnh mặc định
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
          {products.slice(0, visibleCount).map((item) => {
            // 👇 SỬ DỤNG LOGIC TÍNH TOÁN MỚI
            const { basePrice, discountedPrice, hasPromo, variantId } = getProductDisplayData(item);

            return (
              <div key={item.id} className="product-card">
                <div className="product-card__image">
                   {hasPromo && (
                     <div className="promo-badge">
                        {item.promotion.discountType === "PERCENTAGE" 
                          ? `-${item.promotion.discountValue}%` 
                          : `-${(item.promotion.discountValue / 1000).toLocaleString()}K`}
                     </div>
                   )}
                   <Link to={getProductLink(item.id)}>
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
                  
                  <div className="product-price-container" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      {hasPromo ? (
                        <>
                          <span className="product-price discounted" style={{ color: '#d70018', fontWeight: 'bold', fontSize: '18px' }}>
                            {formatter(discountedPrice)}
                          </span>
                          <span className="product-price original" style={{ textDecoration: 'line-through', color: '#999', fontSize: '14px' }}>
                            {formatter(basePrice)}
                          </span>
                        </>
                      ) : (
                        <div className="product-price" style={{ fontWeight: 'bold', color: '#333' }}>
                          {formatter(basePrice)}
                        </div>
                      )}
                  </div>
                  
                  <button 
                      className="btn-add-cart"
                      onClick={() => handleAddToCart(item.id, variantId)}
                  >
                      <AiOutlineShoppingCart style={{marginRight: '5px'}}/>
                      Thêm vào giỏ
                  </button>
                </div>
              </div>
            );
          })}
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

export default memo(HotProduct);