// src/pages/admin/accountsPage/AccountEditModal.js
import React, { useState, useEffect } from "react";
import { X, User, Mail, Shield, Activity } from "lucide-react";

const AccountEditModal = ({ account, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "Khách hàng",
    status: "Hoạt động",
  });

  // Khi mở modal, nạp dữ liệu của account được chọn vào form
  useEffect(() => {
    if (account) {
      setFormData({ ...account });
    }
  }, [account]);

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000,
        display: "flex", justifyContent: "center", alignItems: "center",
        backdropFilter: "blur(3px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white", borderRadius: "16px",
          width: "90%", maxWidth: "500px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          overflow: "hidden", animation: "fadeIn 0.3s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          padding: "20px 24px", borderBottom: "1px solid #f0f0f0",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "#f8f9fa",
        }}>
          <h3 style={{ margin: 0, fontSize: "18px", color: "#333", fontWeight: "700" }}>
            Chỉnh sửa tài khoản
          </h3>
          <button onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#999" }}>
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "24px" }}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#444" }}>
              <User size={16} /> Tên người dùng
            </label>
            <input
              type="text"
              value={formData.username}
              disabled={true}
              style={{
                width: "100%", padding: "10px 12px", borderRadius: "8px",
                border: "1px solid #ddd", fontSize: "14px", outline: "none",
                backgroundColor: "#f5f5f5", color: "#888", cursor: "not-allowed",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#444" }}>
              <Mail size={16} /> Email
            </label>
            <input
              type="email"
              value={formData.email}
              disabled={true}
              style={{
                width: "100%", padding: "10px 12px", borderRadius: "8px",
                border: "1px solid #ddd", fontSize: "14px", outline: "none",
                backgroundColor: "#f5f5f5", color: "#888", cursor: "not-allowed",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#444" }}>
                <Shield size={16} /> Vai trò
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: "8px",
                  border: "1px solid #ddd", fontSize: "14px", outline: "none", cursor: "pointer",
                }}
              >
                <option value="Khách hàng">Khách hàng</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#444" }}>
                <Activity size={16} /> Trạng thái
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: "8px",
                  border: "1px solid #ddd", fontSize: "14px", outline: "none", cursor: "pointer",
                }}
              >
                <option value="Hoạt động">Hoạt động</option>
                <option value="Khóa">Khóa</option>
              </select>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: "16px 24px", borderTop: "1px solid #f0f0f0",
          display: "flex", justifyContent: "flex-end", gap: "12px", background: "#fcfcfc",
        }}>
          <button
            onClick={onClose}
            style={{ padding: "10px 20px", borderRadius: "8px", border: "1px solid #e0e0e0", background: "white", color: "#555", cursor: "pointer", fontWeight: "600" }}
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            style={{ padding: "10px 24px", borderRadius: "8px", border: "none", background: "#2563eb", color: "white", cursor: "pointer", fontWeight: "600", boxShadow: "0 2px 5px rgba(37, 99, 235, 0.3)" }}
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountEditModal;