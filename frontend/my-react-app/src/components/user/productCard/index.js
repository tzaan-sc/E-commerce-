import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart, AiOutlineHeart, AiOutlineEye } from "react-icons/ai";
import { BsStarFill } from "react-icons/bs";
import { formatter } from "utils/formatter";
import "./style.scss";

const ProductCard = () => {
  const [products] = useState([
    {
      id: 1,
      name: "Dell XPS 13 9320 - Intel Core i7",
      price: 32990000,
      oldPrice: 36990000,
      image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400",
      rating: 4.8,
      reviews: 128,
      badge: "Hot",
      discount: 11,
    },
    {
      id: 2,
      name: "HP Pavilion Gaming 15 - RTX 3050",
      price: 19990000,
      oldPrice: 23990000,
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400",
      rating: 4.6,
      reviews: 95,
      badge: "Sale",
      discount: 17,
    },
    {
      id: 3,
      name: "Asus ROG Strix G15 - RTX 4060",
      price: 28990000,
      oldPrice: 32990000,
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
      rating: 4.9,
      reviews: 203,
      badge: "New",
      discount: 12,
    },
    {
      id: 4,
      name: "Lenovo ThinkPad X1 Carbon Gen 11",
      price: 35990000,
      oldPrice: 39990000,
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
      rating: 4.7,
      reviews: 157,
      badge: "Hot",
      discount: 10,
    },
    {
      id: 5,
      name: "MSI GF63 Thin - Core i5 12450H",
      price: 15990000,
      oldPrice: 18990000,
      image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400",
      rating: 4.5,
      reviews: 89,
      badge: "Sale",
      discount: 16,
    },
    {
      id: 6,
      name: "Acer Nitro 5 - RTX 3060",
      price: 24990000,
      oldPrice: 27990000,
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400",
      rating: 4.6,
      reviews: 142,
      badge: "Hot",
      discount: 11,
    },
    {
      id: 7,
      name: "MacBook Air M2 2023",
      price: 28990000,
      oldPrice: 32990000,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
      rating: 4.9,
      reviews: 276,
      badge: "New",
      discount: 12,
    },
    {
      id: 8,
      name: "HP Envy x360 - Core i7 1355U",
      price: 22990000,
      oldPrice: 25990000,
      image: "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400",
      rating: 4.7,
      reviews: 118,
      badge: "Sale",
      discount: 12,
    },
    {
      id: 9,
      name: "Asus ZenBook 14 OLED - Ryzen 7",
      price: 21990000,
      oldPrice: 24990000,
      image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400",
      rating: 4.8,
      reviews: 164,
      badge: "Hot",
      discount: 12,
    },
    {
      id: 10,
      name: "Dell Inspiron 14 Plus - RTX 3050",
      price: 23990000,
      oldPrice: 26990000,
      image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400",
      rating: 4.6,
      reviews: 132,
      badge: "Sale",
      discount: 11,
    },
    {
      id: 11,
      name: "Acer Swift X - RTX 3050 Ti",
      price: 21990000,
      oldPrice: 24990000,
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
      rating: 4.7,
      reviews: 88,
      badge: "Hot",
      discount: 12,
    },
    {
      id: 12,
      name: "MSI Prestige 14 Evo - Core i7",
      price: 25990000,
      oldPrice: 28990000,
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400",
      rating: 4.8,
      reviews: 95,
      badge: "New",
      discount: 10,
    },
  ]);

  return (
    <div className="product-card-container">
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
              <div className="product-badges">
                <span className={`badge badge-${product.badge.toLowerCase()}`}>
                  {product.badge}
                </span>
                <span className="badge badge-discount">-{product.discount}%</span>
              </div>
              <div className="product-actions">
                <button className="action-btn" title="Yêu thích">
                  <AiOutlineHeart />
                </button>
                <button className="action-btn" title="Xem nhanh">
                  <AiOutlineEye />
                </button>
              </div>
            </div>

            <div className="product-info">
              <div className="product-rating">
                <BsStarFill />
                <span>{product.rating}</span>
                <span className="reviews">({product.reviews})</span>
              </div>
              <h3 className="product-name">
                <Link to={`/product/${product.id}`}>{product.name}</Link>
              </h3>
              <div className="product-price">
                <span className="current-price">{formatter(product.price)}</span>
                <span className="old-price">{formatter(product.oldPrice)}</span>
              </div>
              <button className="add-to-cart-btn">
                <AiOutlineShoppingCart />
                <span>Thêm vào giỏ</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(ProductCard);