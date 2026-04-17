import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, ArrowLeft, Copy, Check, RefreshCw } from 'lucide-react';
import apiClient from 'api/axiosConfig'; // ✅ Gọi thẳng apiClient — đúng polling endpoint
import { useCart } from 'context';

// ✅ Constants tách ra ngoài component — không re-create mỗi lần render
const BANK_CONFIG = {
  bin: '970436',
  name: 'Vietcombank',
  account: '1032850611',
  accountName: 'Ngo Thu Van',
};

const POLL_INTERVAL_MS = 3000;
// Trạng thái cuối — polling sẽ dừng lại khi gặp một trong các status này
const TERMINAL_STATUSES = ['PAID', 'FAILED', 'CONFIRMED', 'COMPLETED'];

const QRPaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchCartCount } = useCart();

  const orderId = searchParams.get('orderId');
  const amount  = searchParams.get('amount');

  const [paymentStatus, setPaymentStatus] = useState('PENDING');
  const [isLoading, setIsLoading]         = useState(false);
  const [error, setError]                 = useState(null);
  const [copiedField, setCopiedField]     = useState(null);

  // ✅ FIX: Dùng useRef lưu intervalId — tránh stale closure trong setInterval callback
  const intervalRef  = useRef(null);
  // ✅ FIX: Flag isMounted — tránh setState sau khi component đã unmount (memory leak)
  const isMountedRef = useRef(true);

  const addInfo = `ORDER_${orderId}`;
  const qrUrl   = `https://img.vietqr.io/image/${BANK_CONFIG.bin}-${BANK_CONFIG.account}-compact2.png`
                + `?amount=${amount}&addInfo=${addInfo}&accountName=${encodeURIComponent(BANK_CONFIG.accountName)}`;

  // ✅ Tách stopPolling ra hook riêng để dùng được ở nhiều nơi
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // ✅ FIX: handlePaymentSuccess dùng useCallback — stable reference, không gây re-subscribe useEffect
  const handlePaymentSuccess = useCallback(() => {
    stopPolling(); // Dừng polling TRƯỚC khi navigate (tránh double-trigger)
    if (fetchCartCount) fetchCartCount();
    setPaymentStatus('PAID');
    // Delay nhỏ để user thấy trạng thái PAID trước khi navigate
    setTimeout(() => {
      if (isMountedRef.current) {
        navigate('/customer/home/don-mua');
      }
    }, 1500);
  }, [stopPolling, fetchCartCount, navigate]);

  // ✅ FIX MEMORY LEAK: Polling dùng intervalRef + isMountedRef
  // ✅ FIX ENDPOINT: Gọi /api/payment/status/{orderId} thay vì getOrderDetail (nhẹ hơn)
  useEffect(() => {
    if (!orderId) return;

    isMountedRef.current = true;

    intervalRef.current = setInterval(async () => {
      try {
        const res    = await apiClient.get(`/payment/status/${orderId}`);
        const status = res.data?.status?.toUpperCase();

        // Guard: component đã unmount trong lúc await → bỏ qua
        if (!isMountedRef.current) return;

        if (status && TERMINAL_STATUSES.includes(status)) {
          setPaymentStatus(status);
          stopPolling(); // Dừng interval ngay khi có kết quả cuối

          if (status === 'PAID' || status === 'CONFIRMED' || status === 'COMPLETED') {
            handlePaymentSuccess();
          } else if (status === 'FAILED') {
            setError('Giao dịch thất bại. Vui lòng thử lại hoặc liên hệ hỗ trợ.');
          }
        }
      } catch (err) {
        console.warn('Lỗi polling trạng thái:', err);
      }
    }, POLL_INTERVAL_MS);

    // ✅ Cleanup khi unmount — đảm bảo không bao giờ memory leak
    return () => {
      isMountedRef.current = false;
      stopPolling();
    };
  }, [orderId, stopPolling, handlePaymentSuccess]);

  // Nút "Tôi đã chuyển khoản" — check thủ công 1 lần
  const handleConfirmDone = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res    = await apiClient.get(`/payment/status/${orderId}`);
      const status = res.data?.status?.toUpperCase();

      if (status && (status === 'PAID' || status === 'CONFIRMED' || status === 'COMPLETED')) {
        handlePaymentSuccess();
      } else {
        setError('Hệ thống chưa nhận được thanh toán. Vui lòng chờ thêm 1–2 phút để ngân hàng xử lý.');
      }
    } catch (err) {
      console.error(err);
      setError('Có lỗi xảy ra khi kiểm tra trạng thái thanh toán.');
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedField(field);
    setTimeout(() => { if (isMountedRef.current) setCopiedField(null); }, 2000);
  };

  // Guard: thiếu query params
  if (!orderId || !amount) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Không tìm thấy thông tin thanh toán</h2>
        <button className="btn-primary" onClick={() => navigate('/customer/home')}
          style={{ padding: '10px 20px', marginTop: '20px' }}>
          Về trang chủ
        </button>
      </div>
    );
  }

  // Guard: giao dịch thất bại — hiển thị UI riêng thay vì alert()
  if (paymentStatus === 'FAILED') {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <AlertCircle size={48} color="#dc2626" />
        <h2 style={{ color: '#dc2626' }}>Giao dịch thất bại</h2>
        <p style={{ color: '#6b7280' }}>{error || 'Vui lòng thử lại hoặc liên hệ hỗ trợ.'}</p>
        <button onClick={() => navigate('/customer/home')}
          style={{ padding: '10px 20px', marginTop: '20px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
          Về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px 20px', maxWidth: '600px', margin: '30px auto', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center' }}>

      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '15px' }}>
        <button onClick={() => navigate(-1)}
          style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', color: '#4b5563', fontSize: '14px', fontWeight: '500', padding: 0 }}>
          <ArrowLeft size={18} /> Quay lại
        </button>
      </div>

      <h2 style={{ color: '#2563eb', marginBottom: '15px', marginTop: 0 }}>Thanh Toán Đơn Hàng #{orderId}</h2>

      {paymentStatus === 'PENDING' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#16a34a', fontSize: '13px', fontWeight: '500', backgroundColor: '#dcfce7', padding: '6px 16px', borderRadius: '20px', width: 'fit-content', margin: '0 auto 20px auto' }}>
          <RefreshCw size={14} style={{ animation: 'spin 2s linear infinite' }} />
          Hệ thống đang tự động kiểm tra giao dịch...
        </div>
      )}

      {/* Box thông tin chuyển khoản */}
      <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '15px', borderRadius: '8px', marginBottom: '25px', textAlign: 'left', fontSize: '14px', color: '#1f2937' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #dbeafe' }}>
          <strong>Tổng tiền:</strong>
          <span style={{ color: '#d70018', fontSize: '1.2rem', fontWeight: 'bold' }}>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span><strong>Ngân hàng:</strong> {BANK_CONFIG.name}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span><strong>Số tài khoản:</strong> {BANK_CONFIG.account}</span>
          <button onClick={() => handleCopy(BANK_CONFIG.account, 'account')}
            style={{ background: '#dbeafe', border: 'none', color: '#1e3a8a', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '500' }}>
            {copiedField === 'account' ? <Check size={14} /> : <Copy size={14} />}
            {copiedField === 'account' ? 'Đã chép' : 'Copy'}
          </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span><strong>Chủ tài khoản:</strong> {BANK_CONFIG.accountName}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            <strong>Nội dung:</strong>
            <span style={{ backgroundColor: '#ffeb3b', padding: '2px 8px', fontWeight: 'bold', borderRadius: '4px', marginLeft: '4px' }}>{addInfo}</span>
          </span>
          <button onClick={() => handleCopy(addInfo, 'info')}
            style={{ background: '#dbeafe', border: 'none', color: '#1e3a8a', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '500' }}>
            {copiedField === 'info' ? <Check size={14} /> : <Copy size={14} />}
            {copiedField === 'info' ? 'Đã chép' : 'Copy'}
          </button>
        </div>
      </div>

      {/* QR Code */}
      <div style={{ border: '2px dashed #ccc', padding: '20px', borderRadius: '8px', display: 'inline-block', backgroundColor: '#fafafa' }}>
        <img src={qrUrl} alt="VietQR" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #eee' }} />
        <p style={{ marginTop: '15px', color: '#555', fontSize: '0.9rem' }}>Sử dụng phần mềm ngân hàng để quét mã QR</p>
      </div>

      {error && (
        <div style={{ color: '#b91c1c', backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '10px', borderRadius: '6px', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '14px' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        <button onClick={handleConfirmDone} disabled={isLoading}
          style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '12px 24px', fontSize: '1rem', fontWeight: 'bold', borderRadius: '6px', cursor: isLoading ? 'not-allowed' : 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: isLoading ? 0.7 : 1, transition: 'opacity 0.2s' }}>
          {isLoading ? <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={20} />}
          {isLoading ? 'Đang kiểm tra giao dịch...' : 'Tôi đã chuyển khoản xong'}
        </button>
        <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '12px' }}>
          Lưu ý: Bạn cần hoàn tất chuyển khoản trước khi bấm nút xác nhận.
        </p>
      </div>

      <style>{`
        @keyframes spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default QRPaymentPage;