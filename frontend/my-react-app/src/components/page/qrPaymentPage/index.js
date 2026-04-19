import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, ArrowLeft, Copy, Check, RefreshCw } from 'lucide-react';
import apiClient from 'api/axiosConfig';
import { useCart } from 'context';

const BANK_CONFIG = {
  bin: '970436',
  name: 'Vietcombank',
  account: '1032850611',
  accountName: 'Ngo Thu Van',
};

const POLL_INTERVAL_MS = 3000;
const TERMINAL_ORDER_STATUSES = ['CONFIRMED', 'COMPLETED', 'FAILED', 'CANCELLED'];

const QRPaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchCartCount } = useCart();

  const orderId = searchParams.get('orderId');
  const amount  = searchParams.get('amount');

  // ── State ──────────────────────────────────────────────────────────────────
  const [paymentStatus, setPaymentStatus] = useState('PENDING');
  const [isLoading, setIsLoading]         = useState(false);
  const [error, setError]                 = useState(null);
  const [copiedField, setCopiedField]     = useState(null);
  const [showCodModal, setShowCodModal]   = useState(false);
  const [isSwitching, setIsSwitching]     = useState(false);
  const [showToast, setShowToast]         = useState(false); // 👈 toast

  const intervalRef  = useRef(null);
  const isMountedRef = useRef(true);

  const addInfo = `ORDER_${orderId}`;
  const qrUrl   = `https://img.vietqr.io/image/${BANK_CONFIG.bin}-${BANK_CONFIG.account}-compact2.png`
                + `?amount=${amount}&addInfo=${addInfo}&accountName=${encodeURIComponent(BANK_CONFIG.accountName)}`;

  // ── Helpers ────────────────────────────────────────────────────────────────
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handlePaymentSuccess = useCallback(() => {
    stopPolling();
    if (fetchCartCount) fetchCartCount();
    setPaymentStatus('PAID');
    setShowToast(true); // 👈 hiện toast

    setTimeout(() => {
      if (isMountedRef.current) {
        setShowToast(false);
        navigate('/customer/home/don-mua');
      }
    }, 2000);
  }, [stopPolling, fetchCartCount, navigate]);

  // ── Polling tự động ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!orderId) return;
    isMountedRef.current = true;

    intervalRef.current = setInterval(async () => {
      try {
        const res           = await apiClient.get(`/payment/status/${orderId}`);
        const orderStatus   = res.data?.status?.toUpperCase();
        const paymentStatus = res.data?.paymentStatus?.toUpperCase();

        if (!isMountedRef.current) return;

        // ✅ Ưu tiên kiểm tra paymentStatus PAID — tín hiệu chính xác tiền đã về
        if (paymentStatus === 'PAID') {
          setPaymentStatus('PAID');
          stopPolling();
          handlePaymentSuccess();
          return;
        }

        // Fallback: kiểm tra orderStatus
        if (orderStatus && TERMINAL_ORDER_STATUSES.includes(orderStatus)) {
          setPaymentStatus(orderStatus);
          stopPolling();

          if (['CONFIRMED', 'COMPLETED'].includes(orderStatus)) {
            handlePaymentSuccess();
          } else if (orderStatus === 'FAILED' || orderStatus === 'CANCELLED') {
            setError('Giao dịch thất bại hoặc đơn đã bị hủy. Vui lòng thử lại hoặc liên hệ hỗ trợ.');
          }
        }
      } catch (err) {
        console.warn('Lỗi polling:', err);
      }
    }, POLL_INTERVAL_MS);

    return () => {
      isMountedRef.current = false;
      stopPolling();
    };
  }, [orderId, stopPolling, handlePaymentSuccess]);

  // ── Nút "Tôi đã chuyển khoản" ─────────────────────────────────────────────
  const handleConfirmDone = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res           = await apiClient.get(`/payment/status/${orderId}`);
      const orderStatus   = res.data?.status?.toUpperCase();
      const paymentStatus = res.data?.paymentStatus?.toUpperCase();

      if (paymentStatus === 'PAID' || ['CONFIRMED', 'COMPLETED'].includes(orderStatus)) {
        handlePaymentSuccess();
      } else {
        setError('Hệ thống chưa nhận được thanh toán. Vui lòng chờ thêm 1–2 phút để ngân hàng xử lý.');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi kiểm tra trạng thái thanh toán.');
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  };

  // ── Nút "Đổi sang COD" ────────────────────────────────────────────────────
  const handleSwitchToCod = async () => {
    setIsSwitching(true);
    try {
      await apiClient.put(`/orders/${orderId}/switch-to-cod`);
      stopPolling();
      if (fetchCartCount) fetchCartCount();
      navigate('/customer/home/don-mua');
    } catch (err) {
      setError('Không thể đổi sang COD. Vui lòng thử lại.');
      setShowCodModal(false);
    } finally {
      if (isMountedRef.current) setIsSwitching(false);
    }
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedField(field);
    setTimeout(() => { if (isMountedRef.current) setCopiedField(null); }, 2000);
  };

  // ── Guards ─────────────────────────────────────────────────────────────────
  if (!orderId || !amount) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Không tìm thấy thông tin thanh toán</h2>
        <button onClick={() => navigate('/customer/home')}
          style={{ padding: '10px 20px', marginTop: '20px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Về trang chủ
        </button>
      </div>
    );
  }

  if (paymentStatus === 'FAILED' || paymentStatus === 'CANCELLED') {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <AlertCircle size={48} color="#dc2626" />
        <h2 style={{ color: '#dc2626' }}>Giao dịch thất bại</h2>
        <p style={{ color: '#6b7280' }}>{error || 'Vui lòng thử lại hoặc liên hệ hỗ trợ.'}</p>
        <button onClick={() => navigate('/customer/home')}
          style={{ padding: '10px 20px', marginTop: '20px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Về trang chủ
        </button>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '30px 20px', maxWidth: '600px', margin: '30px auto', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center' }}>

      {/* Toast thông báo thanh toán thành công */}
      {showToast && (
        <div style={{
          position: 'fixed',
          top: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#16a34a',
          color: '#fff',
          padding: '14px 28px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '15px',
          fontWeight: '600',
          zIndex: 9999,
          animation: 'slideDown 0.3s ease',
        }}>
          <CheckCircle size={20} />
          Thanh toán thành công! Đang chuyển hướng...
        </div>
      )}

      {/* Quay lại */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '15px' }}>
        <button onClick={() => navigate(-1)}
          style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', color: '#4b5563', fontSize: '14px', fontWeight: '500', padding: 0 }}>
          <ArrowLeft size={18} /> Quay lại
        </button>
      </div>

      <h2 style={{ color: '#2563eb', marginBottom: '15px', marginTop: 0 }}>
        Thanh Toán Đơn Hàng #{orderId}
      </h2>

      {/* Badge đang kiểm tra */}
      {paymentStatus === 'PENDING' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#16a34a', fontSize: '13px', fontWeight: '500', backgroundColor: '#dcfce7', padding: '6px 16px', borderRadius: '20px', width: 'fit-content', margin: '0 auto 20px auto' }}>
          <RefreshCw size={14} style={{ animation: 'spin 2s linear infinite' }} />
          Hệ thống đang tự động kiểm tra giao dịch...
        </div>
      )}

      {/* Badge đã thanh toán */}
      {paymentStatus === 'PAID' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#16a34a', fontSize: '13px', fontWeight: '500', backgroundColor: '#dcfce7', padding: '6px 16px', borderRadius: '20px', width: 'fit-content', margin: '0 auto 20px auto' }}>
          <CheckCircle size={14} />
          Thanh toán thành công! Đang chuyển hướng...
        </div>
      )}

      {/* Thông tin chuyển khoản */}
      <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '15px', borderRadius: '8px', marginBottom: '25px', textAlign: 'left', fontSize: '14px', color: '#1f2937' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #dbeafe' }}>
          <strong>Tổng tiền:</strong>
          <span style={{ color: '#d70018', fontSize: '1.2rem', fontWeight: 'bold' }}>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}
          </span>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <strong>Ngân hàng:</strong> {BANK_CONFIG.name}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span><strong>Số tài khoản:</strong> {BANK_CONFIG.account}</span>
          <button onClick={() => handleCopy(BANK_CONFIG.account, 'account')}
            style={{ background: '#dbeafe', border: 'none', color: '#1e3a8a', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '500' }}>
            {copiedField === 'account' ? <Check size={14} /> : <Copy size={14} />}
            {copiedField === 'account' ? 'Đã chép' : 'Copy'}
          </button>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <strong>Chủ tài khoản:</strong> {BANK_CONFIG.accountName}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            <strong>Nội dung:</strong>
            <span style={{ backgroundColor: '#ffeb3b', padding: '2px 8px', fontWeight: 'bold', borderRadius: '4px', marginLeft: '4px' }}>
              {addInfo}
            </span>
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
        <img src={qrUrl} alt="VietQR"
          style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #eee' }} />
        <p style={{ marginTop: '15px', color: '#555', fontSize: '0.9rem' }}>
          Sử dụng phần mềm ngân hàng để quét mã QR
        </p>
      </div>

      {/* Lỗi */}
      {error && (
        <div style={{ color: '#b91c1c', backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '10px', borderRadius: '6px', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '14px' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Nút hành động — ẩn khi đã PAID */}
      {paymentStatus !== 'PAID' && (
        <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

          {/* Nút 1: Đã chuyển khoản */}
          <button onClick={handleConfirmDone} disabled={isLoading}
            style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '12px 24px', fontSize: '1rem', fontWeight: 'bold', borderRadius: '6px', cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: isLoading ? 0.7 : 1 }}>
            {isLoading
              ? <><RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} /> Đang kiểm tra...</>
              : <><CheckCircle size={20} /> Tôi đã chuyển khoản xong</>
            }
          </button>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0 }}>
            Lưu ý: Hoàn tất chuyển khoản trước khi bấm nút xác nhận.
          </p>

          {/* Nút 2: Đổi sang COD */}
          <button onClick={() => setShowCodModal(true)}
            style={{ backgroundColor: '#fff', color: '#374151', border: '1px solid #d1d5db', padding: '12px 24px', fontSize: '14px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            💵 Đổi sang thanh toán khi nhận hàng (COD)
          </button>

        </div>
      )}

      {/* Modal xác nhận đổi COD */}
      {showCodModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
            <h3 style={{ marginTop: 0 }}>Đổi sang thanh toán COD?</h3>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              Đơn hàng sẽ được xác nhận ngay và bạn thanh toán bằng tiền mặt khi nhận hàng.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
              <button onClick={() => setShowCodModal(false)} disabled={isSwitching}
                style={{ padding: '10px 20px', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', background: '#fff' }}>
                Huỷ
              </button>
              <button onClick={handleSwitchToCod} disabled={isSwitching}
                style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: isSwitching ? 'not-allowed' : 'pointer', opacity: isSwitching ? 0.7 : 1 }}>
                {isSwitching ? 'Đang xử lý...' : 'Đồng ý'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default QRPaymentPage;