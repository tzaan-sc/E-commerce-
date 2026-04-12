import { memo, useState, useEffect } from "react";
import { AiOutlineShoppingCart, AiOutlineShareAlt } from "react-icons/ai";
import { useNavigate } from "react-router-dom"; 
import { useCart } from "../../../context/index"; 
import { addToCart } from "api/cart"; 
import { ROUTERS } from "utils/router";
import "./style.scss";

// 👇 1. Nhận thêm props từ cha (ProductDetailPage)
const ProductDetail = ({ product, variants, selectedVariant, setSelectedVariant }) => {
  const navigate = useNavigate(); 
  const { fetchCartCount } = useCart(); 

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isAdding, setIsAdding] = useState(false); 

  // 👇 2. Xác định các thông số hiển thị (Ưu tiên biến thể nếu có)
  const displayPrice = selectedVariant ? selectedVariant.price : product?.price;
  const displayStock = selectedVariant ? selectedVariant.stockQuantity : product?.stockQuantity;
  const displaySku = selectedVariant ? selectedVariant.sku : (product?.slug || "N/A");

  // Reset số lượng về 1 khi đổi biến thể
  useEffect(() => {
    setQuantity(1);
  }, [selectedVariant]);

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const handleQuantityChange = (delta) => {
    // Kiểm tra tồn kho dựa trên biến thể đang chọn
    if (displayStock <= 0) return;
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= displayStock) {
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

    // Kiểm tra nếu sản phẩm có biến thể mà chưa chọn (trường hợp hy hữu)
    if (variants && variants.length > 0 && !selectedVariant) {
        alert("Vui lòng chọn cấu hình sản phẩm!");
        return null;
    }

    setIsAdding(true);
    try {
        // 👇 3. Gửi thêm variantId vào hàm API
        // Lưu ý: Bạn cần chắc chắn hàm addToCart trong 'api/cart' đã hỗ trợ tham số thứ 3
        const variantId = selectedVariant ? selectedVariant.id : null;
        const response = await addToCart(product.id, quantity, variantId);
        
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

      <div className="meta-info" style={{marginBottom: '10px', fontSize: '14px', color: '#666'}}>
          <span>SKU: <strong>{displaySku}</strong></span>
          <span style={{margin: '0 10px'}}>|</span>
          <span style={{color: displayStock > 0 ? 'green' : 'red'}}>
              {displayStock > 0 ? "Còn hàng" : "Hết hàng"}
          </span>
      </div>

      <div className="price-section">
        <div className="current-price" style={{color: '#d70018', fontSize: '24px', fontWeight: 'bold'}}>
            {formatPrice(displayPrice)}
        </div>
      </div>

      {/* 👇 4. KHU VỰC CHỌN BIẾN THỂ (VARIANTS) */}
      {variants && variants.length > 0 && (
        <div className="variants-section" style={{ margin: '20px 0' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Chọn cấu hình:</p>
            <div className="variants-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {variants.map((v) => (
                    <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`btn-variant ${selectedVariant?.id === v.id ? 'active' : ''}`}
                        style={{
                            border: selectedVariant?.id === v.id ? '2px solid #d70018' : '1px solid #ddd',
                            backgroundColor: selectedVariant?.id === v.id ? '#fff0f1' : '#fff',
                            color: selectedVariant?.id === v.id ? '#d70018' : '#333',
                            padding: '8px 15px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            textAlign: 'left',
                            minWidth: '120px',
                            position: 'relative' // Để hiển thị dấu check nếu cần
                        }}
                    >
                        <div style={{fontWeight: 'bold', fontSize: '13px'}}>
                            {v.ramCapacity} - {v.storageCapacity}
                        </div>
                        <div style={{fontSize: '12px'}}>{v.color}</div>
                        <div style={{fontSize: '12px', marginTop: '2px'}}>{formatPrice(v.price)}</div>
                    </button>
                ))}
            </div>
        </div>
      )}

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
            disabled={quantity >= displayStock}
          >+</button>
        </div>
        <span className="stock-info">
             {displayStock > 0 
                ? `(Sẵn có ${displayStock} sp)` 
                : <span style={{color: 'red'}}>(Tạm hết hàng)</span>}
        </span>
      </div>

      <div className="action-buttons">
        <button 
            className="btn btn-primary"
            onClick={handleAddToCart}
            disabled={displayStock <= 0 || isAdding}
            style={{ opacity: (displayStock <= 0 || isAdding) ? 0.7 : 1 }}
        >
          <AiOutlineShoppingCart size={20} /> 
          {isAdding ? "Đang xử lý..." : "Thêm vào giỏ"}
        </button>
        
        <button 
            className="btn btn-secondary"
            onClick={handleBuyNow}
            disabled={displayStock <= 0 || isAdding}
            style={{ opacity: (displayStock <= 0 || isAdding) ? 0.7 : 1 }}
        >
            Mua ngay
        </button>
        
        <button className="btn btn-secondary icon-btn"><AiOutlineShareAlt size={20} /></button>
      </div>

      {/* --- PHẦN TABS --- */}
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
              <div 
                 style={{ whiteSpace: "pre-line" }}
                 dangerouslySetInnerHTML={{ __html: product.description || "Đang cập nhật mô tả..." }} 
              />
            </div>
          )}

          {activeTab === 'specs' && (
             <div className="specs-text-block">
               {(() => {
                 const spec = product.specification;
                 const displaySpecs = [];

                 if (spec) {
                    // 👇 Cập nhật thông số từ Biến thể nếu có
                    const ramVal = selectedVariant ? selectedVariant.ramCapacity : "Tùy chọn";
                    const storageVal = selectedVariant ? selectedVariant.storageCapacity : spec.storageType;
                    
                    if (spec.cpu) displaySpecs.push({ label: "Vi xử lý (CPU)", value: spec.cpu });
                    displaySpecs.push({ label: "RAM", value: ramVal }); // Ưu tiên RAM biến thể
                    displaySpecs.push({ label: "Ổ cứng", value: storageVal }); // Ưu tiên Ổ cứng biến thể
                    
                    if (spec.vga) displaySpecs.push({ label: "Card đồ họa (VGA)", value: spec.vga });
                    if (spec.screenDetail) displaySpecs.push({ label: "Màn hình", value: spec.screenDetail });
                    if (spec.resolution) displaySpecs.push({ label: "Độ phân giải", value: spec.resolution });
                    
                    // Logic cũ của bạn để parse các thông số khác
                    if (spec.otherSpecs) {
                        const text = spec.otherSpecs;
                        const targetKeywords = [ "Hệ điều hành", "Cổng giao tiếp", "Trọng lượng", "Kích thước", "Pin" ];
                        let matches = [];
                        targetKeywords.forEach(kw => {
                            const index = text.indexOf(kw);
                            if (index !== -1) matches.push({ label: kw, index: index });
                        });
                        matches.sort((a, b) => a.index - b.index);

                        matches.forEach((match, i) => {
                            const startValue = match.index + match.label.length;
                            const endValue = (i + 1 < matches.length) ? matches[i + 1].index : text.length;
                            let value = text.substring(startValue, endValue).trim();
                            value = value.replace(/^[:\-\s]+/, "").replace(/[\-\s]+$/, "");
                            if (value) displaySpecs.push({ label: match.label, value: value });
                        });
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
