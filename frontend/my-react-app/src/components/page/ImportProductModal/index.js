import React, { useState } from 'react';
import axios from 'axios';

const ImportProductModal = ({ show, handleClose, onSuccess }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // 1. Nếu modal không bật thì không render gì cả
    if (!show) return null;

    // 2. Xử lý chọn file
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // 3. Xử lý Upload
    const handleUpload = async () => {
        if (!file) {
            alert("Vui lòng chọn file Excel!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setLoading(true);
        try {
            const token = localStorage.getItem("token"); // Lấy token nếu cần

            await axios.post("http://localhost:8080/api/products/import", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                }
            });

            alert("✅ Nhập dữ liệu thành công!");
            setFile(null);
            handleClose(); // Đóng modal
            onSuccess();   // Gọi hàm reload lại danh sách sản phẩm bên ngoài
        } catch (error) {
            console.error(error);
            const msg = error.response?.data || "Lỗi khi nhập file!";
            alert("❌ " + msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        // CSS đơn giản cho Modal (Nền đen mờ + Hộp thoại ở giữa)
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Nhập Sản Phẩm Từ Excel</h5>
                        <button type="button" className="close btn btn-light" onClick={handleClose}>
                            <span>&times;</span>
                        </button>
                    </div>
                    
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="font-weight-bold">Chọn file Excel (.xlsx)</label>
                            <input 
                                type="file" 
                                className="form-control-file border p-2 rounded"
                                accept=".xlsx, .xls" 
                                onChange={handleFileChange}
                            />
                            {file && <div className="text-success mt-2 small">Đã chọn: {file.name}</div>}
                            
                            <div className="alert alert-info mt-3 small">
                                <strong>Lưu ý:</strong> File phải đúng mẫu quy định (Tên, Giá, SL, Hãng, Nhu cầu...).
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={handleClose}>Hủy</button>
                        <button 
                              className="btn btn-success" 
                            onClick={handleUpload}
                            disabled={loading}
                        >
                            {loading ? "Đang xử lý..." : "Tải Lên & Lưu"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImportProductModal;