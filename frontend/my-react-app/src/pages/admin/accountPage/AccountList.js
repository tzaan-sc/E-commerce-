// src/pages/admin/accountsPage/AccountList.js
import React from "react";
import { Edit, ChevronLeft, ChevronRight } from "lucide-react";

const AccountList = ({ accounts, currentPage, totalPages, onPageChange, onEdit }) => {
  return (
    <div className="table-container">
      <table className="data-table" style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        <thead>
          <tr style={{ background: "#f8f9fa", height: "50px", textAlign: "left", color: "#495057" }}>
            <th style={{ width: "50px", padding: "12px" }}>ID</th>
            <th style={{ padding: "12px" }}>Tên</th>
            <th style={{ padding: "12px" }}>Email</th>
            <th style={{ width: "120px", padding: "12px" }}>Vai trò</th>
            <th style={{ width: "120px", padding: "12px" }}>Trạng thái</th>
            <th style={{ width: "80px", padding: "12px", textAlign: "center" }}>Sửa</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id} style={{ height: "60px", borderBottom: "1px solid #eee", transition: "background 0.2s" }}>
              <td style={{ padding: "12px", fontWeight: "bold", color: "#666" }}>{account.id}</td>
              <td style={{ padding: "12px", fontWeight: "500" }}>{account.username}</td>
              <td style={{ padding: "12px", color: "#555" }}>{account.email}</td>
              <td style={{ padding: "12px" }}>
                <span
                  className={`badge ${account.role === "Admin" ? "badge--purple" : "badge--info"}`}
                  style={{ padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}
                >
                  {account.role}
                </span>
              </td>
              <td style={{ padding: "12px" }}>
                <span
                  className={`badge ${account.status === "Hoạt động" ? "badge--success" : "badge--danger"}`}
                  style={{ padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}
                >
                  {account.status}
                </span>
              </td>
              <td style={{ padding: "12px", textAlign: "center" }}>
                <button
                  className="action-btn"
                  onClick={() => onEdit(account)}
                  style={{ background: "#e3f2fd", color: "#1976d2", border: "none", padding: "8px", borderRadius: "50%", cursor: "pointer", transition: "0.2s" }}
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
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", padding: "20px" }}>
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            style={{ padding: "6px 12px", cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? 0.5 : 1, border: "1px solid #ddd", borderRadius: "6px", background: "#fff" }}
          >
            <ChevronLeft size={20} />
          </button>
          <span style={{ fontSize: "14px", fontWeight: "600", color: "#555" }}>
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{ padding: "6px 12px", cursor: currentPage === totalPages ? "not-allowed" : "pointer", opacity: currentPage === totalPages ? 0.5 : 1, border: "1px solid #ddd", borderRadius: "6px", background: "#fff" }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountList;