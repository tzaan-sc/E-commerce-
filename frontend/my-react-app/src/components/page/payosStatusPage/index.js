import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useParams, useLocation } from 'react-router-dom';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { getOrderDetail } from 'api/order';
import { useCart } from 'context';

const PayOSStatusPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchCartCount } = useCart();
  
  const orderId = searchParams.get("orderId");
  
  // Kiểm tra url xem đang là trang success hay cancel
  const isCancel = location.pathname.includes('cancel');

  const [isSuccess, setIsSuccess] = useState(false);
  const [statusText, setStatusText] = useState("Đang chờ xác nhận từ ngân hàng...");

  useEffect(() => {
    if (!orderId || isCancel) return;
    
    // Auto-polling trạng thái từ hệ thống nhà (webhook PayOS cập nhật)
    const interval = setInterval(async () => {
      try {
        const res = await getOrderDetail(orderId);
        if (res.data && res.data.status !== 'PENDING') {
          setIsSuccess(true);
          setStatusText("Giao dịch thành công! Đơn hàng đã được xác nhận.");
          clearInterval(interval);
          if (fetchCartCount) fetchCartCount();
          // Tự chuyển hướng về đơn hàng sau 2 giây
          setTimeout(() => {
            navigate("/customer/home/don-mua");
          }, 2000);
        }
      } catch (err) {
        console.warn("Lỗi kiểm tra trạng thái", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId, isCancel, navigate, fetchCartCount]);

  if (!orderId) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Không tìm thấy mã đơn hàng</h2>
        <button className="btn-primary" onClick={() => navigate("/customer/home")}>Về trang chủ</button>
      </div>
    );
  }

  if (isCancel) {
    return (
      <div style={{ textAlign: "center", padding: "50px", maxWidth: "600px", margin: "30px auto", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <XCircle size={60} color="#d70018" style={{ margin: "0 auto 20px" }} />
        <h2 style={{ color: "#d70018" }}>Đã Hủy Giao Dịch</h2>
        <p>Bạn đã hủy thanh toán đơn hàng #{orderId}. Đơn hàng vẫn được lưu lại trạng thái chờ thanh toán.</p>
        <button className="btn-primary" onClick={() => navigate("/customer/home/don-mua")} style={{ marginTop: "20px" }}>
          Xem danh sách đơn hàng
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 20px", maxWidth: "600px", margin: "30px auto", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", textAlign: "center" }}>
      {isSuccess ? (
        <CheckCircle size={60} color="#16a34a" style={{ margin: "0 auto 20px" }} />
      ) : (
        <AlertCircle size={60} color="#2563eb" style={{ margin: "0 auto 20px" }} className="animate-pulse" />
      )}
      
      <h2 style={{ color: isSuccess ? "#16a34a" : "#2563eb", marginBottom: "20px" }}>
        {isSuccess ? "Thanh Toán Hoàn Tất" : "Đang Xử Lý Thanh Toán"}
      </h2>
      
      <p style={{ fontSize: "1.1rem", marginBottom: "20px" }}>{statusText}</p>
      
      <div style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", padding: "15px", borderRadius: "8px", textAlign: "left" }}>
        <p style={{ margin: "5px 0" }}><strong>Mã Đơn Hàng:</strong> #{orderId}</p>
      </div>

      {!isSuccess && (
        <p style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "20px" }}>
          Vui lòng không đóng trình duyệt. Hệ thống đang tự động xác nhận số dư tài khoản nhờ cổng PayOS...
        </p>
      )}

      {isSuccess && (
        <button className="btn-primary" onClick={() => navigate("/customer/home/don-mua")} style={{ marginTop: "20px" }}>
          Về danh sách đơn hàng ngay
        </button>
      )}
    </div>
  );
};

export default PayOSStatusPage;
