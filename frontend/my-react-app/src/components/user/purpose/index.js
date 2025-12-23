// export default memo(Purpose);
import { memo, useState, useEffect } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom"; 
import apiClient from "api/axiosConfig"; 
import "./style.scss";

const Purpose = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 1. Lấy URL params
  const [searchParams] = useSearchParams();
  const currentBrandId = searchParams.get("brand"); // Giữ lại brand nếu có
 const currentUsageId = searchParams.get("purpose") || searchParams.get("usage");

  const location = useLocation();
  const isCustomerPage = location.pathname.includes("/customer/home");
  const basePath = isCustomerPage ? "/customer/home/laptop" : "/laptop";

// Hàm tự động chọn icon dựa trên tên Nhu cầu
  const getIconByName = (name) => {
    // Chuyển tên về chữ thường để so sánh cho chính xác
    const lowerName = name?.toLowerCase() || "";

    // 1. Gaming / Chơi game
    if (lowerName.includes("gaming") || lowerName.includes("game") || lowerName.includes("chơi")) {
      return "🎮";
    }

    // 2. Đồ họa / Kỹ thuật / Thiết kế
    if (lowerName.includes("đồ họa") || lowerName.includes("thiết kế") || lowerName.includes("kỹ thuật") || lowerName.includes("design") || lowerName.includes("render")) {
      return "🎨";
    }

    // 3. Văn phòng / Làm việc
    if (lowerName.includes("văn phòng") || lowerName.includes("office") || lowerName.includes("làm việc")) {
      return "💼";
    }

    // 4. Học tập / Sinh viên
    if (lowerName.includes("học") || lowerName.includes("sinh viên") || lowerName.includes("student")) {
      return "📚";
    }

    // 5. Mỏng nhẹ / Thời trang
    if (lowerName.includes("mỏng") || lowerName.includes("nhẹ") || lowerName.includes("thời trang") || lowerName.includes("di động")) {
      return "🍃";
    }

    // 6. Workstation / Máy trạm / Lập trình
    if (lowerName.includes("workstation") || lowerName.includes("trạm") || lowerName.includes("lập trình") || lowerName.includes("code")) {
      return "🖥️";
    }

    // 7. Doanh nhân / Cao cấp / Sang trọng
    if (lowerName.includes("doanh nhân") || lowerName.includes("cao cấp") || lowerName.includes("sang trọng") || lowerName.includes("luxury")) {
      return "💎";
    }

    // Icon mặc định nếu không khớp từ khóa nào
    return "💻"; 
  };
  useEffect(() => {
    const fetchPurposes = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/usage-purposes");
        const mappedData = response.data.map(item => ({
            id: item.id,
            name: item.name,
            icon: getIconByName(item.name),
            count: "Xem ngay" 
        }));
        setCategories(mappedData);
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    fetchPurposes();
  }, []);

  if (loading) return null; 

  return (
    <section className="categories">
      <div className="container">
        <h2 className="section-title">Danh Mục Nổi Bật</h2>
        <div className="categories__grid">
          {categories.map(cat => {
             const isActive = currentUsageId && parseInt(currentUsageId) === cat.id;

             // 2. LOGIC TẠO LINK KẾT HỢP
             let nextPath = `${basePath}?`;

             // Toggle Usage: Nếu chưa chọn thì thêm, chọn rồi thì bỏ
             if (!isActive) {
                 nextPath += `purpose=${cat.id}&`;
             }

             // Giữ lại Brand nếu đang có
             if (currentBrandId) {
                 nextPath += `brand=${currentBrandId}`;
             }

             return (
              <Link 
                key={cat.id} 
                to={nextPath}
                className={`category-card ${isActive ? "active" : ""}`}
              >
                <div className="category-card__icon">{cat.icon}</div>
                <h3>{cat.name}</h3>
                <span>{cat.count}</span>  
              </Link>
             );
          })}
        </div>
      </div>
    </section>
  );
};

export default memo(Purpose);