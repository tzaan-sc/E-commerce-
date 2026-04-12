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

  // --- TÍNH TỔNG TIỀN ---
  const selectedTotal = cartItems.reduce((sum, item) => {
    if (selectedItems.includes(item.id)) {
      return sum + item.quantity * (item.product?.price || 0);
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

  // ... (Giữ nguyên các hàm handleSelect, handleUpdateQuantity, handleRemoveItem, handleDeleteSelected cũ) ...
  const handleSelectAll = () => { if (isAllSelected) setSelectedItems([]); else setSelectedItems(allItemIds); };
  const handleSelectItem = (itemId) => { setSelectedItems((prev) => prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]); };
  const handleUpdateQuantity = async (id, amount) => { 
      const item = cartItems.find((i) => i.id === id); if (!item) return;
      const newQuantity = item.quantity + amount;
      if (newQuantity < 1) { handleRemoveItem(id); return; }
      setLoading(true);
      try { await updateQuantity(id, newQuantity); await fetchCart(); } catch (err) {} finally { setLoading(false); }
  };
  const handleRemoveItem = async (id) => { if (!window.confirm("Xóa sản phẩm?")) return; try { await removeItem(id); await fetchCart(); fetchCartCount(); } catch (err) {} };
  const handleDeleteSelected = async () => { if (!selectedItems.length) return; if (!window.confirm("Xóa đã chọn?")) return; try { await removeItems(selectedItems); await fetchCart(); setSelectedItems([]); fetchCartCount(); } catch (err) {} };


  // --- SỬA LOGIC NÚT MUA HÀNG: CHUYỂN TRANG ---
  const handleCheckoutClick = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để mua hàng.");
      return;
    }

    // Lọc ra danh sách chi tiết các món đã chọn để gửi sang trang kia
    const itemsToCheckout = cartItems.filter(item => selectedItems.includes(item.id));

    // Chuyển hướng sang trang /checkout và gửi kèm dữ liệu
    navigate("../thanh-toan", { 
        state: { 
            selectedIds: selectedItems,
            displayItems: itemsToCheckout,
            totalAmount: selectedTotal
        } 
    });
  };
  const getProductImage = (product) => {
    if (!product) return "https://via.placeholder.com/100x100?text=No+Product";

    // Ưu tiên 1: Lấy ảnh từ list images (Entity ImageProduct)
    if (product.images && product.images.length > 0) {
        const firstImg = product.images[0];
        // Kiểm tra xem backend trả về object hay string
        const url = firstImg.urlImage || firstImg; 
        return `http://localhost:8080${url}`;
    }

    // Ưu tiên 2: Lấy từ trường imageUrl cũ (nếu còn dùng)
    if (product.imageUrl) {
        return `http://localhost:8080${product.imageUrl}`;
    }

    // Cuối cùng: Ảnh placeholder
    return "https://via.placeholder.com/100x100?text=No+Image";
  };

  if (loading && cartItems.length === 0) return <div>Đang tải...</div>;

  return (
    <div className="cart-container">
      {loading && <div className="cart-loading-overlay"></div>}
      <h2>🛒 Giỏ Hàng Của Bạn</h2>

      {/* ... Phần hiển thị danh sách giỏ hàng (Giữ nguyên code cũ) ... */}
      <div className="cart-header">
         {/* ... Header columns ... */}
         <div className="cart-col select"><input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} disabled={cartItems.length === 0}/></div>
         <div className="cart-col product">Sản Phẩm</div><div className="cart-col price">Đơn Giá</div><div className="cart-col quantity">Số Lượng</div><div className="cart-col total">Số Tiền</div><div className="cart-col action">Thao Tác</div>
      </div>

      {cartItems.map((item) => (
          <div className="cart-item" key={item.id}>
             {/* ... Item render content (Giữ nguyên code cũ) ... */}
             <div className="cart-col select"><input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => handleSelectItem(item.id)}/></div>
             <div className="cart-col product"><img src={getProductImage(item.product)} alt={item.product?.name} /><div className="info"><div className="name">{item.product?.name}</div></div></div>
             <div className="cart-col price">{formatPrice(item.product?.price || 0)}</div>
             <div className="cart-col quantity">
                <button onClick={() => handleUpdateQuantity(item.id, -1)}><AiOutlineMinus /></button><span>{item.quantity}</span><button onClick={() => handleUpdateQuantity(item.id, 1)}><AiOutlinePlus /></button>
             </div>
             <div className="cart-col total red">{formatPrice((item.product?.price || 0) * item.quantity)}</div>
             <div className="cart-col action"><button className="delete-btn" onClick={() => handleRemoveItem(item.id)}>Xóa</button></div>
          </div>
      ))}

      <div className="cart-footer">
        <div className="left">
           {/* ... Footer left ... */}
           <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} disabled={cartItems.length === 0}/> Chọn Tất Cả ({selectedItems.length}) <span className="delete-all" onClick={handleDeleteSelected}>Xóa</span>
        </div>
        <div className="right">
          <span>
            Tổng thanh toán ({selectedItems.length} Sản phẩm):{" "}
            <strong className="red">{formatPrice(selectedTotal)}</strong>
          </span>
          <button
            className="buy-btn"
            onClick={handleCheckoutClick} // <-- Gọi hàm chuyển trang
            disabled={selectedItems.length === 0}
          >
            Mua Hàng
          </button>
        </div>
      </div>
      
      {/* ❌ ĐÃ XÓA CODE HIỂN THỊ POPUP CHECKOUTFORM Ở ĐÂY */}
    </div>
  );
};

export default ShoppingCart;
