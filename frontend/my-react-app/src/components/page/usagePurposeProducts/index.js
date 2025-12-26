import { memo } from "react";
import UsagePurposeProducts from "components/user/usagePurposeProducts"; // Component vừa tạo ở trên
import Purpose from "components/user/purpose"; // Component danh sách danh mục
import Banner from "components/user/banner"; // Banner chung
import Brand from "components/user/brand"; // Banner chung 
const UsagePurposeProductsPage = () => {
  return (
    <div className="usage-purpose-page-wrapper">
      <div className="container">
        {/* 1. Hiện Banner đầu trang */}
        <Banner />
        {/* 2. Hiện lại danh sách các nhu cầu (để khách dễ chuyển qua lại Gaming/Văn phòng...) */}
        <Purpose />
        
        {/* 3. Hiện danh sách sản phẩm của nhu cầu đang chọn */}
        <UsagePurposeProducts />
      </div>
    </div>
  );
};

export default memo(UsagePurposeProductsPage);