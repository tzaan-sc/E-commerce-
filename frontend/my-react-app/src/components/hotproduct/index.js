import { memo, useState } from "react";
import { Link } from "react-router-dom";
import "./style.scss"
import { formatter } from "utils/formatter";

const HotProduct = () => {
const [hotProducts] = useState([
    {
      id: 1,
      name: "Dell XPS 13",
      price: 25990000,
      oldPrice: 29990000,
      image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300&h=300&fit=crop",
      badge: "Giảm 13%",
      rating: 4.8,
      specs: "i7-1165G7 | 16GB | 512GB SSD"
    },
    {
      id: 2,
      name: "HP Pavilion Gaming",
      price: 18990000,
      oldPrice: 22990000,
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop",
      badge: "Trả góp 0%",
      rating: 4.6,
      specs: "i5-11300H | 8GB | 512GB SSD"
    },
    {
      id: 3,
      name: "Asus ROG Strix G15",
      price: 32990000,
      oldPrice: 36990000,
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300&h=300&fit=crop",
      badge: "Hot",
      rating: 4.9,
      specs: "i7-12700H | 16GB | RTX 3060"
    },
    {
      id: 4,
      name: "Lenovo ThinkPad X1",
      price: 28990000,
      oldPrice: 32990000,
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&h=300&fit=crop",
      badge: "Mới về",
      rating: 4.7,
      specs: "i7-1185G7 | 16GB | 1TB SSD"
    },
    {
      id: 5,
      name: "Acer Nitro 5",
      price: 21990000,
      oldPrice: 24990000,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop",
      badge: "Bán chạy",
      rating: 4.5,
      specs: "i5-12450H | 8GB | RTX 3050"
    },
    {
      id: 6,
      name: "MSI GF63 Thin",
      price: 19990000,
      oldPrice: 23990000,
      image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=300&h=300&fit=crop",
      badge: "Giảm sốc",
      rating: 4.4,
      specs: "i5-11400H | 8GB | GTX 1650"
    }
  ]);
  return(<section className="hot-products">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
            <Link to="/products" className="view-all">Xem tất cả →</Link>
          </div>
          <div className="products__grid">
            {hotProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-card__badge">{product.badge}</div>
                <div className="product-card__image">
                  <img src={product.image} alt={product.name} />
                  <div className="product-card__actions">
                    <button className="btn-icon">❤️</button>
                    <button className="btn-icon">👁️</button>
                  </div>
                </div>
                <div className="product-card__content">
                  <h3>{product.name}</h3>
                  <div className="product-card__specs">{product.specs}</div>
                  <div className="product-card__rating">
                    ⭐ {product.rating} <span>(128 đánh giá)</span>
                  </div>
                  <div className="product-card__price">
                    <span className="price-current">{formatter(product.price)}</span>
                    <span className="price-old">{formatter(product.oldPrice)}</span>
                  </div>
                  <button className="btn-buy">Mua ngay</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>)
};
      
      export default memo(HotProduct);