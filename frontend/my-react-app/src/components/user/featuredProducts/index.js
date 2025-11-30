// import { memo, useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { AiOutlineShoppingCart, AiOutlineDown, AiOutlineUp } from "react-icons/ai";import apiClient from "api/axiosConfig"; 
// import { addToCart } from "api/cart";    
// import { useCart } from "context/index"; 
// import { formatter } from "utils/formatter"; 
// import "./style.scss";

// const FeaturedProducts = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   // Cấu hình số lượng hiển thị
//   // Bạn có thể chỉnh lại thành 16 sau khi test xong
//   const ITEMS_PER_BATCH = 8; 
  
//   const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);
//   const { fetchCartCount } = useCart(); 

//   // ... (Giữ nguyên phần hàm shuffleArray và useEffect fetchProducts) ...
//   const shuffleArray = (array) => {
//     let currentIndex = array.length, randomIndex;
//     while (currentIndex !== 0) {
//       randomIndex = Math.floor(Math.random() * currentIndex);
//       currentIndex--;
//       [array[currentIndex], array[randomIndex]] = [
//         array[randomIndex], array[currentIndex]];
//     }
//     return array;
//   };

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setLoading(true);
//         const res = await apiClient.get("/products");
//         const data = res.data; 
//         const allProducts = Array.isArray(data) ? data : data.data || [];
        
//         // Giữ nguyên logic trộn mảng
//         const shuffledList = shuffleArray([...allProducts]);
//         setProducts(shuffledList);

//       } catch (err) {
//         console.error("Lỗi tải sản phẩm:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleAddToCart = async (productId) => {
//     // ... (Giữ nguyên logic thêm giỏ hàng) ...
//     const token = localStorage.getItem("token"); 
//     if (!token) { alert("Vui lòng đăng nhập"); return; }
//     try {
//       await addToCart(productId, 1); 
//       fetchCartCount(); 
//       alert("Đã thêm vào giỏ hàng!");
//     } catch (err) { console.error(err); alert("Lỗi thêm giỏ hàng"); }
//   };

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
//   };

//   // --- 1. HÀM XỬ LÝ XEM THÊM ---
//   const handleLoadMore = () => {
//     setVisibleCount((prev) => prev + ITEMS_PER_BATCH);
//   };

//   // --- 2. HÀM XỬ LÝ THU GỌN (Mới thêm) ---
//   const handleCollapse = () => {
//     // Reset lại về số lượng ban đầu
//     setVisibleCount(ITEMS_PER_BATCH);
    
//     // (Tùy chọn) Cuộn nhẹ lên đầu section để khách biết đã thu gọn
//     const section = document.querySelector('.featured-products');
//     if (section) {
//         section.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   if (loading) return null;
//   if (products.length === 0) return null; 

//   return (
//     <section className="featured-products">
//       <div className="container">
//         <h2 className="section-title">Có Thể Bạn Sẽ Thích</h2>
        
//         <div className="product-grid">
//           {products.slice(0, visibleCount).map((item) => (
//             <div key={item.id} className="product-card">
//               <div className="product-card__image">
//                  <Link to={`/product/${item.id}`}>
//                     <img 
//                       src={`http://localhost:8080${item.imageUrl || item.image}`} 
//                       alt={item.name} 
//                     />
//                  </Link>
//               </div>

//               <div className="product-card__content">
//                 <h3 className="product-name">
//                   <Link to={`/product/${item.id}`}>{item.name}</Link>
//                 </h3>
//                 <div className="product-price">
//                     {formatter ? formatter(item.price) : formatPrice(item.price)}
//                 </div>
//                 <button 
//                     className="btn-add-cart"
//                     onClick={() => handleAddToCart(item.id)}
//                 >
//                     <AiOutlineShoppingCart style={{marginRight: '5px'}}/>
//                     Thêm vào giỏ hàng
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* --- 3. LOGIC NÚT BẤM (Đã sửa đổi) --- */}
//         <div className="view-more-container">
//             {visibleCount < products.length ? (
//                 // Trường hợp 1: Vẫn còn sản phẩm -> Hiện nút Xem Thêm
//                 <button className="btn-view-more" onClick={handleLoadMore}>
//                     Xem thêm sản phẩm <AiOutlineDown />
//                 </button>
//             ) : (
//                 // Trường hợp 2: Đã hiện hết VÀ tổng sản phẩm nhiều hơn mức ban đầu -> Hiện nút Thu Gọn
//                 products.length > ITEMS_PER_BATCH && (
//                     <button className="btn-view-more collapse-mode" onClick={handleCollapse}>
//                         Thu gọn danh sách <AiOutlineUp />
//                     </button>
//                 )
//             )}
//         </div>
        
//       </div>
//     </section>
//   );
// };

// export default memo(FeaturedProducts);
import { memo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  
  const ITEMS_PER_BATCH = 8; 
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);
  const { fetchCartCount } = useCart(); 

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
             // TRƯỜNG HỢP MẶC ĐỊNH
             res = await apiClient.get("/products");
             setTitle("Có Thể Bạn Sẽ Thích");
             isFiltering = false;
        }

        const data = res.data; 
        const allProducts = Array.isArray(data) ? data : data.data || [];
        
        if (isFiltering) {
            // Đang lọc: Giữ nguyên thứ tự
            setProducts(allProducts);
        } else {
            // Mặc định: TRỘN TẤT CẢ (Không cắt bớt gì cả)
            // Trước đây bạn dùng .slice(4) nên nó bị mất 4 cái đầu
            // Giờ bỏ .slice(4) đi là hiện đủ
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

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("token"); 
    if (!token) { alert("Vui lòng đăng nhập"); return; }
    try { await addToCart(productId, 1); fetchCartCount(); alert("Đã thêm vào giỏ hàng!"); } 
    catch (err) { console.error(err); }
  };

  const handleLoadMore = () => setVisibleCount(prev => prev + ITEMS_PER_BATCH);
  
  const handleCollapse = () => {
    setVisibleCount(ITEMS_PER_BATCH);
    const section = document.querySelector('.featured-products');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
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
                 <Link to={ROUTERS.USER.PRODUCTDETAIL.replace(":id", item.id)}>
                    <img src={`http://localhost:8080${item.imageUrl || item.image}`} alt={item.name} />
                 </Link>
              </div>
              <div className="product-card__content">
                <div className="product-brand" style={{fontSize: '12px', color: '#999', textTransform: 'uppercase', marginBottom: '5px', fontWeight: 'bold'}}>
                    {item.brand?.name}
                </div>
                <h3 className="product-name">
                  <Link to={ROUTERS.USER.PRODUCTDETAIL.replace(":id", item.id)}>{item.name}</Link>
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