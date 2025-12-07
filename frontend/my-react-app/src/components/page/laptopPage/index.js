import { memo } from "react";
import { useSearchParams } from "react-router-dom"; 
import Brand from "components/user/brand";
import Purpose from "components/user/purpose";
import FeaturedProducts from "components/user/featuredProducts";
// 👇 1. Import Component danh sách kích thước
import ScreenSizeList from "components/user/screenSizeList";

const LaptopPage = () => {
  const [searchParams] = useSearchParams();
  
  // Lấy các tham số
  const brandId = searchParams.get("brand");
  const usageId = searchParams.get("usage") || searchParams.get("purpose");
  const screenSizeId = searchParams.get("screenSize"); 

  return (
    <div className="laptop-page-container container" style={{ padding: "40px 20px" }}>
      
      {/* TRƯỜNG HỢP 1: NẾU KHÔNG CHỌN SIZE (Mặc định) */}
      {/* -> Hiện lọc Thương hiệu & Nhu cầu như cũ */}
      {!screenSizeId && (
        <>
          <div style={{ marginBottom: "20px" }}><Brand /></div>
          <div style={{ marginBottom: "40px" }}><Purpose /></div>
        </>
      )}

      {/* TRƯỜNG HỢP 2: NẾU ĐANG CHỌN SIZE */}
      {/* -> Ẩn Thương hiệu/Nhu cầu, CHỈ hiện danh sách Size */}
      {screenSizeId && (
        <div style={{ marginBottom: "30px" }}>
            <div style={{ 
                borderBottom: "1px solid #eee", 
                paddingBottom: "10px", 
                marginBottom: "20px" 
            }}>
                <h2 style={{fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase', color: '#333'}}>
                    Laptop theo kích thước màn hình
                </h2>
            </div>
            
            {/* 👇 Hiện danh sách các size khác để người dùng dễ đổi */}
            <ScreenSizeList />
        </div>
      )}
      
      {/* DANH SÁCH SẢN PHẨM (Luôn hiện) */}
      <FeaturedProducts 
        filterBrandId={brandId} 
        filterUsageId={usageId}
        filterScreenSizeId={screenSizeId} // Truyền ID size xuống để lọc
      />
    </div>
  );
};

export default memo(LaptopPage);