import { memo, useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom"; 
import axios from "axios"; 

import Brand from "components/widgets/brand";
import Purpose from "components/widgets/purpose";
import FeaturedProducts from "components/widgets/featuredProducts";
import ScreenSizeList from "components/widgets/screenSizeList";
import Breadcrumb from "components/common/Breadcrumb";

const LaptopPage = () => {
  const [searchParams] = useSearchParams();
  
  // State lưu dữ liệu để tra cứu tên
  const [brands, setBrands] = useState([]);
  const [purposes, setPurposes] = useState([]); // 👈 Thêm state lưu DS nhu cầu

  // Lấy tham số URL
  const brandId = searchParams.get("brand");
  const usageId = searchParams.get("usage") || searchParams.get("purpose");
  const screenSizeId = searchParams.get("screenSize"); 

  // 👇 1. Gọi API lấy cả Brands và Purposes (Chạy 1 lần)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Dùng Promise.all để gọi song song cho nhanh
        const [resBrands, resPurposes] = await Promise.all([
            axios.get("http://localhost:8080/api/brands"),
            axios.get("http://localhost:8080/api/usage-purposes")
        ]);
        
        setBrands(resBrands.data);
        setPurposes(resPurposes.data);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu lọc:", error);
      }
    };
    fetchData();
  }, []);

  // 👇 2. Xử lý logic Breadcrumb
  const breadcrumbItems = useMemo(() => {
    const items = [{ label: "Laptop", link: "/laptop" }];

    // Trường hợp 1: Lọc theo Thương hiệu (VD: ASUS)
    if (brandId) {
        const selected = brands.find(b => String(b.id) === String(brandId));
        items.push({ label: selected ? selected.name : "...", link: null });
    }
    
    // Trường hợp 2: Lọc theo Nhu cầu (VD: Gaming -> Laptop Gaming)
    else if (usageId) {
        const selected = purposes.find(p => String(p.id) === String(usageId));
        if (selected) {
            // Thêm chữ "Laptop" vào trước tên nhu cầu cho hay
            items.push({ label: `Laptop ${selected.name}`, link: null });
        } else {
            items.push({ label: "...", link: null });
        }
    }

    // Trường hợp 3: Lọc theo Màn hình
    else if (screenSizeId) {
        items.push({ label: `Màn hình ${screenSizeId} inch`, link: null });
    }

    return items;
  }, [brandId, usageId, screenSizeId, brands, purposes]);

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />

      <div className="laptop-page-container container" style={{ padding: "40px 20px" }}>
        
        {/* LOGIC HIỂN THỊ CŨ GIỮ NGUYÊN */}
        {!screenSizeId && (
          <>
            <div style={{ marginBottom: "20px" }}><Brand /></div>
            <div style={{ marginBottom: "40px" }}><Purpose /></div>
          </>
        )}

        {screenSizeId && (
          <div style={{ marginBottom: "30px" }}>
              <div style={{ borderBottom: "1px solid #eee", paddingBottom: "10px", marginBottom: "20px" }}>
                  <h2 style={{fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase', color: '#333'}}>
                      Laptop theo kích thước màn hình
                  </h2>
              </div>
              <ScreenSizeList />
          </div>
        )}
        
        <FeaturedProducts 
          filterBrandId={brandId} 
          filterUsageId={usageId}
          filterScreenSizeId={screenSizeId} 
        />
      </div>
    </>
  );
};

export default memo(LaptopPage);
