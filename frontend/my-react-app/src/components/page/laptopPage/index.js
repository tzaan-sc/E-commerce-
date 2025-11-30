// import { memo, useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom"; // Để đọc URL
// import apiClient from "api/axiosConfig";
// import Brand from "components/user/brand";
// import Purpose from "components/user/purpose";
// import FeaturedProducts from "components/user/featuredProducts";
// import { Link } from "react-router-dom";
// import { AiOutlineShoppingCart } from "react-icons/ai";
// import { addToCart } from "api/cart";
// import { useCart } from "context/index";
// import { formatter } from "utils/formatter";
// import { ROUTERS } from "utils/router";
// // import "./style.scss"; 

// const LaptopPage = () => {
//   // 1. Lấy tham số từ URL
//   const [searchParams] = useSearchParams();
//   const brandId = searchParams.get("brand");
//   const usageId = searchParams.get("usage");

//   // State cho danh sách đã lọc
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const { fetchCartCount } = useCart();

//   // Kiểm tra xem có đang lọc không
//   const isFiltering = brandId || usageId;

//   // 2. Gọi API lọc (Chỉ chạy khi có tham số trên URL)
//   useEffect(() => {
//     if (!isFiltering) return; // Nếu không lọc thì thôi

//     const fetchFilteredData = async () => {
//       setLoading(true);
//       try {
//         let response;
//         if (brandId) {
//            response = await apiClient.get(`/products/brand/${brandId}`);
//         } else if (usageId) {
//            response = await apiClient.get(`/products/usage-purpose/${usageId}`);
//         }
//         setFilteredProducts(response.data || []);
//       } catch (error) {
//         console.error("Lỗi lọc sản phẩm:", error);
//         setFilteredProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFilteredData();
//   }, [brandId, usageId]); // Chạy lại khi URL thay đổi

//   const handleAddToCart = async (productId) => {
//     const token = localStorage.getItem("token"); 
//     if (!token) { alert("Vui lòng đăng nhập!"); return; }
//     try { await addToCart(productId, 1); fetchCartCount(); alert("Đã thêm vào giỏ hàng!"); } 
//     catch (err) { console.error(err); }
//   };

//   // --- TRƯỜNG HỢP 1: KHÔNG LỌC (Giao diện mặc định) ---
//   if (!isFiltering) {
//     return (
//       <div className="laptop-page-default">
//         <Brand />
//         <Purpose />
//         <FeaturedProducts  />
//       </div>
//     );
//   }

//   // --- TRƯỜNG HỢP 2: ĐANG LỌC (Giao diện danh sách kết quả) ---
//   return (
//     <div className="laptop-page-filtered container" style={{ padding: "40px 20px" }}>
      
//       {/* Vẫn hiện Brand để người dùng có thể đổi hãng khác nhanh chóng */}
//       <Brand /> 

//       <div className="section-header" style={{ marginTop: "40px" }}>
//         <h2 className="section-title" style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase', borderBottom: '2px solid #eee', paddingBottom: '10px', display: 'inline-block' }}>
//             {brandId ? "Laptop theo Thương hiệu" : "Laptop theo Nhu cầu"}
//         </h2>
        
//         {/* Nút quay lại xem tất cả */}
//         <Link to={ROUTERS.USER.LAPTOP} style={{ marginLeft: '20px', color: '#0066cc', textDecoration: 'none', fontSize: '16px' }}>
//             &larr; Xem tất cả
//         </Link>
//       </div>

//       {loading ? (
//         <div style={{ textAlign: "center", padding: "50px" }}>Đang tải...</div>
//       ) : filteredProducts.length === 0 ? (
//         <div style={{ textAlign: "center", padding: "50px", color: "#666" }}>Không tìm thấy sản phẩm nào.</div>
//       ) : (
//         <div className="product-grid">
//           {filteredProducts.map((item) => (
//             <div key={item.id} className="product-card">
//               <div className="product-card__image">
//                 <Link to={ROUTERS.USER.PRODUCTDETAIL.replace(":id", item.id)}>
//                   <img src={`http://localhost:8080${item.imageUrl || item.image}`} alt={item.name} />
//                 </Link>
//               </div>
//               <div className="product-card__content">
//                 <div className="product-brand" style={{fontSize: '12px', color: '#999', textTransform: 'uppercase', fontWeight: 'bold'}}>
//                     {item.brand?.name}
//                 </div>
//                 <h3 className="product-name">
//                   <Link to={ROUTERS.USER.PRODUCTDETAIL.replace(":id", item.id)}>{item.name}</Link>
//                 </h3>
//                 <div className="product-price" style={{color: '#ff6b6b', fontWeight: 'bold', fontSize: '18px', margin: '10px 0'}}>
//                     {formatter(item.price)}
//                 </div>
//                 <button className="btn-add-cart" onClick={() => handleAddToCart(item.id)}>
//                   <AiOutlineShoppingCart style={{marginRight: '5px'}}/> Thêm
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default memo(LaptopPage);
import { memo } from "react";
import { useSearchParams } from "react-router-dom"; 
import Brand from "components/user/brand";
import Purpose from "components/user/purpose";
import FeaturedProducts from "components/user/featuredProducts";
// import "./style.scss"; 

const LaptopPage = () => {
  const [searchParams] = useSearchParams();
  
  // Lấy tham số từ URL
  const brandId = searchParams.get("brand");
  const usageId = searchParams.get("usage");

  return (
    <div className="laptop-page-container container" style={{ padding: "40px 20px" }}>
      
      {/* 1. PHẦN BỘ LỌC THƯƠNG HIỆU */}
      <div style={{ marginBottom: "20px" }}>
        <Brand /> 
      </div>

      {/* 2. PHẦN BỘ LỌC NHU CẦU (MỚI THÊM VÀO) */}
      <div style={{ marginBottom: "40px" }}>
        <Purpose />
      </div>
      
      {/* <div className="section-header">
        <h2 className="section-title" style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase', borderBottom: '2px solid #eee', paddingBottom: '10px', display: 'inline-block' }}>
            {brandId && usageId ? "Kết quả lọc kết hợp" 
             : brandId ? "Laptop theo Thương hiệu" 
             : usageId ? "Laptop theo Nhu cầu" 
             : "Tất cả Laptop"}
        </h2>
      </div> */}

      {/* 3. DANH SÁCH SẢN PHẨM (Đã xử lý logic lọc bên trong component này) */}
      <FeaturedProducts 
        filterBrandId={brandId} 
        filterUsageId={usageId}
      />
    </div>
  );
};

export default memo(LaptopPage);