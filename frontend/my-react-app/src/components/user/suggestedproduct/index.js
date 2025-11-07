import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart, AiOutlineHeart } from "react-icons/ai";
import { BsStarFill } from "react-icons/bs";
import { formatter } from "utils/formatter";
import "./style.scss";

const SuggestedProduct = () => {
  const [products] = useState([
    {
      id: 1,
      name: "Dell Inspiron 15 3520 - Core i5",
      price: 14990000,
      oldPrice: 16990000,
      image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400",
      rating: 4.5,
      reviews: 85,
    },
    {
      id: 2,
      name: "Asus Vivobook 15 OLED - Ryzen 5",
      price: 16990000,
      oldPrice: 18990000,
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
      rating: 4.6,
      reviews: 92,
    },
    {
      id: 3,
      name: "HP 240 G9 - Core i3 1215U",
      price: 10990000,
      oldPrice: 12990000,
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400",
      rating: 4.3,
      reviews: 64,
    },
    {
      id: 4,
      name: "Lenovo IdeaPad Slim 3 - Ryzen 7",
      price: 17990000,
      oldPrice: 19990000,
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
      rating: 4.7,
      reviews: 108,
    },
    {
      id: 5,
      name: "Acer Aspire 5 - Core i5 1235U",
      price: 13990000,
      oldPrice: 15990000,
      image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400",
      rating: 4.4,
      reviews: 73,
    },
    {
      id: 6,
      name: "MSI Modern 14 - Core i7 1255U",
      price: 18990000,
      oldPrice: 21990000,
      image: "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400",
      rating: 4.6,
      reviews: 96,
    },
  ]);

  return (
    <section className="suggested-product">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Có Thể Bạn Thích</h2>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <Link to={`/product/${product.id}`}>
                  <img src={product.image} alt={product.name} />
                </Link>
                <button className="wishlist-btn" title="Yêu thích">
                  <AiOutlineHeart />
                </button>
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
    </section>
  );
};

export default memo(SuggestedProduct);