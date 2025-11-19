import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { useCart } from "../../../context/index";
import "./style.scss";
// Sửa import: Dùng hàm checkoutSelected
import {
  getCart,
  checkoutSelected, // <-- ĐÃ SỬA
  updateQuantity,
  removeItem,
  removeItems,
} from "api/cart";
// Thêm icon
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

const ShoppingCart = () => {
  const navigate = useNavigate(); // <-- 2. KHỞI TẠO NAVIGATE

  // State thật từ API
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchCartCount } = useCart();
  // State cho các mục đã chọn
  const [selectedItems, setSelectedItems] = useState([]);

  // Biến tính toán
  const isAllSelected =
    cartItems.length > 0 && selectedItems.length === cartItems.length;
  const allItemIds = cartItems.map((item) => item.id);

  // (Các hàm fetch, select, update, remove... giữ nguyên)
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await getCart();
      let items = Array.isArray(res.data) ? res.data : [];
      items.sort((a, b) => b.id - a.id);
      setCartItems(items);
      fetchCartCount();
    } catch (err) {
      console.error("Lấy giỏ hàng thất bại:", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN").format(price) + "đ";

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(allItemIds);
    }
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleUpdateQuantity = async (id, amount) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;
    const newQuantity = item.quantity + amount;

    if (newQuantity < 1) {
      handleRemoveItem(id);
      return;
    }

    setLoading(true);
    try {
      await updateQuantity(id, newQuantity);
      await fetchCart();
    } catch (err) {
      console.error("Lỗi cập nhật số lượng:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    setLoading(true);
    try {
      await removeItem(id);
      await fetchCart();
      fetchCartCount();
    } catch (err) {
      console.error("Lỗi xóa sản phẩm:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;
    if (
      !window.confirm(
        `Bạn có chắc muốn xóa ${selectedItems.length} sản phẩm đã chọn?`
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      await removeItems(selectedItems);
      await fetchCart();
      setSelectedItems([]);
      fetchCartCount();
    } catch (err) {
      console.error("Lỗi xóa sản phẩm đã chọn:", err);
      alert("Đã xảy ra lỗi khi xóa sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  // --- HÀM CHECKOUT (ĐÃ THÊM CHUYỂN TRANG) ---
  const handleCheckout = async () => {
    // Kiểm tra xem đã chọn gì chưa
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để mua hàng.");
      return;
    }

    setLoading(true);
    try {
      // Gọi API mới và gửi mảng ID đã chọn
      const res = await checkoutSelected(selectedItems);
      alert(
        `Đơn hàng ${res.data.id} tạo thành công, tổng: ${formatPrice(
          res.data.totalAmount
        )}`
      );
      fetchCartCount();
      
      // 3. TỰ ĐỘNG CHUYỂN HƯỚNG
      navigate("/customer/home/don-mua"); // (Hoặc đường dẫn đến trang đơn mua của bạn)

    } catch (err) {
      console.error("Checkout thất bại:", err);
      alert("Checkout thất bại!");
      setLoading(false); // Chỉ tắt loading nếu thất bại
    }
    // Không cần setLoading(false) ở đây vì đã chuyển trang
  };

  // --- TÍNH TỔNG TIỀN CÁC MỤC ĐÃ CHỌN ---
  const selectedTotal = cartItems.reduce(
    (sum, item) => {
      if (selectedItems.includes(item.id)) {
        return sum + item.quantity * (item.product?.price || 0);
      }
      return sum;
    }, 0
  );

  // (Code loading)
  if (loading && cartItems.length === 0) {
    return (
      <div className="cart-container">
        <h2>🛒 Giỏ Hàng Của Bạn</h2>
        <div>Đang tải giỏ hàng...</div>
      </div>
    );
  }

  // --- JSX (Đã đúng) ---
  return (
    <div className="cart-container">
      {loading && <div className="cart-loading-overlay"></div>}
      <h2>🛒 Giỏ Hàng Của Bạn</h2>

      <div className="cart-header">
        <div className="cart-col select">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={handleSelectAll}
            disabled={cartItems.length === 0}
          />
        </div>
        <div className="cart-col product">Sản Phẩm</div>
        <div className="cart-col price">Đơn Giá</div>
        <div className="cart-col quantity">Số Lượng</div>
        <div className="cart-col total">Số Tiền</div>
        <div className="cart-col action">Thao Tác</div>
      </div>

      {cartItems.length === 0 && !loading ? (
        <div className="cart-empty-message">Giỏ hàng của bạn đang rỗng.</div>
      ) : (
        cartItems.map((item) => (
          <div className="cart-item" key={item.id}>
            <div className="cart-col select">
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => handleSelectItem(item.id)}
              />
            </div>
            <div className="cart-col product">
              <img
                src={`http://localhost:8080${item.product?.imageUrl}`}
                alt={item.product?.name}
              />
              <div className="info">
                <div className="name">{item.product?.name}</div>
                <div className="category">
                  Phân Loại Hàng:{" "}
                  {item.product?.usagePurpose?.name || "Mặc định"}
                </div>
              </div>
            </div>
            <div className="cart-col price">
              {formatPrice(item.product?.price || 0)}
            </div>
            <div className="cart-col quantity">
              <button onClick={() => handleUpdateQuantity(item.id, -1)}>
                -
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => handleUpdateQuantity(item.id, 1)}>
                +
              </button>
            </div>
            <div className="cart-col total red">
              {formatPrice((item.product?.price || 0) * item.quantity)}
            </div>
            <div className="cart-col action">
              <button
                className="delete-btn"
                onClick={() => handleRemoveItem(item.id)}
              >
                Xóa
              </button>
            </div>
          </div>
        ))
      )}

      <div className="cart-footer">
        <div className="left">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={handleSelectAll}
            disabled={cartItems.length === 0}
          />
          Chọn Tất Cả ({selectedItems.length}){" "}
          <span
            className={`delete-all ${
              selectedItems.length === 0 ? "disabled" : ""
            }`}
            onClick={handleDeleteSelected}
          >
            Xóa
          </span>
        </div>
        <div className="right">
          <span>
            {/* Hiển thị đúng số lượng và tổng tiền đã chọn */}
            Tổng thanh toán ({selectedItems.length} Sản phẩm):{" "}
            <strong className="red">{formatPrice(selectedTotal)}</strong>
          </span>
          <button
            className="buy-btn"
            onClick={handleCheckout}
            disabled={selectedItems.length === 0} // Vô hiệu hóa nếu CHƯA CHỌN
          >
            Mua Hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;