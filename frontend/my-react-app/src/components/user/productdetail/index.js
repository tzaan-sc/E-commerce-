import { memo, useState } from "react";
import { AiOutlineShoppingCart, AiOutlineHeart, AiOutlineShareAlt } from "react-icons/ai";
import { FaStar, FaTruck, FaShieldAlt, FaUndoAlt } from "react-icons/fa";
import "./style.scss";

const ProductDetail = () => {
  const [selectedColor, setSelectedColor] = useState('silver');
  const [selectedStorage, setSelectedStorage] = useState('512GB');
  const [quantity, setQuantity] = useState(1);

  const colors = [
    { name: 'silver', label: 'Bạc', hex: '#E5E7EB' },
    { name: 'gray', label: 'Xám Không Gian', hex: '#6B7280' },
    { name: 'gold', label: 'Vàng', hex: '#FCD34D' }
  ];

  const product = {
    name: 'MacBook Pro 16" M3 Max',
    price: 59990000,
    originalPrice: 69990000,
    rating: 4.8,
    reviews: 245,
    inStock: true,
    colors: colors,
    storage: ['256GB', '512GB', '1TB', '2TB'],
    specs: [
      { label: 'CPU', value: 'Apple M3 Max 16-core' },
      { label: 'RAM', value: '32GB Unified Memory' },
      { label: 'Màn hình', value: '16.2" Liquid Retina XDR' },
      { label: 'Card đồ họa', value: '40-core GPU' },
      { label: 'Pin', value: 'Lên đến 22 giờ' },
      { label: 'Trọng lượng', value: '2.16 kg' }
    ]
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="info-section">
      <h1 className="product-title">{product.name}</h1>

      <div className="price-section">
        <div className="current-price">{formatPrice(product.price)}</div>
        <div className="original-price">{formatPrice(product.originalPrice)}</div>
      </div>

      <div className="quantity-section">
        <span className="quantity-label">Số lượng:</span>
        <div className="quantity-control">
          <button 
            className="quantity-btn"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
          >
            −
          </button>
          <div className="quantity-value">{quantity}</div>
          <button 
            className="quantity-btn"
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= 10}
          >
            +
          </button>
        </div>
      </div>

      <div className="action-buttons">
        <button className="btn btn-primary">
          <AiOutlineShoppingCart size={20} />
          Thêm vào giỏ
        </button>
        <button className="btn btn-secondary">
          Mua ngay
        </button>
        
        <button className="btn btn-secondary icon-btn">
          <AiOutlineShareAlt size={20} />
        </button>
      </div>


      <div className="specs-section">
        <h2 className="specs-title">Thông số kỹ thuật</h2>
        <div className="specs-grid">
          {product.specs.map((spec, index) => (
            <div key={index} className="spec-row">
              <div className="spec-label">{spec.label}</div>
              <div className="spec-value">{spec.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(ProductDetail);