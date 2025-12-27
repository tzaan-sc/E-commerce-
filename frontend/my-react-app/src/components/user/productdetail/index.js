import { memo, useState } from "react";
import { AiOutlineShoppingCart, AiOutlineShareAlt } from "react-icons/ai";
import { useNavigate } from "react-router-dom"; 
import { useCart } from "../../../context/index"; 
import { addToCart } from "api/cart"; 
import { ROUTERS } from "utils/router";
import "./style.scss";

const ProductDetail = ({ product }) => {
  const navigate = useNavigate(); 
  const { fetchCartCount } = useCart(); 

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

  // Logic thêm giỏ hàng
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

          {/* 👇 ĐÂY LÀ PHẦN ĐÃ SỬA LOGIC HIỂN THỊ THÔNG SỐ */}
          {activeTab === 'specs' && (
             <div className="specs-text-block">
               {(() => {
                 // 1. Lấy dữ liệu từ specifications (tên trong DB) hoặc specs (tên cũ)
                 const specsData = product.specifications || product.specs;

                 // 2. Nếu không có dữ liệu
                 if (!specsData) return <p>Chưa có thông số chi tiết.</p>;

                 // 3. Nếu dữ liệu là Chuỗi (String) -> Cắt theo dấu gạch ngang "-"
                 if (typeof specsData === 'string') {
                   const list = specsData.split('-').filter(item => item.trim() !== "");
                   
                   return (
                     <div className="specs-list" style={{ paddingLeft: '10px' }}>
                       {list.map((item, index) => (
                         <p key={index} style={{ marginBottom: '8px', lineHeight: '1.6', borderBottom: '1px dashed #eee', paddingBottom: '5px' }}>
                            {/* Replace xuống dòng thừa nếu có để text liền mạch */}
                            <strong>• {item.trim().replace(/\n/g, " ")}</strong> 
                         </p>
                       ))}
                     </div>
                   );
                 }

                 // 4. (Dự phòng) Nếu dữ liệu là Array cũ
                 if (Array.isArray(specsData)) {
                    return (
                      <div className="specs-list">
                        {specsData.map((item, index) => (
                          <p key={index}>• {item.value || item}</p>
                        ))}
                      </div>
                    );
                 }

                 return <p>Định dạng thông số không hỗ trợ.</p>;
               })()}
             </div>
          )}  
        </div>
      </div>
      
    </div>
  );
};

export default memo(ProductDetail);