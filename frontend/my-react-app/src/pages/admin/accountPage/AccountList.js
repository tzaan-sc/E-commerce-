import React from "react";
import { Edit, ChevronLeft, ChevronRight } from "lucide-react";

const AccountList = ({ accounts, currentPage, totalPages, onPageChange, onEdit }) => {
  
  // Hàm trung tâm để xử lý hiển thị Role
  const getRoleBadge = (role) => {
    const r = role ? role.toUpperCase() : "";
    switch (r) {
      case "ADMIN": 
        return { text: "Admin", css: "badge--purple" };
      case "STAFF": 
        return { text: "Nhân viên", css: "badge--danger" }; // Đã thêm Staff
      case "CUSTOMER": 
        return { text: "Khách hàng", css: "badge--info" };
      default: 
        return { text: role, css: "badge--info" };
    }
  };

  return (
    <div className="table-container">
      <table className="data-table" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f8f9fa", textAlign: "left", color: "#495057", height: "50px" }}>
            <th style={{ padding: "12px", width: "50px" }}>ID</th>
            <th style={{ padding: "12px" }}>Tên</th>
            <th style={{ padding: "12px" }}>Email</th>
            <th style={{ padding: "12px", width: "130px" }}>Vai trò</th>
            <th style={{ padding: "12px", width: "120px" }}>Trạng thái</th>
            <th style={{ padding: "12px", width: "80px", textAlign: "center" }}>Sửa</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => {
            const roleData = getRoleBadge(account.role);
            return (
              <tr key={account.id} style={{ borderBottom: "1px solid #eee", height: "60px" }}>
                <td style={{ padding: "12px" }}>{account.id}</td>
                <td style={{ padding: "12px", fontWeight: "500" }}>{account.username}</td>
                <td style={{ padding: "12px" }}>{account.email}</td>
                <td style={{ padding: "12px" }}>
                  <span className={`badge ${roleData.css}`} style={{ padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>
                    {roleData.text}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>
                  <span className={`badge ${account.status === "Hoạt động" ? "badge--success" : "badge--danger"}`} style={{ padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>
                    {account.status}
                  </span>
                </td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  <button onClick={() => onEdit(account)} style={{ background: "#e3f2fd", color: "#1976d2", border: "none", padding: "8px", borderRadius: "50%", cursor: "pointer" }}>
                    <Edit size={18} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Pagination code giữ nguyên của bạn */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", padding: "20px" }}>
          <button onClick={() => onPageChange(Math.max(currentPage - 1, 1))} disabled={currentPage === 1} style={{ padding: "6px", cursor: "pointer" }}>
            <ChevronLeft size={20} />
          </button>
          <span style={{ fontSize: "14px", fontWeight: "600" }}>Trang {currentPage} / {totalPages}</span>
          <button onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages} style={{ padding: "6px", cursor: "pointer" }}>
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountList;