import { memo } from "react";
import BrandProducts from "components/widgets/brandProducts"; 
import Brand from "components/widgets/brand";
import Banner from "components/widgets/banner";
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
