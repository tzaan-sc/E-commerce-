import { memo, useState } from "react";
import { AiOutlineShoppingCart, AiOutlineShareAlt } from "react-icons/ai";
import "./style.scss";

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const product = {
    name: 'MacBook Pro 16" M3 Max',
    price: 59990000,
    // Đã xóa originalPrice (giá khuyến mãi)
    description: {
        title: "Dell XPS 15 9530 - Laptop cao cấp cho chuyên gia",
        content: [
            "Dell XPS 15 9530 là chiếc laptop cao cấp được thiết kế dành cho các chuyên gia sáng tạo và những người dùng yêu cầu hiệu năng mạnh mẽ. Với màn hình InfinityEdge viền mỏng ấn tượng, bộ vi xử lý Intel Core thế hệ 13 và card đồ họa NVIDIA RTX 4050, XPS 15 đáp ứng mọi nhu cầu từ công việc văn phòng đến render đồ họa chuyên nghiệp.",
            "Thiết kế cao cấp với vỏ nhôm nguyên khối, bàn phím có đèn nền và touchpad lớn mang đến trải nghiệm sử dụng tuyệt vời. Pin 86Wh cho thời gian sử dụng lên đến 10 giờ, hoàn hảo cho công việc di động."
        ]
    },
    specs: [
      { label: 'CPU', value: 'Apple M3 Max 16-core' },
      { label: 'RAM', value: '32GB Unified Memory' },
      { label: 'Màn hình', value: '16.2" Liquid Retina XDR' },
      { label: 'Card đồ họa', value: '40-core GPU' },
      { label: 'Pin', value: 'Lên đến 22 giờ' },
      { label: 'Trọng lượng', value: '2.16 kg' }
    ]
  };

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) setQuantity(newQuantity);
  };

  return (
    <div className="info-section">
      <h1 className="product-title">{product.name}</h1>

      {/* Chỉ hiện 1 giá duy nhất */}
      <div className="price-section">
        <div className="current-price">{formatPrice(product.price)}</div>
      </div>

      <div className="quantity-section">
        <span className="quantity-label">Số lượng:</span>
        <div className="quantity-control">
          <button className="quantity-btn" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>−</button>
          <div className="quantity-value">{quantity}</div>
          <button className="quantity-btn" onClick={() => handleQuantityChange(1)} disabled={quantity >= 10}>+</button>
        </div>
      </div>

      <div className="action-buttons">
        <button className="btn btn-primary">
          <AiOutlineShoppingCart size={20} /> Thêm vào giỏ
        </button>
        <button className="btn btn-secondary">Mua ngay</button>
        <button className="btn btn-secondary icon-btn"><AiOutlineShareAlt size={20} /></button>
      </div>

      {/* --- TAB MÔ TẢ & THÔNG SỐ --- */}
      <div className="product-tabs-container">
        {/* Header Tabs */}
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
                Thông số chi tiết
            </div>
        </div>

        {/* Nội dung Tabs */}
        <div className="tabs-content-area">
            
            {/* Tab 1: Mô tả */}
            {activeTab === 'description' && (
                <div className="description-box">
                    <h3>{product.description.title}</h3>
                    {product.description.content.map((para, idx) => (
                        <p key={idx}>{para}</p>
                    ))}
                </div>
            )}

            {/* Tab 2: Thông số (Dạng danh sách dọc nhỏ gọn) */}
            {activeTab === 'specs' && (
                 <div className="specs-grid">
                    {product.specs.map((spec, index) => (
                    <div key={index} className="spec-row">
                        <div className="spec-label">{spec.label}</div>
                        <div className="spec-value">{spec.value}</div>
                    </div>
                    ))}
                </div>
            )}
        </div>
      </div>
      
    </div>
  );
};

export default memo(ProductDetail);