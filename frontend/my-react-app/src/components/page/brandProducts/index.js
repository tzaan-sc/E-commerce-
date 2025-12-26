import { memo } from "react";
import BrandProducts from "components/user/brandProducts"; 
import Brand from "components/user/brand";
import Banner from "components/user/banner";
const BrandProductsPage = () => {
  return (
    <div className="brand-products-page-wrapper">
      <div className="container">
        <Banner />
        <Brand />
        <BrandProducts />
      </div>
    </div>
  );
};

export default memo(BrandProductsPage);