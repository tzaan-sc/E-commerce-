import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { confirmPayment, getOrderDetail } from 'api/order'; // Update with proper path if needed
import { useCart } from 'context';
import { useEffect } from 'react';

const QRPaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchCartCount } = useCart();
  
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cấu hình mã ngân hàng VietQR của bạn (Thay đổi tuỳ ngân hàng)
  const bankBin = "970422"; // MB Bank BIN
  const targetAccount = "0123456789"; 
  const accountName = "ECOMMERCE STORE";
  
  const addInfo = `ORDER_${orderId}`;
  const qrUrl = `https://img.vietqr.io/image/${bankBin}-${targetAccount}-compact2.png?amount=${amount}&addInfo=${addInfo}&accountName=${encodeURIComponent(accountName)}`;

  // Tự động kiểm tra trạng thái đơn hàng mỗi 3 giây (nhờ Webhook cập nhật status)
  useEffect(() => {
    if (!orderId) return;
    const interval = setInterval(async () => {
      try {
        const res = await getOrderDetail(orderId);
        if (res.data && res.data.status !== 'PENDING') {
          setIsSuccess(true);
          clearInterval(interval);
          handlePaymentSuccess();
        }
      } catch (err) {
        console.warn("Lỗi kiểm tra trạng thái", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId]);

  const handlePaymentSuccess = () => {
    if (fetchCartCount) fetchCartCount();
    alert("Thanh toán thành công! Trạng thái đơn hàng đã được tự động cập nhật.");
    navigate("/customer/home/don-mua");
  };

  const handleConfirmDone = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getOrderDetail(orderId);
      if (res.data && res.data.status !== 'PENDING') {
        handlePaymentSuccess();
      } else {
        setError("Hệ thống chưa nhận được thanh toán. Nếu bạn vừa chuyển khoản, vui lòng chờ thêm 1-2 phút để ngân hàng xử lý.");
      }
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi kiểm tra trạng thái thanh toán.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!orderId || !amount) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Không tìm thấy thông tin thanh toán</h2>
        <button className="btn-primary" onClick={() => navigate("/customer/home")} style={{ padding: "10px 20px", marginTop: "20px" }}>
          Về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 20px", maxWidth: "600px", margin: "0 auto", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", marginTop: "30px", marginBottom: "30px", textAlign: "center" }}>
      <h2 style={{ color: "#2563eb", marginBottom: "20px" }}>Thanh Toán Đơn Hàng #{orderId}</h2>
      
      <div style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", padding: "15px", borderRadius: "8px", marginBottom: "20px", textAlign: "left" }}>
        <p style={{ margin: "5px 0" }}><strong>Tổng tiền cần thanh toán:</strong> <span style={{ color: "#d70018", fontSize: "1.2rem", fontWeight: "bold" }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}</span></p>
        <p style={{ margin: "5px 0" }}><strong>Nội dung chuyển khoản (Bắt buộc):</strong> <span style={{ backgroundColor: "#ffeb3b", padding: "2px 8px", fontWeight: "bold", borderRadius: "4px" }}>{addInfo}</span></p>
      </div>

      <div style={{ border: "2px dashed #ccc", padding: "20px", borderRadius: "8px", display: "inline-block", backgroundColor: "#fafafa" }}>
        <img src={qrUrl} alt="VietQR" style={{ maxWidth: "100%", height: "auto", borderRadius: "8px", border: "1px solid #eee" }} />
        <p style={{ marginTop: "15px", color: "#555", fontSize: "0.9rem" }}>Sử dụng phần mềm ngân hàng để quét mã QR</p>
      </div>

      {error && (
        <div style={{ color: 'red', marginTop: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div style={{ marginTop: "30px" }}>
        <button 
          onClick={handleConfirmDone} 
          disabled={isLoading}
          style={{
            backgroundColor: "#16a34a",
            color: "#fff",
            border: "none",
            padding: "12px 24px",
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: "6px",
            cursor: isLoading ? "not-allowed" : "pointer",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            opacity: isLoading ? 0.7 : 1
          }}
        >
          <CheckCircle size={20} />
          {isLoading ? "Đang xử lý..." : "Tôi đã chuyển khoản xong"}
        </button>
        <p style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "10px" }}>
          Lưu ý: Bạn cần hoàn tất chuyển khoản trước khi bấm nút xác nhận. Đơn hàng sẽ không được giao nếu thanh toán không hợp lệ.
        </p>
      </div>
    </div>
  );
};

export default QRPaymentPage;
