// src/components/feature/ProductCard.js

import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <span className="product-price">{product.price.toLocaleString('vi-VN')} đ</span>
      </div>
      <button 
        className="add-to-cart-btn" 
        onClick={() => onAddToCart(product)}
      >
        Thêm vào giỏ hàng
      </button>
    </div>
  );
};

export default ProductCard;