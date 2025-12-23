import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, MapPin, Phone, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { checkoutSelected } from "api/cart"; 
import { updateUserProfile } from "api/user"; 
import apiClient from "api/axiosConfig";
import "./style.scss"; 

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { selectedIds, displayItems, totalAmount } = location.state || {};

  const [step, setStep] = useState('form'); 
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', address: '', note: '' });
  const [originalData, setOriginalData] = useState({}); 
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // --- HÀM LẤY ẢNH (Giống bên Giỏ Hàng) ---
  const getProductImage = (product) => {
    if (!product) return "https://via.placeholder.com/60";
    if (product.images && product.images.length > 0) {
        const firstImg = product.images[0];
        const url = firstImg.urlImage || firstImg;
        return `http://localhost:8080${url}`;
    }
    if (product.imageUrl) {
        return `http://localhost:8080${product.imageUrl}`;
    }
    return "https://via.placeholder.com/60?text=No+Img";
  };

  useEffect(() => {
    if (!selectedIds || selectedIds.length === 0) {
        navigate("/gio-hang");
    }
  }, [selectedIds, navigate]);

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
// Hàm kiểm tra form
  const validateForm = () => { 
      const newErrors = {}; 
      
      // 1. Kiểm tra Tên
      if(!formData.fullName.trim()) {
          newErrors.fullName = "Vui lòng nhập họ tên.";
      }

      // 2. Kiểm tra Số điện thoại (QUAN TRỌNG)
      const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/; // Regex chuẩn đầu số VN (03, 05, 07, 08, 09) + 8 số đuôi
      
      if(!formData.phone.trim()) {
          newErrors.phone = "Vui lòng nhập số điện thoại.";
      } else if (!/^\d+$/.test(formData.phone)) {
          newErrors.phone = "Số điện thoại chỉ được chứa số.";
      } else if (formData.phone.length !== 10) {
          newErrors.phone = "Số điện thoại phải có đúng 10 chữ số.";
      } else if (!phoneRegex.test(formData.phone)) {
          // Tùy chọn: Kiểm tra chặt chẽ hơn đầu số (nếu cần)
          newErrors.phone = "Số điện thoại không hợp lệ (VD: 0912345678).";
      }

      // 3. Kiểm tra Địa chỉ
      if(!formData.address.trim()) {
          newErrors.address = "Vui lòng nhập địa chỉ nhận hàng.";
      } 
      
      setErrors(newErrors); 
      return Object.keys(newErrors).length === 0; 
  };
  const handleInputChange = (e) => { 
      const { name, value } = e.target; 
      setFormData(prev => ({ ...prev, [name]: value })); 
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' })); 
  };

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
      alert('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="checkout-page-container" style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      
      {/* STEP 1: FORM */}
      {step === 'form' && (
        <div className="checkout-content">
            <h2 style={{borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '20px'}}>Thông Tin Giao Hàng</h2>
            
            <div className="alert-box" style={{background:'#fff3cd', padding:'10px', marginBottom:'15px', borderRadius:'5px'}}>
               <AlertCircle size={16}/> Kiểm tra thông tin nhận hàng của bạn.
            </div>

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

      {/* STEP 2: CONFIRM (ĐÃ THÊM ẢNH) */}
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
                    <div key={item.id} style={{display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px dashed #eee', padding:'15px 0'}}>
                        
                        {/* 👇 PHẦN HIỂN THỊ ẢNH & TÊN */}
                        <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                            <img 
                                src={getProductImage(item.product)} 
                                alt={item.product?.name}
                                style={{
                                    width: '60px', 
                                    height: '60px', 
                                    objectFit: 'contain', 
                                    border: '1px solid #eee',
                                    borderRadius: '4px',
                                    backgroundColor: '#fff'
                                }}
                            />
                            <div>
                                <div style={{fontWeight:'500', marginBottom:'5px'}}>{item.product?.name}</div>
                                <div style={{fontSize:'14px', color:'#666'}}>Số lượng: <strong>x{item.quantity}</strong></div>
                            </div>
                        </div>

                        {/* PHẦN GIÁ */}
                        <div style={{fontWeight:'bold', color:'#333'}}>
                            {formatCurrency((item.product?.price || 0) * item.quantity)}
                        </div>
                    </div>
                ))}
            </div>
            
            <div style={{textAlign:'right', fontSize:'20px', fontWeight:'bold', marginTop:'20px', color:'#d70018'}}>
                Tổng cộng: {formatCurrency(totalAmount)}
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