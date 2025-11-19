import { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart, AiOutlineHeart, AiOutlineEye } from "react-icons/ai";
import { BsStarFill } from "react-icons/bs";
import { formatter } from "utils/formatter";
import axios from "axios";
import { addToCart } from "../../../api/cart"; // api cart đã tạo
import "./style.scss";

const ProductCard = ({ userId, onCartUpdate }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/product");
      setProducts(res.data);
    } catch (err) {
      console.error("Lấy sản phẩm thất bại:", err);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!userId) {
      alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return;
    }

    try {
      await addToCart(userId, productId, 1);
      alert("Đã thêm sản phẩm vào giỏ hàng!");
      if (onCartUpdate) onCartUpdate(); // cập nhật số lượng giỏ hàng
    } catch (err) {
      console.error(err);
      alert("Thêm giỏ hàng thất bại, thử lại sau.");
    }
  };

  return (
    <div className="product-card-container">
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
              <div className="product-badges">
                {product.badge && (
                  <span className={`badge badge-${product.badge.toLowerCase()}`}>
                    {product.badge}
                  </span>
                )}
                {product.discount && (
                  <span className="badge badge-discount">-{product.discount}%</span>
                )}
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
                <span>{product.rating || 0}</span>
                <span className="reviews">({product.reviews || 0})</span>
              </div>
              <h3 className="product-name">
                <Link to={`/product/${product.id}`}>{product.name}</Link>
              </h3>
              <div className="product-price">
                <span className="current-price">{formatter(product.price)}</span>
                {product.oldPrice && (
                  <span className="old-price">{formatter(product.oldPrice)}</span>
                )}
              </div>
              <button
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(product.id)}
              >
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
