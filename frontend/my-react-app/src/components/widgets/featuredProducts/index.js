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

const FeaturedProducts = ({ filterBrandId, filterUsageId, filterScreenSizeId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("Có Thể Bạn Sẽ Thích");
  
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchCartCount } = useCart(); 

  const ITEMS_PER_BATCH = 8; 
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);

  // 👇 1. LOGIC TÍNH GIÁ KHUYẾN MÃI
  const getDiscountedPrice = (product) => {
    const promo = product.promotion;
    if (!promo || promo.status !== "ACTIVE") return null;

    if (promo.discountType === "PERCENTAGE") {
      return product.price - (product.price * promo.discountValue) / 100;
    } else if (promo.discountType === "FIXED_AMOUNT") {
      return Math.max(0, product.price - promo.discountValue);
    }
    return null;
  };

  const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
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

        if (filterScreenSizeId) {
            const params = { screenSizeId: filterScreenSizeId };
            if (filterBrandId) params.brandIds = [filterBrandId]; 
            if (filterUsageId) params.purposeId = filterUsageId;
            res = await apiClient.get("/products/advanced-filter", { params });
            setTitle("Sản phẩm theo kích thước màn hình");
            isFiltering = true;
        }
        else if (filterBrandId && filterUsageId) {
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
  }, [filterBrandId, filterUsageId, filterScreenSizeId]);

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("token"); 
    if (!token) { 
        const confirmLogin = window.confirm("Vui lòng đăng nhập để mua hàng.");
        if (confirmLogin) navigate(ROUTERS.USER.LOGIN);
        return; 
    }
    try { 
        await addToCart(productId, 1); 
        fetchCartCount(); 
        toast.success("Đã thêm vào giỏ hàng thành công!"); 
    } catch (err) { 
        console.error(err);
        toast.error("Thêm vào giỏ hàng thất bại!");
    }
  };

  const handleLoadMore = () => setVisibleCount(prev => prev + ITEMS_PER_BATCH);
  
  const handleCollapse = () => {
    setVisibleCount(ITEMS_PER_BATCH);
    const section = document.querySelector('.featured-products');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  const getProductLink = (id) => {
    const isCustomerPage = location.pathname.includes("/customer");
    return isCustomerPage 
        ? ROUTERS.CUSTOMER.PRODUCTDETAIL.replace(":id", id) 
        : ROUTERS.USER.PRODUCTDETAIL.replace(":id", id);
  };

  const getProductImage = (item) => {
    if (item.images && item.images.length > 0) {
        const firstImg = item.images[0];
        const url = firstImg.urlImage || firstImg;
        return url.startsWith("http") ? url : `http://localhost:8080${url}`;
    }
    if (item.imageUrl) {
        return item.imageUrl.startsWith("http") ? item.imageUrl : `http://localhost:8080${item.imageUrl}`;
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
          {products.slice(0, visibleCount).map((item) => {
            // 👇 2. TÍNH TOÁN GIÁ GIẢM CHO TỪNG ITEM
            const discountedPrice = getDiscountedPrice(item);
            const hasPromo = discountedPrice !== null;

            return (
              <div key={item.id} className="product-card">
                <div className="product-card__image">
                   {/* 👇 3. HIỂN THỊ BADGE GIẢM GIÁ */}
                   {hasPromo && (
                     <div className="promo-badge">
                       {item.promotion.discountType === "PERCENTAGE" 
                        ? `-${item.promotion.discountValue}%` 
                        : `GIẢM ${(item.promotion.discountValue / 1000).toLocaleString()}K`}
                     </div>
                   )}
                   <Link to={getProductLink(item.id)}>
                      <img src={getProductImage(item)} alt={item.name} loading="lazy" />
                   </Link>
                </div>

                <div className="product-card__content">
                  <div className="product-brand" style={{fontSize: '12px', color: '#999', textTransform: 'uppercase', marginBottom: '5px', fontWeight: 'bold'}}>
                      {item.brand?.name}
                  </div>
                  <h3 className="product-name">
                    <Link to={getProductLink(item.id)}>{item.name}</Link>
                  </h3>
                  
                  {filterScreenSizeId && item.screenSize && (
                      <div style={{fontSize: '13px', color: '#555', marginBottom: '5px'}}>
                          Màn hình: {item.screenSize.value} inch
                      </div>
                  )}

                  {/* 👇 4. HIỂN THỊ GIÁ (CŨ & MỚI) */}
                  <div className="product-price-container">
                    {hasPromo ? (
                      <>
                        <span className="product-price discounted">{formatter(discountedPrice)}</span>
                        <span className="product-price original">{formatter(item.price)}</span>
                      </>
                    ) : (
                      <span className="product-price">{formatter(item.price)}</span>
                    )}
                  </div>

                  <button className="btn-add-cart" onClick={() => handleAddToCart(item.id)}>
                      <AiOutlineShoppingCart style={{marginRight: '5px'}}/> Thêm vào giỏ hàng
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

export default memo(FeaturedProducts);