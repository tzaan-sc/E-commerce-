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

  // ✅ 1. LOGIC TÍNH GIÁ: Ưu tiên lấy giá của biến thể đầu tiên
  const getProductDisplayInfo = (product) => {
    // Tìm biến thể đầu tiên
    const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
    
    // Lấy giá gốc: Ưu tiên giá biến thể, nếu không có lấy giá sản phẩm
    const basePrice = firstVariant ? firstVariant.price : (product.price || 0);

    // Tính khuyến mãi
    const promo = product.promotion;
    let finalPrice = basePrice;
    let discountDisplay = null;
    let hasPromo = false;

    if (promo && promo.status === "ACTIVE") {
      hasPromo = true;
      if (promo.discountType === "PERCENTAGE") {
        finalPrice = basePrice * (1 - promo.discountValue / 100);
        discountDisplay = `-${promo.discountValue}%`;
      } else if (promo.discountType === "FIXED_AMOUNT") {
        finalPrice = Math.max(0, basePrice - promo.discountValue);
        discountDisplay = `-${(promo.discountValue / 1000).toLocaleString()}K`;
      }
    }

    return { basePrice, finalPrice, discountDisplay, hasPromo, firstVariant };
  };

  // ✅ 2. LOGIC LẤY ẢNH: Ưu tiên ảnh biến thể đầu tiên
  const getProductImage = (item) => {
    const BASE_URL = "http://localhost:8080";
    const firstVariant = item.variants && item.variants.length > 0 ? item.variants[0] : null;

    // 1. Ưu tiên ảnh trong mảng imageUrls của biến thể đầu (như Hiển đã làm ở Carousel)
    if (firstVariant?.imageUrls && firstVariant.imageUrls.length > 0) {
        const path = firstVariant.imageUrls[0];
        return path.startsWith("http") ? path : `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    }

    // 2. Dự phòng: Ảnh đơn trong cột image của biến thể
    if (firstVariant?.image) {
        return firstVariant.image.startsWith("http") ? firstVariant.image : `${BASE_URL}${firstVariant.image}`;
    }

    // 3. Dự phòng: Ảnh của sản phẩm gốc
    if (item.images && item.images.length > 0) {
        const url = item.images[0].urlImage || item.images[0];
        return url.startsWith("http") ? url : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    }

    return "https://via.placeholder.com/300x300?text=No+Image";
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

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("token"); 
    if (!token) { 
        if (window.confirm("Vui lòng đăng nhập để mua hàng.")) navigate(ROUTERS.USER.LOGIN);
        return; 
    }
    try { 
        // Lấy ID biến thể đầu tiên để thêm vào giỏ hàng (tránh lỗi 400 null variant)
        const variantId = product.variants && product.variants.length > 0 ? product.variants[0].id : null;
        await addToCart(product.id, 1, variantId); 
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

  if (loading) return <div style={{textAlign: 'center', padding: '20px'}}>Đang tải...</div>;
  if (products.length === 0) return <div style={{textAlign: 'center', padding: '40px', color: '#666'}}><h3>Không tìm thấy sản phẩm.</h3></div>;

  return (
    <section className="featured-products">
      <div className="container">
        {title && <h2 className="section-title">{title}</h2>}
        
        <div className="product-grid">
          {products.slice(0, visibleCount).map((item) => {
            // ✅ SỬ DỤNG LOGIC MỚI ĐỂ LẤY GIÁ BIẾN THỂ ĐẦU
            const { basePrice, finalPrice, discountDisplay, hasPromo } = getProductDisplayInfo(item);

            return (
              <div key={item.id} className="product-card">
                <div className="product-card__image">
                   {hasPromo && <div className="promo-badge">{discountDisplay}</div>}
                   <Link to={getProductLink(item.id)}>
                      <img src={getProductImage(item)} alt={item.name} loading="lazy" />
                   </Link>
                </div>

                <div className="product-card__content">
                  <div className="product-brand" style={{fontSize: '11px', color: '#999', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 'bold'}}>
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

                  <div className="product-price-container">
                    {hasPromo ? (
                      <>
                        <span className="product-price discounted">{formatter(finalPrice)}</span>
                        <span className="product-price original">{formatter(basePrice)}</span>
                      </>
                    ) : (
                      <span className="product-price">{formatter(basePrice)}</span>
                    )}
                  </div>

                  <button className="btn-add-cart" onClick={() => handleAddToCart(item)}>
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