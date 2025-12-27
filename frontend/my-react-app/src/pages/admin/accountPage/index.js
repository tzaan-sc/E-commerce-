import React, { useState, useEffect, useRef, useMemo } from "react";
import apiClient from "../../../api/axiosConfig";
import { Save, Upload } from "lucide-react";
import {
  LayoutDashboard,
  Laptop,
  Users,
  ShoppingCart,
  Tag,
  Monitor,
  Target,
  LogOut,
  Menu,
  X,
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  User,
  Mail,
  Shield,
  Activity,
} from "lucide-react";
import useGenericApi from "hooks/useGenericApi";

const AccountsPage = () => {
  const [accounts, setAccounts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [editingAccount, setEditingAccount] = useState(null);

  const [formData, setFormData] = useState({
    username: "",

    email: "",

    role: "Khách hàng",

    status: "Hoạt động",
  });

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const API_BASE = "http://localhost:8080/api/users";

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_BASE);

      const data = await response.json();

      const mappedData = data.map((acc) => ({
        id: acc.id,

        username: acc.username,

        email: acc.email,

        role: acc.role === "ADMIN" ? "Admin" : "Khách hàng",

        status: acc.active ? "Hoạt động" : "Khóa",
      }));

      setAccounts(mappedData);
    } catch (error) {
      console.error("Lỗi tải tài khoản:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAccount = (account) => {
    setEditingAccount(account);

    setFormData({ ...account });
  };

  const handleUpdateAccount = async () => {
    const userPayload = {
      username: formData.username,

      email: formData.email,

      role: formData.role === "Admin" ? "ADMIN" : "CUSTOMER",

      active: formData.status === "Hoạt động",
    };

    try {
      const response = await fetch(`${API_BASE}/${editingAccount.id}`, {
        method: "PUT",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify(userPayload),
      });

      if (response.ok) {
        await fetchAccounts();

        handleCancelEdit();

        alert("Cập nhật tài khoản thành công!");
      } else {
        alert("Lỗi khi cập nhật tài khoản!");
      }
    } catch (error) {
      console.error("Error updating account:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingAccount(null);

    setFormData({
      username: "",
      email: "",
      role: "Khách hàng",
      status: "Hoạt động",
    });
  };

  // Pagination logic

  const indexOfLastItem = currentPage * itemsPerPage;

  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentAccounts = accounts.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(accounts.length / itemsPerPage);

  return (
    <div className="page-card">
      <div className="page-card__header">
        <h3 className="page-card__title">Quản lý tài khoản</h3>
      </div>

      {/* TABLE */}

      <div className="table-container">
        <table
          className="data-table"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#f8f9fa",
                height: "50px",
                textAlign: "left",
                color: "#495057",
              }}
            >
              <th style={{ width: "50px", padding: "12px" }}>ID</th>

              <th style={{ padding: "12px" }}>Tên</th>

              <th style={{ padding: "12px" }}>Email</th>

              <th style={{ width: "120px", padding: "12px" }}>Vai trò</th>

              <th style={{ width: "120px", padding: "12px" }}>Trạng thái</th>

              <th
                style={{ width: "80px", padding: "12px", textAlign: "center" }}
              >
                Sửa
              </th>
            </tr>
          </thead>

          <tbody>
            {currentAccounts.map((account) => (
              <tr
                key={account.id}
                style={{
                  height: "60px",
                  borderBottom: "1px solid #eee",
                  transition: "background 0.2s",
                }}
              >
                <td
                  style={{ padding: "12px", fontWeight: "bold", color: "#666" }}
                >
                  {account.id}
                </td>

                <td style={{ padding: "12px", fontWeight: "500" }}>
                  {account.username}
                </td>

                <td style={{ padding: "12px", color: "#555" }}>
                  {account.email}
                </td>

                <td style={{ padding: "12px" }}>
                  <span
                    className={`badge ${
                      account.role === "Admin" ? "badge--purple" : "badge--info"
                    }`}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {account.role}
                  </span>
                </td>

                <td style={{ padding: "12px" }}>
                  <span
                    className={`badge ${
                      account.status === "Hoạt động"
                        ? "badge--success"
                        : "badge--danger"
                    }`}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {account.status}
                  </span>
                </td>

                <td style={{ padding: "12px", textAlign: "center" }}>
                  <button
                    className="action-btn"
                    onClick={() => handleEditAccount(account)}
                    style={{
                      background: "#e3f2fd",
                      color: "#1976d2",
                      border: "none",
                      padding: "8px",
                      borderRadius: "50%",
                      cursor: "pointer",
                      transition: "0.2s",
                    }}
                  >
                    <Edit size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}

        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "15px",
              padding: "20px",
            }}
          >
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: "6px 12px",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                opacity: currentPage === 1 ? 0.5 : 1,
                border: "1px solid #ddd",
                borderRadius: "6px",
                background: "#fff",
              }}
            >
              <ChevronLeft size={20} />
            </button>

            <span
              style={{ fontSize: "14px", fontWeight: "600", color: "#555" }}
            >
              Trang {currentPage} / {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              style={{
                padding: "6px 12px",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                opacity: currentPage === totalPages ? 0.5 : 1,
                border: "1px solid #ddd",
                borderRadius: "6px",
                background: "#fff",
              }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* ======= MODAL EDIT FORM (POPUP) ======= */}

      {editingAccount && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,

            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1000,

            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            backdropFilter: "blur(3px)", // Hiệu ứng mờ nền phía sau
          }}
          onClick={handleCancelEdit}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",

              width: "90%",
              maxWidth: "500px",

              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",

              overflow: "hidden",
              animation: "fadeIn 0.3s ease-out",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}

            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid #f0f0f0",

                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",

                background: "#f8f9fa",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "18px",
                  color: "#333",
                  fontWeight: "700",
                }}
              >
                Chỉnh sửa tài khoản
              </h3>

              <button
                onClick={handleCancelEdit}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#999",
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}

            <div style={{ padding: "24px" }}>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#444",
                  }}
                >
                  <User size={16} /> Tên người dùng
                </label>

                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  disabled={true}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border 0.2s",
                    backgroundColor: "#f5f5f5",
                    color: "#888",
                    cursor: "not-allowed",
                  }}
                  placeholder="Nhập tên..."
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#444",
                  }}
                >
                  <Mail size={16} /> Email
                </label>

                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={true}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    fontSize: "14px",
                    outline: "none",
                    backgroundColor: "#f5f5f5",
                    color: "#888",
                    cursor: "not-allowed",
                  }}
                  placeholder="Nhập email..."
                />
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#444",
                    }}
                  >
                    <Shield size={16} /> Vai trò
                  </label>

                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      fontSize: "14px",
                      outline: "none",
                      background: "white",
                      cursor: "pointer",
                    }}
                  >
                    <option value="Khách hàng">Khách hàng</option>

                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#444",
                    }}
                  >
                    <Activity size={16} /> Trạng thái
                  </label>

                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      fontSize: "14px",
                      outline: "none",
                      background: "white",
                      cursor: "pointer",
                    }}
                  >
                    <option value="Hoạt động">Hoạt động</option>

                    <option value="Khóa">Khóa</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}

            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid #f0f0f0",

                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",

                background: "#fcfcfc",
              }}
            >
              <button
                onClick={handleCancelEdit}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                  background: "white",
                  color: "#555",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Hủy
              </button>

              <button
                onClick={handleUpdateAccount}
                style={{
                  padding: "10px 24px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#2563eb",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "600",
                  boxShadow: "0 2px 5px rgba(37, 99, 235, 0.3)",
                }}
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AccountsPage;