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

  const handleQuantityChange = (delta) => {
    if (!product || product.stockQuantity <= 0) return;
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stockQuantity) {
       setQuantity(newQuantity);
    }
  };

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
               {(() => {
                 const spec = product.specification;
                 const displaySpecs = [];

                 if (spec) {
                    // Thêm các trường cơ bản từ Entity
                    if (spec.cpu) displaySpecs.push({ label: "Vi xử lý (CPU)", value: spec.cpu });
                    if (spec.vga) displaySpecs.push({ label: "Card đồ họa (VGA)", value: spec.vga });
                    if (spec.screenDetail) displaySpecs.push({ label: "Màn hình", value: spec.screenDetail });
                    if (spec.resolution) displaySpecs.push({ label: "Độ phân giải", value: spec.resolution });
                    if (spec.storageType) displaySpecs.push({ label: "Loại ổ cứng", value: spec.storageType });
                    
                    // Logic tách tìm thông số từ trường otherSpecs
                    if (spec.otherSpecs) {
                        const text = spec.otherSpecs;
                        // Danh sách từ khóa cần tìm
                        const targetKeywords = [
                            "Loại card đồ họa",
                            "Hệ điều hành",
                            "Loại CPU",
                            "Cổng giao tiếp",
                            "Dung lượng RAM",
                            "Trọng lượng",
                            "Kích thước"
                        ];

                        // Tìm tất cả vị trí của từ khóa có trong văn bản
                        let matches = [];
                        targetKeywords.forEach(kw => {
                            const index = text.indexOf(kw);
                            if (index !== -1) {
                                matches.push({ label: kw, index: index });
                            }
                        });

                        // Sắp xếp các từ khóa theo thứ tự xuất hiện trong văn bản
                        matches.sort((a, b) => a.index - b.index);

                        // Cắt văn bản để lấy giá trị cho từng nhãn
                        matches.forEach((match, i) => {
                            const startValue = match.index + match.label.length;
                            const endValue = (i + 1 < matches.length) ? matches[i + 1].index : text.length;
                            
                            let value = text.substring(startValue, endValue).trim();
                            
                            // Dọn dẹp dấu ":" hoặc dấu "-" ở đầu giá trị nếu có
                            value = value.replace(/^[:\-\s]+/, "").replace(/[\-\s]+$/, "");

                            if (value) {
                                displaySpecs.push({ label: match.label, value: value });
                            }
                        });

                        // Nếu không tìm thấy từ khóa nào đặc biệt, tách theo dấu "-" như cũ
                        if (matches.length === 0) {
                            text.split('-').filter(i => i.trim() !== "").forEach((item, idx) => {
                                const parts = item.split(':');
                                displaySpecs.push({
                                    label: parts.length > 1 ? parts[0].trim() : "Thông số khác",
                                    value: parts.length > 1 ? parts.slice(1).join(':').trim() : parts[0].trim()
                                });
                            });
                        }
                    }
                 }

                 if (displaySpecs.length === 0) {
                    return <p style={{ padding: '20px', color: '#666' }}>Chưa có thông số chi tiết.</p>;
                 }

                 return (
                   <div className="specs-table-wrapper" style={{ marginTop: '10px' }}>
                     <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                       <tbody>
                         {displaySpecs.map((item, index) => (
                           <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                             <td style={{ padding: '12px', border: '1px solid #eee', color: '#666', width: '35%', fontWeight: '500' }}>
                                {item.label}
                             </td>
                             <td style={{ padding: '12px', border: '1px solid #eee', color: '#333' }}>
                                {item.value}
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                 );
               })()}
             </div>
          )}  
        </div>
      </div>
    </div>
  );
};

export default memo(ProductDetail);