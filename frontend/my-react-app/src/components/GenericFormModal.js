// GenericFormModal.js

import React, { useState, useEffect } from 'react';

/**
 * Component Modal chung để Thêm/Sửa (Add/Edit) bất kỳ tài nguyên nào.
 * * @param {boolean} isOpen - Trạng thái mở/đóng Modal
 * @param {function} onClose - Hàm đóng Modal
 * @param {object | null} itemToEdit - Dữ liệu item đang chỉnh sửa (hoặc null nếu thêm mới)
 * @param {function} onSave - Hàm gọi API (addBrand/updateBrand)
 * @param {Array<object>} schema - Cấu trúc form: [{ key: 'name', label: 'Tên', type: 'text', required: true }, ...]
 * @param {string} title - Tên tài nguyên (ví dụ: 'Thương hiệu', 'Danh mục')
 */
const GenericFormModal = ({ isOpen, onClose, itemToEdit, onSave, schema, title }) => {
    const [formData, setFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    
    // Đồng bộ hóa dữ liệu form khi Modal mở hoặc itemToEdit thay đổi
    useEffect(() => {
        const initialData = {};
        schema.forEach(field => {
            // Lấy giá trị từ itemToEdit hoặc để trống
            initialData[field.key] = itemToEdit ? itemToEdit[field.key] : '';
        });
        setFormData(initialData);
    }, [itemToEdit, schema, isOpen]); // Thêm isOpen vào dependency để reset form khi đóng/mở

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        
        const dataToSave = { ...formData };

        // Nếu là chế độ sửa, thêm ID vào dữ liệu
        if (itemToEdit) {
            dataToSave.id = itemToEdit.id;
        }

        // Gọi hàm onSave (hàm này sẽ gọi addItem/updateItem từ hook)
        // isEditing = true nếu itemToEdit có giá trị
        const success = await onSave(dataToSave, !!itemToEdit); 

        if (success) {
            // Đã được onSave xử lý thông báo alert
            onClose(); // Đóng modal khi thành công
        }
        setIsSaving(false);
    };

    if (!isOpen) return null;

    // ----------------------------------------------------------------
    // Phần Render Modal
    // ----------------------------------------------------------------
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{itemToEdit ? `Chỉnh sửa ${title}` : `Thêm ${title} Mới`}</h3>
                
                <form onSubmit={handleSubmit}>
                    {schema.map(field => (
                        <div className="form-group" key={field.key}>
                            <label>{field.label} {field.required && '(*)'}</label>
                            
                            <input
                                type={field.type}
                                name={field.key}
                                value={formData[field.key] || ''}
                                onChange={handleChange}
                                required={field.required}
                                disabled={isSaving}
                                className="input-field" // Thêm class CSS cho input
                            />
                            
                            {/* Hiển thị preview cho URL (ví dụ: Logo) */}
                            {field.type === 'url' && formData[field.key] && (
                                <div className="logo-preview">
                                    <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>Xem trước:</p>
                                    <img 
                                        src={formData[field.key]} 
                                        alt="Logo Preview" 
                                        style={{ maxWidth: '80px', maxHeight: '80px', objectFit: 'contain', border: '1px solid #ccc' }} 
                                        onError={(e) => { e.target.style.display = 'none'; }} // Ẩn ảnh nếu lỗi URL
                                    />
                                </div>
                            )}
                        </div>
                    ))}

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} disabled={isSaving}>Hủy</button>
                        <button type="submit" className="btn btn--primary" disabled={isSaving}>
                            {isSaving ? 'Đang lưu...' : 'Lưu'}
                        </button>
                    </div>
                </form>
            </div>
            {/* Cần thêm CSS cho .modal-overlay và .modal-content */}
        </div>
    );
};

export default GenericFormModal;