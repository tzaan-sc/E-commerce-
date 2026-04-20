import { toast } from 'react-toastify';
// src/pages/admin/accountsPage/index.js
import React, { useState, useEffect } from "react";
import AccountList from "./AccountList";
import AccountEditModal from "./AccountEditModal";

const AccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAccount, setEditingAccount] = useState(null);

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

  const handleUpdateAccount = async (updatedFormData) => {
    const userPayload = {
      username: updatedFormData.username,
      email: updatedFormData.email,
      role: updatedFormData.role === "Admin" ? "ADMIN" : "CUSTOMER",
      active: updatedFormData.status === "Hoạt động",
    };

    try {
      const response = await fetch(`${API_BASE}/${updatedFormData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPayload),
      });

      if (response.ok) {
        await fetchAccounts();
        setEditingAccount(null);
        toast.success("Cập nhật tài khoản thành công!");
      } else {
        toast.error("Lỗi khi cập nhật tài khoản!");
      }
    } catch (error) {
      console.error("Error updating account:", error);
      toast.error("Lỗi mạng khi cập nhật tài khoản!");
    }
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

      {loading ? (
        <div style={{ padding: "20px", textAlign: "center" }}>Đang tải...</div>
      ) : (
        <AccountList
          accounts={currentAccounts}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onEdit={setEditingAccount}
        />
      )}

      {editingAccount && (
        <AccountEditModal
          account={editingAccount}
          onClose={() => setEditingAccount(null)}
          onSave={handleUpdateAccount}
        />
      )}
    </div>
  );
};

export default AccountsPage;
