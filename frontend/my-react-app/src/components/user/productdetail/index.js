import { memo, useState } from "react";
import { AiOutlineShoppingCart, AiOutlineShareAlt } from "react-icons/ai";
import { useNavigate } from "react-router-dom"; 
import { useCart } from "../../../context/index"; 
import { addToCart } from "api/cart"; 
import { ROUTERS } from "utils/router";
import "./style.scss";

// 👇 Nhận prop 'product' từ cha
const ProductDetail = ({ product }) => {
  const navigate = useNavigate(); 
  const { fetchCartCount } = useCart(); 

  // Không cần state product và loading nữa vì cha đã lo
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isAdding, setIsAdding] = useState(false); 

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  // Logic tăng giảm số lượng
  const handleQuantityChange = (delta) => {
    if (!product || product.stockQuantity <= 0) return;
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stockQuantity) {
       setQuantity(newQuantity);
    }
  };

  // Logic thêm giỏ hàng (Giữ nguyên)
  const processAddToCart = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
        if(window.confirm("Bạn cần đăng nhập để mua hàng. Đăng nhập ngay?")) {
            navigate(ROUTERS.USER.LOGIN);
        }
        return null;
    }

    setIsAdding(true);
    try {
        const response = await addToCart(product.id, quantity);
        fetchCartCount(); 
        return response.data; 
    } catch (error) {
        console.error("Lỗi thêm giỏ hàng:", error);
        alert("Có lỗi xảy ra khi thêm vào giỏ hàng!");
        return null;
    } finally {
        setIsAdding(false);
    }
  };

  const handleAddToCart = async () => {
      const cartItem = await processAddToCart();
      if (cartItem) {
          alert("Đã thêm sản phẩm vào giỏ hàng thành công!");
      }
  };

  const handleBuyNow = async () => {
      const cartItem = await processAddToCart();
      if (cartItem) {
          navigate(ROUTERS.CUSTOMER.CART); 
      }
  };

  // Nếu chưa có product (dù cha đã check, nhưng check lại cho chắc)
  if (!product) return null;

  return (
    <div className="info-section">
      <h1 className="product-title">{product.name}</h1>

      <div className="price-section">
        <div className="current-price">{formatPrice(product.price)}</div>
      </div>

      <div className="quantity-section">
        <span className="quantity-label">Số lượng:</span>
        <div className="quantity-control">
          <button 
            className="quantity-btn" 
            onClick={() => handleQuantityChange(-1)} 
            disabled={quantity <= 1}
          >−</button>
          <div className="quantity-value">{quantity}</div>
          <button 
            className="quantity-btn" 
            onClick={() => handleQuantityChange(1)} 
            disabled={quantity >= product.stockQuantity}
          >+</button>
        </div>
        <span className="stock-info">
             {product.stockQuantity > 0 
                ? `(Còn ${product.stockQuantity} sản phẩm)` 
                : <span style={{color: 'red'}}>(Hết hàng)</span>}
        </span>
      </div>

      <div className="action-buttons">
        <button 
            className="btn btn-primary"
            onClick={handleAddToCart}
            disabled={!product.stockQuantity || isAdding}
            style={{ opacity: (!product.stockQuantity || isAdding) ? 0.7 : 1 }}
        >
          <AiOutlineShoppingCart size={20} /> 
          {isAdding ? "Đang xử lý..." : "Thêm vào giỏ"}
        </button>
        
        <button 
            className="btn btn-secondary"
            onClick={handleBuyNow}
            disabled={!product.stockQuantity || isAdding}
            style={{ opacity: (!product.stockQuantity || isAdding) ? 0.7 : 1 }}
        >
            Mua ngay
        </button>
        
        <button className="btn btn-secondary icon-btn"><AiOutlineShareAlt size={20} /></button>
      </div>

      {/* Phần Tabs Mô tả/Thông số */}
      <div className="product-tabs-container">
        <div className="tabs-header">
          <div 
            className={`tab-item ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Mô tả sản phẩm
          </div>
          <div 
            className={`tab-item ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={() => setActiveTab('specs')}
          >
            Thông số kỹ thuật
          </div>
        </div>

        <div className="tabs-content-area">
          {activeTab === 'description' && (
            <div className="description-box">
              <div style={{ whiteSpace: "pre-line" }}>
                {product.description || "Đang cập nhật mô tả..."}
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
             <div className="specs-text-block">
               {product.specs && product.specs.length > 0 ? (
                 <div className="specs-list">
                   {product.specs.map((spec, index) => {
                     // Lấy giá trị của thông số (vd: "- CPU: Intel Core i5...")
                     const specContent = spec.value || spec.detail || spec;
                     
                     // Nếu dữ liệu là chuỗi dài, ta sẽ tách nó ra để xuống dòng
                     if (typeof specContent === 'string') {
                         // Tách chuỗi dựa trên dấu gạch ngang " - " hoặc xuống dòng "\n"
                         const lines = specContent.split(/- /g).filter(line => line.trim() !== "");
                         
                         return lines.map((line, idx) => (
                             <p key={`${index}-${idx}`} style={{ marginBottom: '8px', lineHeight: '1.6' }}>
                                 <strong>• </strong> {line.trim()}
                             </p>
                         ));
                     }
                     
                     // Trường hợp dữ liệu đã đẹp sẵn (JSON object)
                     return (
                        <p key={index} style={{ marginBottom: '8px' }}>
                           <strong>{spec.label || spec.name}: </strong> {specContent}
                        </p>
                     );
                   })}
                 </div>
               ) : (
                 <p>Chưa có thông số chi tiết.</p>
               )}
             </div>
          )}  
        </div>
      </div>
      
    </div>
  );
};

export default memo(ProductDetail);