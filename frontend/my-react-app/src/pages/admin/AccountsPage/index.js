import React, { useState, useEffect, useRef,useMemo } from 'react';
import {
  Edit,
   ChevronLeft, ChevronRight
} from 'lucide-react';
import '../style.scss';

const AccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAccount, setEditingAccount] = useState(null);
  const [newAccount, setNewAccount] = useState({
    username: '',
    email: '',
    role: 'Khách hàng',
    status: 'Hoạt động',
  });

  // 👇 2. STATE PHÂN TRANG
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Số tài khoản mỗi trang

  const formRef = useRef(null);
  const API_BASE = "http://localhost:8080/api/users"; // Đảm bảo đường dẫn API đúng

  // ================== LẤY DANH SÁCH TÀI KHOẢN ==================
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE);
      const data = await response.json();

      // Map dữ liệu từ backend
      const mappedData = data.map((acc) => ({
        id: acc.id,
        username: acc.username,
        email: acc.email,
        role: acc.role === 'ADMIN' ? 'Admin' : 'Khách hàng',
        status: acc.active ? 'Hoạt động' : 'Khóa',
      }));

      setAccounts(mappedData);
    } catch (error) {
      console.error('Lỗi tải tài khoản:', error);
    } finally {
      setLoading(false);
    }
  };

  // ================== XỬ LÝ THÊM TÀI KHOẢN ==================
  const handleAddAccount = async () => {
    const userPayload = {
      username: newAccount.username,
      email: newAccount.email,
      password: '123456',
      role: newAccount.role === 'Admin' ? 'ADMIN' : 'CUSTOMER',
      active: newAccount.status === 'Hoạt động',
    };

    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload),
      });

      if (response.ok) {
        await fetchAccounts();
        setNewAccount({
          username: '',
          email: '',
          role: 'Khách hàng',
          status: 'Hoạt động',
        });
        alert('Thêm tài khoản thành công!');
      } else {
        alert('Lỗi khi thêm tài khoản!');
      }
    } catch (error) {
      console.error('Error adding account:', error);
    }
  };

  // ================== XỬ LÝ SỬA TÀI KHOẢN ==================
  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setNewAccount({ ...account });
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUpdateAccount = async () => {
    const userPayload = {
      username: newAccount.username,
      email: newAccount.email,
      role: newAccount.role === 'Admin' ? 'ADMIN' : 'CUSTOMER',
      active: newAccount.status === 'Hoạt động',
    };

    try {
      const response = await fetch(`${API_BASE}/${editingAccount.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload),
      });

      if (response.ok) {
        await fetchAccounts();
        setEditingAccount(null);
        setNewAccount({
          username: '',
          email: '',
          role: 'Khách hàng',
          status: 'Hoạt động',
        });
        alert('Cập nhật tài khoản thành công!');
      } else {
        alert('Lỗi khi cập nhật tài khoản!');
      }
    } catch (error) {
      console.error('Error updating account:', error);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 👇 3. LOGIC TÍNH TOÁN PHÂN TRANG
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAccounts = accounts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(accounts.length / itemsPerPage);

  // if (loading) return <div className="loading">Đang tải dữ liệu...</div>;

  return (
    <div className="page-card">
      {/* ======= HEADER ======= */}
      <div className="page-card__header">
        <h3 className="page-card__title">Quản lý tài khoản</h3>
        <button className="btn btn-primary" onClick={scrollToForm}>
          Thêm tài khoản
        </button>
      </div>

      {/* ======= BẢNG DỮ LIỆU ======= */}
      <div className="table-container">
        <table className="data-table" style={{width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed'}}>
          <thead>
            <tr style={{background: '#f4f4f4', height: '50px', textAlign: 'left'}}>
              <th style={{width: '50px', padding: '10px'}}>ID</th>
              <th style={{padding: '10px'}}>Tên</th>
              <th style={{padding: '10px'}}>Email</th>
              <th style={{width: '120px', padding: '10px'}}>Vai trò</th>
              <th style={{width: '120px', padding: '10px'}}>Trạng thái</th>
              <th style={{width: '100px', padding: '10px'}}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {/* 👇 Render currentAccounts thay vì accounts */}
            {currentAccounts.map((account) => (
              <tr key={account.id} style={{height: '60px', borderBottom: '1px solid #eee'}}>
                <td style={{padding: '10px'}}>{account.id}</td>
                <td className="font-medium" style={{padding: '10px'}}>{account.username}</td>
                <td style={{padding: '10px'}}>{account.email}</td>
                <td style={{padding: '10px'}}>
                  <span
                    className={`badge ${
                      account.role === 'Admin'
                        ? 'badge--purple text-dark'
                        : 'badge--info text-dark'
                    }`}
                  >
                    {account.role}
                  </span>
                </td>
                <td style={{padding: '10px'}}>
                  <span
                    className={`badge ${
                      account.status === 'Hoạt động'
                        ? 'badge--success text-dark'
                        : 'badge--danger text-dark'
                    }`}
                  >
                    {account.status}
                  </span>
                </td>
                <td style={{padding: '10px'}}>
                  <div className="action-buttons text-center">
                    <button
                      className="action-btn action-btn--edit"
                      onClick={() => handleEditAccount(account)}
                    >
                      <Edit size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* 👇 4. UI PHÂN TRANG */}
        {totalPages > 1 && (
            <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', padding: '20px' }}>
                <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    style={{ padding: '5px 10px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1, border: '1px solid #ddd', borderRadius: '4px', background: '#fff' }}
                >
                    <ChevronLeft size={20} />
                </button>
                
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Trang {currentPage} / {totalPages}</span>

                <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    style={{ padding: '5px 10px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1, border: '1px solid #ddd', borderRadius: '4px', background: '#fff' }}
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        )}
      </div>

      {/* ======= FORM THÊM / SỬA ======= */}
      <div ref={formRef} className="container mt-4">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-primary text-white d-flex align-items-center justify-content-between">
            <h5 className="mb-0">
              {editingAccount ? ' Chỉnh sửa tài khoản' : ' Thêm tài khoản mới'}
            </h5>
            {editingAccount && (
              <button
                className="btn btn-light btn-sm"
                onClick={() => {
                  setEditingAccount(null);
                  setNewAccount({
                    username: '',
                    email: '',
                    role: 'Khách hàng',
                    status: 'Hoạt động',
                  });
                }}
              >
                Hủy
              </button>
            )}
          </div>

          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Tên người dùng</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập tên người dùng"
                  value={newAccount.username}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, username: e.target.value })
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Nhập email"
                  value={newAccount.email}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, email: e.target.value })
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Vai trò</label>
                <select
                  className="form-select"
                  value={newAccount.role}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, role: e.target.value })
                  }
                >
                  <option value="Khách hàng">Khách hàng</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Trạng thái</label>
                <select
                  className="form-select"
                  value={newAccount.status}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, status: e.target.value })
                  }
                >
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Khóa">Khóa</option>
                </select>
              </div>
            </div>

            <div className="text-center mt-4">
              {editingAccount ? (
                <button
                  className="btn btn-primary px-4 me-2"
                  onClick={handleUpdateAccount}
                >
                  <i className="bi bi-save"></i> Lưu thay đổi
                </button>
              ) : (
                <button
                  className="btn btn-primary px-4"
                  onClick={handleAddAccount}
                >
                  <i className="bi bi-person-plus"></i> Thêm tài khoản
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AccountsPage;