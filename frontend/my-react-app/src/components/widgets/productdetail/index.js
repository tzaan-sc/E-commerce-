import { toast } from 'react-toastify';
import { memo, useState, useEffect } from "react";
import { AiOutlineShoppingCart, AiOutlineShareAlt } from "react-icons/ai";
import { useNavigate } from "react-router-dom"; 
import { useCart } from "../../../context/index"; 
import { addToCart } from "api/cart"; 
import { ROUTERS } from "utils/router";
import "./style.scss";

const ProductDetail = ({ product, variants, selectedVariant, setSelectedVariant }) => {
  const navigate = useNavigate(); 
  const { fetchCartCount } = useCart(); 

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isAdding, setIsAdding] = useState(false); 

  // --- 1. LOGIC XỬ LÝ KHUYẾN MÃI ---
  const promotion = product?.promotion;
  const originalPrice = selectedVariant ? selectedVariant.price : product?.price;
  let finalPrice = originalPrice;
  let discountDisplay = null;

  if (promotion && promotion.status === "ACTIVE") {
    if (promotion.discountType === "PERCENTAGE") {
      finalPrice = originalPrice * (1 - promotion.discountValue / 100);
      discountDisplay = `-${promotion.discountValue}%`;
    } else if (promotion.discountType === "FIXED_AMOUNT") {
      finalPrice = originalPrice - promotion.discountValue;
      discountDisplay = `-${new Intl.NumberFormat('vi-VN').format(promotion.discountValue)}đ`;
    }
  }

  const displayStock = selectedVariant ? selectedVariant.stockQuantity : product?.stockQuantity;
  const displaySku = selectedVariant ? selectedVariant.sku : (product?.slug || "N/A");

  useEffect(() => {
    setQuantity(1);
  }, [selectedVariant]);

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const handleQuantityChange = (delta) => {
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

    if (variants && variants.length > 0 && !selectedVariant) {
        toast.info("Vui lòng chọn cấu hình sản phẩm!");
        return null;
    }

    setIsAdding(true);
    try {
        const variantId = selectedVariant ? selectedVariant.id : null;
        const response = await addToCart(product.id, quantity, variantId);
        fetchCartCount(); 
        return response.data; 
    } catch (error) {
        console.error("Lỗi thêm giỏ hàng:", error);
        toast.info("Có lỗi xảy ra khi thêm vào giỏ hàng!");
        return null;
    } finally {
        setIsAdding(false);
    }
  };

  const handleAddToCart = async () => {
      const cartItem = await processAddToCart();
      if (cartItem) {
          toast.success("Đã thêm sản phẩm vào giỏ hàng thành công!");
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

      <div className="meta-info" style={{marginBottom: '15px', fontSize: '13px', color: '#666', display: 'flex', gap: '15px'}}>
          <span>Mã: <strong>{displaySku}</strong></span>
          <span>Tình trạng: <strong style={{color: displayStock > 0 ? '#10b981' : '#ef4444'}}>{displayStock > 0 ? "Còn hàng" : "Hết hàng"}</strong></span>
      </div>

      {/* ✅ CHỈNH GIÁ & KHUYẾN MÃI TRÊN 1 DÒNG HÀNG, ĐẸP VÀ GỌN */}
      <div className="price-container" style={{ 
        background: '#f8fafc', 
        padding: '16px 20px', 
        borderRadius: '12px', 
        marginBottom: '20px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
          {/* Giá thực tế (To nhất) */}
          <span style={{ color: '#d70018', fontSize: '30px', fontWeight: '800' }}>
            {formatPrice(finalPrice)}
          </span>
          
          {discountDisplay && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Giá gốc gạch ngang */}
              <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '16px' }}>
                {formatPrice(originalPrice)}
              </span>
              {/* Tag giảm giá đỏ */}
              <span style={{ 
                background: '#d70018', 
                color: '#fff', 
                padding: '2px 8px', 
                borderRadius: '6px', 
                fontSize: '13px', 
                fontWeight: '700' 
              }}>
                {discountDisplay}
              </span>
            </div>
          )}
        </div>

        {/* Box quà tặng khuyến mãi tối giản */}
        {promotion && promotion.status === "ACTIVE" && (
          <div style={{ 
            marginTop: '5px',
            padding: '8px 12px',
            border: '1px dashed #d70018',
            borderRadius: '8px',
            backgroundColor: '#fff',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{fontSize: '16px'}}>🎁</span>
            <span style={{fontWeight: '700', color: '#c53030'}}>{promotion.name}</span>
            {promotion.description && <span style={{color: '#64748b'}}>: {promotion.description}</span>}
          </div>
        )}
      </div>

      {variants && variants.length > 0 && (
        <div className="variants-section" style={{ margin: '20px 0' }}>
            <p style={{ fontWeight: '700', marginBottom: '12px', fontSize: '15px' }}>Chọn cấu hình:</p>
            <div className="variants-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {variants.map((v) => (
                    <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        style={{
                            border: selectedVariant?.id === v.id ? '2px solid #d70018' : '1px solid #e2e8f0',
                            backgroundColor: '#fff',
                            color: selectedVariant?.id === v.id ? '#d70018' : '#1e293b',
                            padding: '12px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            textAlign: 'left',
                            minWidth: '150px',
                            transition: 'all 0.2s',
                            boxShadow: selectedVariant?.id === v.id ? '0 4px 12px rgba(215,0,24,0.1)' : 'none'
                        }}
                    >
                        <div style={{fontWeight: '700', fontSize: '14px'}}>
                            {v.ramCapacity || v.ramSize} - {v.storageCapacity || v.storageDisplay}
                        </div>
                        <div style={{fontSize: '12px', color: '#64748b', marginTop: '2px'}}>{v.color || v.colorName}</div>
                        <div style={{fontSize: '14px', marginTop: '6px', fontWeight: '700'}}>{formatPrice(v.price)}</div>
                    </button>
                ))}
            </div>
        </div>
      )}

      <div className="quantity-section" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px' }}>
        <div className="quantity-control" style={{ display: 'flex', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
          <button className="quantity-btn" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} style={{ padding: '8px 15px', background: '#f8fafc', border: 'none', cursor: 'pointer' }}>−</button>
          <div className="quantity-value" style={{ padding: '8px 20px', fontWeight: '700', minWidth: '40px', textAlign: 'center' }}>{quantity}</div>
          <button className="quantity-btn" onClick={() => handleQuantityChange(1)} disabled={quantity >= displayStock} style={{ padding: '8px 15px', background: '#f8fafc', border: 'none', cursor: 'pointer' }}>+</button>
        </div>
        <span style={{ fontSize: '13px', color: '#64748b' }}>
             {displayStock > 0 ? `Còn ${displayStock} sản phẩm` : <span style={{color: '#ef4444'}}>Hết hàng</span>}
        </span>
      </div>

      <div className="action-buttons" style={{display: 'flex', gap: '12px'}}>
        <button 
            className="btn btn-primary"
            onClick={handleAddToCart}
            disabled={displayStock <= 0 || isAdding}
            style={{ 
                flex: 1, height: '54px', borderRadius: '12px', fontWeight: '700', fontSize: '15px',
                background: '#fff', border: '2px solid #d70018', color: '#d70018', cursor: 'pointer'
            }}
        >
          <AiOutlineShoppingCart size={22} style={{marginRight: '8px', verticalAlign: 'middle'}} /> 
          THÊM VÀO GIỎ
        </button>
        
        <button 
            className="btn btn-danger"
            onClick={handleBuyNow}
            disabled={displayStock <= 0 || isAdding}
            style={{ 
                flex: 1, height: '54px', background: 'linear-gradient(135deg, #ff4d4f 0%, #d70018 100%)', 
                color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer'
            }}
        >
            MUA NGAY
        </button>
        <button className="btn icon-btn" style={{ width: '54px', height: '54px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}><AiOutlineShareAlt size={22} /></button>
      </div>

      <div className="product-tabs-container" style={{marginTop: '40px', borderTop: '1px solid #f1f5f9'}}>
        <div className="tabs-header" style={{display: 'flex', gap: '30px'}}>
          <div className={`tab-item ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')} style={{padding: '20px 0', cursor: 'pointer', fontWeight: '700', fontSize: '16px', color: activeTab === 'description' ? '#d70018' : '#64748b', borderBottom: activeTab === 'description' ? '3px solid #d70018' : '3px solid transparent', transition: '0.3s' }}>
            Mô tả sản phẩm
          </div>
          <div className={`tab-item ${activeTab === 'specs' ? 'active' : ''}`} onClick={() => setActiveTab('specs')} style={{padding: '20px 0', cursor: 'pointer', fontWeight: '700', fontSize: '16px', color: activeTab === 'specs' ? '#d70018' : '#64748b', borderBottom: activeTab === 'specs' ? '3px solid #d70018' : '3px solid transparent', transition: '0.3s' }}>
            Thông số kỹ thuật
          </div>
        </div>

        <div className="tabs-content-area" style={{ paddingTop: '20px' }}>
          {activeTab === 'description' && (
            <div className="description-box" style={{ lineHeight: '1.8', color: '#334155' }}>
              <div style={{ whiteSpace: "pre-line" }} dangerouslySetInnerHTML={{ __html: product.description || "Nội dung đang cập nhật..." }} />
            </div>
          )}

          {activeTab === 'specs' && (
             <div className="specs-table-wrapper">
               {(() => {
                 const spec = product.specification;
                 const displaySpecs = [];
                 if (spec || selectedVariant) {
                    if (spec?.cpu) displaySpecs.push({ label: "Vi xử lý (CPU)", value: spec.cpu });
                    const ramVal = selectedVariant ? (selectedVariant.ramCapacity || selectedVariant.ramSize) : "Tùy chọn cấu hình";
                    const storageVal = selectedVariant ? (selectedVariant.storageCapacity || selectedVariant.storageDisplay) : (spec?.storageType || "Tùy chọn cấu hình");
                    displaySpecs.push({ label: "Bộ nhớ RAM", value: ramVal }, { label: "Ổ cứng (SSD)", value: storageVal });
                    if (spec?.resolution) displaySpecs.push({ label: "Độ phân giải", value: spec.resolution });
                    if (spec?.refreshRate) displaySpecs.push({ label: "Tần số quét", value: spec.refreshRate });
                    if (spec?.panelType) displaySpecs.push({ label: "Tấm nền", value: spec.panelType });
                    if (spec?.battery || spec?.batteryCapacity) displaySpecs.push({ label: "Pin", value: spec.battery || spec.batteryCapacity });
                    if (spec?.weight) displaySpecs.push({ label: "Trọng lượng", value: spec.weight });
                    if (spec?.os) displaySpecs.push({ label: "Hệ điều hành", value: spec.os });
                    if (spec?.wifi) displaySpecs.push({ label: "WiFi", value: spec.wifi });
                    if (spec?.ports) displaySpecs.push({ label: "Cổng kết nối", value: spec.ports });
                 }
                 return displaySpecs.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '12px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                       <tbody>
                         {displaySpecs.map((item, index) => (
                           <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f8fafc' : '#fff' }}>
                             <td style={{ padding: '15px 20px', color: '#64748b', width: '30%', fontWeight: '600', fontSize: '14px' }}>{item.label}</td>
                             <td style={{ padding: '15px 20px', color: '#1e293b', fontWeight: '500', fontSize: '14px' }}>{item.value}</td>
                           </tr>
                         ))}
                       </tbody>
                    </table>
                 ) : <p>Chưa có thông số chi tiết.</p>;
               })()}
             </div>
          )}  
        </div>
      </div>
    </div>
  );
};

export default memo(ProductDetail);