// import { memo, useState } from "react";
// import { Link } from "react-router-dom";
// import "./style.scss"

// const Brand = () => {

//     const [brands] = useState([
//     { id: 1, name: "Dell", logo: "🖥️" },
//     { id: 2, name: "HP", logo: "💻" },
//     { id: 3, name: "Asus", logo: "⚡" },
//     { id: 4, name: "Lenovo", logo: "🔷" },
//     { id: 5, name: "Acer", logo: "🎯" },
//     { id: 6, name: "MSI", logo: "🎮" },
//     { id: 7, name: "Apple", logo: "🍎" },
//   ]);

// const [categories] = useState([
//     { id: 1, name: "Laptop Gaming", icon: "🎮", count: "150+" },
//     { id: 2, name: "Laptop Văn Phòng", icon: "💼", count: "200+" },
//     { id: 3, name: "Laptop Đồ Họa", icon: "🎨", count: "80+" },
//     { id: 4, name: "Laptop Mỏng Nhẹ", icon: "⚡", count: "120+" },
//     { id: 5, name: "Laptop Sinh Viên", icon: "📚", count: "180+" },
//     { id: 6, name: "Workstation", icon: "🖥️", count: "50+" }
//   ]);
//   return (
  
//       <section className="brands">
//         <div className="container">
//           <h2 className="section-title">Thương Hiệu</h2>
//           <div className="brands__grid">
//             {brands.map(brand => (
//               <Link key={brand.id} to={`/brand/${brand.id}`} className="brand-item">
//                 <div className="brand-item__logo">{brand.logo}</div>
//                 <span>{brand.name}</span>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </section>
      
//   );
//   };
  


// export default memo(Brand);
// import { memo, useState, useEffect } from "react";
// import { Link, useSearchParams, useLocation } from "react-router-dom"; // Thêm useSearchParams
// import axios from "axios"; 
// import "./style.scss";

// const Brand = () => {
//   const [brands, setBrands] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   // Lấy tham số từ URL để biết cái nào đang Active
//   const [searchParams] = useSearchParams();
//   const activeBrandId = searchParams.get("brand"); // Lấy số 1, 2...
//   const location = useLocation();

//   // Kiểm tra xem có đang ở trang customer không để giữ layout
//   const isCustomerPage = location.pathname.includes("/customer/home");
//   const basePath = isCustomerPage ? "/customer/home/laptop" : "/laptop";

//   useEffect(() => {
//     const fetchBrands = async () => {
//       try {
//         const response = await axios.get("http://localhost:8080/api/brands");
//         setBrands(response.data);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBrands();
//   }, []);

//   if (loading) return null;

//   return (
//     <section className="brands">
//       <div className="container">
//         <h2 className="section-title">Thương Hiệu Nổi Bật</h2>
//         <div className="brands__grid">
//           {brands.map((brand) => {
//             // Kiểm tra Active: So sánh ID trong URL với ID của brand
//             const isActive = activeBrandId && parseInt(activeBrandId) === brand.id;

//             return (
//               <Link 
//                 key={brand.id} 
//                 // Link chuyển thành dạng Query Param
//                 to={`${basePath}?brand=${brand.id}`} 
//                 className={`brand-item ${isActive ? "active" : ""}`} 
//               >
//                 <div className="brand-item__logo">
//                   <img src={`http://localhost:8080${brand.logoUrl}`} alt={brand.name} />
//                 </div>
//                 <span className="brand-name">{brand.name}</span> 
//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default memo(Brand);
import { memo, useState, useEffect } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import axios from "axios"; 
import "./style.scss";

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 1. Lấy URL params hiện tại
  const [searchParams] = useSearchParams();
  const currentUsageId = searchParams.get("usage"); // Lấy ID nhu cầu đang chọn (nếu có)
  const currentBrandId = searchParams.get("brand"); // Lấy ID brand đang chọn

  const location = useLocation();
  // Xác định đường dẫn gốc (/laptop hoặc /customer/home/laptop)
  const isCustomerPage = location.pathname.includes("/customer/home");
  const basePath = isCustomerPage ? "/customer/home/laptop" : "/laptop";

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/brands");
        setBrands(response.data);
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    fetchBrands();
  }, []);

  if (loading) return null;

  return (
    <section className="brands">
      <div className="container">
        <h2 className="section-title">Thương Hiệu Nổi Bật</h2>
        <div className="brands__grid">
          {brands.map((brand) => {
            const isActive = currentBrandId && parseInt(currentBrandId) === brand.id;

            // 2. LOGIC TẠO LINK KẾT HỢP
            // Bắt đầu bằng base path
            let nextPath = `${basePath}?`;
            
            // Nếu đang chọn Brand này rồi -> Bấm lại sẽ bỏ chọn (Toggle off)
            // Nếu chưa chọn -> Chọn Brand này
            if (!isActive) {
                nextPath += `brand=${brand.id}&`;
            }

            // Nếu đang có Nhu cầu (Usage) trên URL -> Giữ nguyên nó
            if (currentUsageId) {
                nextPath += `usage=${currentUsageId}`;
            }

            return (
              <Link 
                key={brand.id} 
                to={nextPath} 
                className={`brand-item ${isActive ? "active" : ""}`} 
              >
                <div className="brand-item__logo">
                  <img src={`http://localhost:8080${brand.logoUrl}`} alt={brand.name} />
                </div>
                <span className="brand-name">{brand.name}</span> 
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default memo(Brand);
