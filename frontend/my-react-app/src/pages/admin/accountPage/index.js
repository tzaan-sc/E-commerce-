import React, { useState, useEffect } from "react";
import AccountList from "./AccountList";
import AccountEditModal from "./AccountEditModal";
import apiClient from "../../../api/axiosConfig";
import { toast } from 'react-toastify';

const AccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAccount, setEditingAccount] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/users");
      // GIỮ NGUYÊN role từ Backend trả về (ADMIN, STAFF, CUSTOMER)
      const mappedData = response.data.map((acc) => ({
        id: acc.id,
        username: acc.username,
        email: acc.email,
        role: acc.role, 
        status: acc.active ? "Hoạt động" : "Khóa",
      }));
      setAccounts(mappedData);
    } catch (error) {
      console.error("Lỗi tải tài khoản:", error);
      toast.error("Không thể tải danh sách tài khoản");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAccount = async (updatedFormData) => {
    // Payload gửi lên server phải đúng Enum chữ hoa
    const userPayload = {
      username: updatedFormData.username,
      email: updatedFormData.email,
      role: updatedFormData.role, 
      active: updatedFormData.status === "Hoạt động",
    };

    try {
      const response = await apiClient.put(`/users/${updatedFormData.id}`, userPayload);
      if (response.status === 200 || response.status === 204) {
        await fetchAccounts(); 
        setEditingAccount(null);
        toast.success("Cập nhật tài khoản thành công!");
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật tài khoản!");
    }
  };

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