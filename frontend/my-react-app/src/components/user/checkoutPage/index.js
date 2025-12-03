import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation
import { User, MapPin, Phone, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { checkoutSelected } from "api/cart"; 
import { updateUserProfile } from "api/user"; 
import apiClient from "api/axiosConfig";
import "./style.scss"; // Bạn cần sửa lại CSS file này bỏ class overlay đi

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Lấy dữ liệu được gửi từ trang Giỏ hàng
  const { selectedIds, displayItems, totalAmount } = location.state || {};

  const [step, setStep] = useState('form'); 
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', address: '', note: '' });
  const [originalData, setOriginalData] = useState({}); 
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Nếu người dùng vào thẳng link /checkout mà không qua giỏ hàng thì đá về giỏ hàng
  useEffect(() => {
    if (!selectedIds || selectedIds.length === 0) {
        navigate("/gio-hang");
    }
  }, [selectedIds, navigate]);

  // Lấy thông tin User (Giữ nguyên logic cũ)
  useEffect(() => {
    const fetchLatestUserData = async () => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const localUser = JSON.parse(userStr);
        let userData = localUser; 
        try {
          const res = await apiClient.get('/users/my-info');
          if (res.data) userData = res.data;
        } catch (error) { console.warn(error); }

        const initialData = {
          fullName: userData.username || userData.name || '', 
          email: userData.email || '',
          phone: userData.phone || '',        
          address: userData.address || '',    
          note: ''
        };
        setFormData(initialData);
        setOriginalData(initialData);
      }
    };
    fetchLatestUserData();
  }, []);

  const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  // ... (Giữ nguyên các hàm validateForm, handleInputChange) ...
  const validateForm = () => { /* Logic cũ */ const newErrors = {}; if(!formData.fullName.trim()) newErrors.fullName="Nhập họ tên"; if(!formData.phone.trim()) newErrors.phone="Nhập SĐT"; if(!formData.address.trim()) newErrors.address="Nhập địa chỉ"; setErrors(newErrors); return Object.keys(newErrors).length === 0; };
  const handleInputChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' })); };

  // Logic chuyển bước (Giữ nguyên)
  const handleUpdateUserAndNext = async () => {
    if (!validateForm()) return;
    const hasChanged = formData.fullName !== originalData.fullName || formData.phone !== originalData.phone || formData.address !== originalData.address;
    if (hasChanged) {
        setIsLoading(true);
        try {
            const updatePayload = { name: formData.fullName, phone: formData.phone, address: formData.address, email: formData.email };
            await updateUserProfile(updatePayload);
            const currentUser = JSON.parse(localStorage.getItem("user"));
            localStorage.setItem("user", JSON.stringify({ ...currentUser, ...updatePayload }));
        } catch (error) {} finally { setIsLoading(false); }
    }
    setStep('confirm');
  };

  const handleConfirmOrder = async () => {
    setIsLoading(true);
    try {
      await checkoutSelected(selectedIds, formData); 
      setStep('success');
    } catch (error) {
      alert('Có lỗi xảy ra!');
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDER (Đã bỏ overlay/modal) ---
  
  // Thay vì dùng class .checkout-overlay, hãy dùng .checkout-page-container (viết CSS cho nó căn giữa đẹp)
  return (
    <div className="checkout-page-container" style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      
      {/* STEP 1: FORM */}
      {step === 'form' && (
        <div className="checkout-content">
            <h2 style={{borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '20px'}}>Thông Tin Giao Hàng</h2>
            
            <div className="alert-box" style={{background:'#fff3cd', padding:'10px', marginBottom:'15px', borderRadius:'5px'}}>
               <AlertCircle size={16}/> Kiểm tra thông tin nhận hàng của bạn.
            </div>

            {/* Các Input Form (Giữ nguyên code cũ) */}
            <div className="form-group">
                <label>Họ tên:</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="form-control" />
                {errors.fullName && <span style={{color:'red'}}>{errors.fullName}</span>}
            </div>
            <div className="form-group">
                <label>Email (Không đổi):</label>
                <input type="text" value={formData.email} disabled className="form-control disabled" />
            </div>
            <div className="form-group">
                <label>Số điện thoại:</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="form-control" />
                {errors.phone && <span style={{color:'red'}}>{errors.phone}</span>}
            </div>
            <div className="form-group">
                <label>Địa chỉ:</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="form-control" />
                {errors.address && <span style={{color:'red'}}>{errors.address}</span>}
            </div>
            <div className="form-group">
                <label>Ghi chú:</label>
                <textarea name="note" value={formData.note} onChange={handleInputChange} className="form-control" rows={3}></textarea>
            </div>

            <div className="action-footer" style={{marginTop: '20px', display:'flex', gap:'10px'}}>
                <button className="btn-back" onClick={() => navigate("../gio-hang")}>Quay lại giỏ hàng</button>
                <button className="btn-primary" onClick={handleUpdateUserAndNext} disabled={isLoading}>
                    {isLoading ? 'Đang xử lý...' : 'Tiếp theo'}
                </button>
            </div>
        </div>
      )}

      {/* STEP 2: CONFIRM */}
      {step === 'confirm' && (
        <div className="checkout-content">
            <h2>Xác Nhận Đơn Hàng</h2>
            
            <div className="confirm-info" style={{background:'#f9f9f9', padding:'15px', borderRadius:'8px', marginBottom:'20px'}}>
                <p><strong>Người nhận:</strong> {formData.fullName}</p>
                <p><strong>SĐT:</strong> {formData.phone}</p>
                <p><strong>Địa chỉ:</strong> {formData.address}</p>
                <p><strong>Ghi chú:</strong> {formData.note}</p>
            </div>

            <h3>Sản phẩm ({displayItems?.length})</h3>
            <div className="order-items">
                {displayItems?.map(item => (
                    <div key={item.id} style={{display:'flex', justifyContent:'space-between', borderBottom:'1px dashed #eee', padding:'10px 0'}}>
                        <span>{item.product?.name} <strong>x {item.quantity}</strong></span>
                        <span>{formatCurrency((item.product?.price || 0) * item.quantity)}</span>
                    </div>
                ))}
            </div>
            <div style={{textAlign:'right', fontSize:'20px', fontWeight:'bold', marginTop:'20px', color:'red'}}>
                Tổng: {formatCurrency(totalAmount)}
            </div>

            <div className="action-footer" style={{marginTop: '20px', display:'flex', gap:'10px'}}>
                <button className="btn-back" onClick={() => setStep('form')}>Quay lại</button>
                <button className="btn-primary" onClick={handleConfirmOrder} disabled={isLoading}>
                    {isLoading ? 'Đang đặt hàng...' : 'Xác Nhận Đặt Hàng'}
                </button>
            </div>
        </div>
      )}

      {/* STEP 3: SUCCESS */}
      {step === 'success' && (
        <div className="checkout-content success" style={{textAlign:'center', padding:'40px'}}>
            <CheckCircle size={60} color="green" />
            <h2>Đặt Hàng Thành Công!</h2>
            <p>Cảm ơn bạn đã mua hàng.</p>
            <button className="btn-primary" onClick={() => navigate("/customer/home/don-mua")}>
                Xem đơn hàng của tôi
            </button>
        </div>
      )}

    </div>
  );
};

export default CheckoutPage;