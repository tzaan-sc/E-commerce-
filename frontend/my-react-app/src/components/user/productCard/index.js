import { memo } from "react";
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { formatter } from "utils/formatter";
import { ROUTERS } from "utils/router";
import "./style.scss";

const ProductCard = ({ product, onAddToCart, isCustomer = false }) => {
  const imageUrl = product.images?.[0]?.urlImage || product.imageUrl || '';
  const detailRoute = isCustomer 
    ? ROUTERS.CUSTOMER.PRODUCTDETAIL.replace(":id", product.id)
    : ROUTERS.USER.PRODUCTDETAIL.replace(":id", product.id);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product.id);
    }
  };

  return (
    <div className="product-card">
      <div className="product-card__image">
        <Link to={detailRoute}>
          <img 
            src={`http://localhost:8080${imageUrl}`}
            alt={product.name}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x225?text=No+Image';
            }}
          />
        </Link>
      </div>
      
      <div className="product-card__content">
        <h3 className="product-name">
          <Link to={detailRoute}>
            {product.name}
          </Link>
        </h3>
        
        {/* Hiển thị thông tin thương hiệu và màn hình */}
        <div className="product-meta">
          {product.brand && (
            <span className="meta-item brand">
              {product.brand.name}
            </span>
          )}
          {product.screenSize && (
            <span className="meta-item screen">
              {product.screenSize.value}"
            </span>
          )}
          {product.usagePurpose && (
            <span className="meta-item purpose">
              {product.usagePurpose.name}
            </span>
          )}
        </div>
        
        <div className="product-price">
          {formatter(product.price)}
        </div>
        
        <button 
          className="btn-add-cart"
          onClick={handleAddToCart}
        >
          <AiOutlineShoppingCart style={{marginRight: '5px'}}/>
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
};

export default memo(ProductCard);