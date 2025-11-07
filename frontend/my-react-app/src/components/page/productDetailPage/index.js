import { memo, useState } from "react";
import Carousel from "components/user/carousel";
import ProductDetail from "components/user/productdetail";
const ProductDetailPage = () => {

  return (
    <div className="main-container">
        
    <Carousel />
    <ProductDetail />
    </div>
  );
};

export default memo(ProductDetailPage);