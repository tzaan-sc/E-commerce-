import { memo, useState, useEffect } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import axios from "axios"; 
import "./style.scss"; // Bạn có thể dùng chung style hoặc tạo file mới

const ScreenSizeList = () => {
  const [screenSizes, setScreenSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 1. Lấy URL params hiện tại
  const [searchParams] = useSearchParams();
  const currentScreenSizeId = searchParams.get("screenSize"); // Lấy ID size đang chọn

  const location = useLocation();
  // Xác định đường dẫn gốc
  const isCustomerPage = location.pathname.includes("/customer/home");
  const basePath = isCustomerPage ? "/customer/home/laptop" : "/laptop";

  // 2. Fetch dữ liệu từ API
  useEffect(() => {
    const fetchScreenSizes = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/screen-sizes");
        setScreenSizes(response.data);
      } catch (error) { 
        console.error("Lỗi tải kích thước:", error); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchScreenSizes();
  }, []);

  if (loading) return null;

  return (
    <section className="screen-sizes">
      <div className="container">
        {/* Tiêu đề (Tùy chọn) */}
        {/* <h2 className="section-title">Kích thước màn hình</h2> */}
        
        <div className="screen-sizes__grid" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {screenSizes.map((size) => {
            const isActive = currentScreenSizeId && parseInt(currentScreenSizeId) === size.id;

            // 3. LOGIC TẠO LINK (TOGGLE)
            // Nếu đang chọn Size này -> Link sẽ trỏ về trang gốc (Bỏ chọn)
            // Nếu chưa chọn -> Link sẽ thêm tham số screenSize
            const nextPath = isActive 
                ? basePath 
                : `${basePath}?screenSize=${size.id}`;

            return (
              <Link 
                key={size.id} 
                to={nextPath} 
                className={`screen-size-item ${isActive ? "active" : ""}`}
                style={{
                    padding: '10px 20px',
                    border: isActive ? '2px solid #2563eb' : '1px solid #ddd',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: isActive ? '#2563eb' : '#333',
                    fontWeight: isActive ? 'bold' : 'normal',
                    backgroundColor: isActive ? '#f0f7ff' : '#fff',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                }}
              >
                <span>{size.value} inch</span> 
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default memo(ScreenSizeList);