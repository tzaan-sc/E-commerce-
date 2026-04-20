import { toast } from 'react-toastify';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { useCart } from "../../../context/index";
import "./style.scss";
import {
  getCart,
  updateQuantity,
  removeItem,
  removeItems,
} from "api/cart";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

const ShoppingCart = () => {
  const navigate = useNavigate();

  // State
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchCartCount } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);

  // Biến tính toán
  const isAllSelected = cartItems.length > 0 && selectedItems.length === cartItems.length;
  const allItemIds = cartItems.map((item) => item.id);

  // --- 🔥 LOGIC TÍNH GIÁ CỦA 1 ITEM (BIẾN THỂ + KHUYẾN MÃI) ---
  const getItemPrice = (item) => {
    // 1. Lấy giá gốc từ Biến thể (Variant), nếu không có mới lấy giá SP chính
    const originalPrice = item.variant ? item.variant.price : (item.product?.price || 0);
    const promotion = item.product?.promotion;

    // 2. Tính giá sau giảm (Final Price)
    let finalPrice = originalPrice;
    if (promotion && promotion.status === "ACTIVE") {
      if (promotion.discountType === "PERCENTAGE") {
        finalPrice = originalPrice * (1 - promotion.discountValue / 100);
      } else if (promotion.discountType === "FIXED_AMOUNT") {
        finalPrice = originalPrice - promotion.discountValue;
      }
    }
    return finalPrice > 0 ? finalPrice : 0;
  };

  // --- 🔥 TÍNH TỔNG TIỀN DỰA TRÊN GIÁ ĐÃ GIẢM ---
  const selectedTotal = cartItems.reduce((sum, item) => {
    if (selectedItems.includes(item.id)) {
      return sum + item.quantity * getItemPrice(item);
    }
    return sum;
  }, 0);

  useEffect(() => { fetchCart(); }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await getCart();
      let items = Array.isArray(res.data) ? res.data : [];
      items.sort((a, b) => b.id - a.id);
      setCartItems(items);
      fetchCartCount();
    } catch (err) {
      console.error("Lỗi:", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price) + "đ";

  const handleSelectAll = () => { if (isAllSelected) setSelectedItems([]); else setSelectedItems(allItemIds); };
  const handleSelectItem = (itemId) => { setSelectedItems((prev) => prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]); };
  
  const handleUpdateQuantity = async (id, amount) => { 
      const item = cartItems.find((i) => i.id === id); if (!item) return;
      const newQuantity = item.quantity + amount;
      
      // Kiểm tra tồn kho của Biến thể khi update
      const stock = item.variant ? item.variant.stockQuantity : (item.product?.stockQuantity || 0);
      if (newQuantity > stock) {
        toast.warning("Số lượng vượt quá tồn kho hiện có!");
        return;
      }

      if (newQuantity < 1) { handleRemoveItem(id); return; }
      setLoading(true);
      try { await updateQuantity(id, newQuantity); await fetchCart(); } catch (err) {} finally { setLoading(false); }
  };

  const handleRemoveItem = async (id) => { if (!window.confirm("Xóa sản phẩm?")) return; try { await removeItem(id); await fetchCart(); fetchCartCount(); } catch (err) {} };
  const handleDeleteSelected = async () => { if (!selectedItems.length) return; if (!window.confirm("Xóa đã chọn?")) return; try { await removeItems(selectedItems); await fetchCart(); setSelectedItems([]); fetchCartCount(); } catch (err) {} };

  const handleCheckoutClick = () => {
    if (selectedItems.length === 0) {
      toast.info("Vui lòng chọn ít nhất một sản phẩm để mua hàng.");
      return;
    }
    const itemsToCheckout = cartItems.filter(item => selectedItems.includes(item.id));
    navigate("../thanh-toan", { 
        state: { 
            selectedIds: selectedItems,
            displayItems: itemsToCheckout,
            totalAmount: selectedTotal
        } 
    });
  };

  const getProductImage = (item) => {
    // Ưu tiên 1: Ảnh của Biến thể (Variant)
    if (item.variant && item.variant.image) {
        return `http://localhost:8080${item.variant.image}`;
    }
    // Ưu tiên 2: Ảnh của Sản phẩm chính
    if (item.product?.images && item.product.images.length > 0) {
        const url = item.product.images[0].urlImage || item.product.images[0]; 
        return `http://localhost:8080${url}`;
    }
    return "https://via.placeholder.com/100x100?text=No+Image";
  };

  if (loading && cartItems.length === 0) return <div>Đang tải...</div>;

  return (
    <div className="cart-container">
      {loading && <div className="cart-loading-overlay"></div>}
      <h2>🛒 Giỏ Hàng Của Bạn</h2>

      <div className="cart-header">
         <div className="cart-col select"><input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} disabled={cartItems.length === 0}/></div>
         <div className="cart-col product">Sản Phẩm</div><div className="cart-col price">Đơn Giá</div><div className="cart-col quantity">Số Lượng</div><div className="cart-col total">Số Tiền</div><div className="cart-col action">Thao Tác</div>
      </div>

      {cartItems.map((item) => {
        const finalUnitPrice = getItemPrice(item);
        const originalUnitPrice = item.variant ? item.variant.price : (item.product?.price || 0);
        const hasDiscount = finalUnitPrice < originalUnitPrice;

        return (
          <div className="cart-item" key={item.id}>
             <div className="cart-col select"><input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => handleSelectItem(item.id)}/></div>
             
             <div className="cart-col product">
                <img src={getProductImage(item)} alt={item.product?.name} />
                <div className="info">
                    <div className="name">{item.product?.name}</div>
                    {/* 🔥 HIỂN THỊ CẤU HÌNH BIẾN THỂ */}
                    {item.variant && (
                        <div className="variant-label" style={{fontSize: '12px', color: '#64748b'}}>
                            Cấu hình: {item.variant.ramCapacity} / {item.variant.storageCapacity}
                        </div>
                    )}
                </div>
             </div>

             <div className="cart-col price">
                {hasDiscount && (
                    <div style={{textDecoration: 'line-through', fontSize: '12px', color: '#94a3b8'}}>
                        {formatPrice(originalUnitPrice)}
                    </div>
                )}
                <div className={hasDiscount ? "red" : ""}>{formatPrice(finalUnitPrice)}</div>
             </div>

             <div className="cart-col quantity">
                <button onClick={() => handleUpdateQuantity(item.id, -1)}><AiOutlineMinus /></button>
                <span>{item.quantity}</span>
                <button onClick={() => handleUpdateQuantity(item.id, 1)}><AiOutlinePlus /></button>
             </div>

             <div className="cart-col total red">{formatPrice(finalUnitPrice * item.quantity)}</div>
             
             <div className="cart-col action"><button className="delete-btn" onClick={() => handleRemoveItem(item.id)}>Xóa</button></div>
          </div>
        );
      })}

      <div className="cart-footer">
        <div className="left">
           <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} disabled={cartItems.length === 0}/> Chọn Tất Cả ({selectedItems.length}) <span className="delete-all" onClick={handleDeleteSelected}>Xóa</span>
        </div>
        <div className="right">
          <span>
            Tổng thanh toán ({selectedItems.length} Sản phẩm):{" "}
            <strong className="red">{formatPrice(selectedTotal)}</strong>
          </span>
          <button className="buy-btn" onClick={handleCheckoutClick} disabled={selectedItems.length === 0}>
            Mua Hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;