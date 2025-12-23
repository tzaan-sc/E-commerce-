import React, { useState, useEffect, useRef,useMemo } from 'react';
// import axios from 'axios'; // You can remove axios if you use apiClient
import apiClient from "../../../api/axiosConfig"; // 👈 FIXED IMPORT PATH
import ImportProductModal from '../../../components/page/ImportProductModal';
import ProductsPage from '../ProductsPage';
import { Save,Upload } from 'lucide-react';
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
   ChevronLeft, ChevronRight, UploadCloud,FileSpreadsheet
} from 'lucide-react';
import useGenericApi from 'hooks/useGenericApi';
import '../style.scss';

const ScreenSizePage = () => {
  // 👈 Sử dụng useGenericApi với resource name là 'screen-sizes'
  const {
    data: sizes, // Đổi tên 'data' thành 'sizes'
    loading,
    error,
    addItem: addSize,
    deleteItem: deleteSize,
    updateItem: updateSize,
  } = useGenericApi('screen-sizes'); // endpoint: /api/screen-sizes

  const [formData, setFormData] = useState({ value: '' }); // Thay 'name' bằng 'value'
  const [editingId, setEditingId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const formRef = useRef(null);

  const resetForm = () => {
    setFormData({ value: '' });
    setEditingId(null);
  };

  // Xử lý thêm/sửa kích thước
  const handleSubmit = async () => {
    const valueAsDouble = parseFloat(formData.value); // Chuyển đổi sang số thực

    if (isNaN(valueAsDouble) || valueAsDouble <= 0) {
      alert('Vui lòng nhập kích thước màn hình hợp lệ (là số dương)!');
      return;
    }

    const payload = {
      id: editingId, // Chỉ cần cho PUT
      value: valueAsDouble,
    };

    const fn = editingId ? updateSize(payload) : addSize(payload); // Truyền payload
    const result = await fn;

    if (result.success) {
      alert(
        editingId
          ? 'Cập nhật kích thước thành công!'
          : 'Thêm kích thước thành công!'
      );
      resetForm();
    } else {
      alert(`${editingId ? 'Cập nhật' : 'Thêm'} thất bại: ${result.error}`);
    }
  };

  // Xử lý sửa - đổ dữ liệu lên form
  const handleEdit = (item) => {
    setFormData({ value: item.value.toString() }); // Chuyển Double về String cho input
    setEditingId(item.id);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Xử lý xóa một kích thước
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa kích thước này?')) return;
    const result = await deleteSize(id);
    if (result.success) {
      alert('Xóa thành công!');
      setSelectedIds((prev) => prev.filter((x) => x !== id));
    } else {
      alert(`Xóa thất bại: ${result.error}`);
    }
  };

  // Xử lý xóa nhiều kích thước
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert('Vui lòng chọn ít nhất một mục để xóa!');
      return;
    }

    if (
      !window.confirm(`Bạn có chắc muốn xóa ${selectedIds.length} mục đã chọn?`)
    )
      return;

    // Xóa từng mục một
    for (const id of selectedIds) {
      await deleteSize(id);
    }

    alert('Xóa các kích thước thành công!');
    setSelectedIds([]);
  };

  // Toggle chọn một kích thước
  const toggleSelect = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  // Toggle chọn tất cả
  const toggleSelectAll = () =>
    setSelectedIds((prev) =>
      sizes.length > 0 && prev.length === sizes.length
        ? []
        : sizes.map((x) => x.id)
    );

  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;

  // Hàm hiển thị tên kích thước (kết hợp với 'inch')
  const formatSizeName = (value) => {
    return `${value} inch`;
  };

  return (
    <div className="page-card">
      {/* FORM THÊM/SỬA */}
      <div ref={formRef} className="container mt-4 mb-4">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-primary text-white d-flex align-items-center justify-content-between">
            <h5 className="mb-0">
              {editingId
                ? '✏️ Chỉnh sửa kích thước màn hình'
                : '➕ Thêm kích thước màn hình mới'}
            </h5>
            {editingId && (
              <button className="btn btn-light btn-sm" onClick={resetForm}>
                Hủy
              </button>
            )}
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-12">
                <label className="form-label fw-semibold">Giá trị (inch)</label>
                <input
                  type="number" // Đổi sang type number
                  step="0.1"
                  className="form-control"
                  placeholder="VD: 13.3, 15.6, 17.0..."
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="text-center mt-4">
              <button className="btn btn-primary px-4" onClick={handleSubmit}>
                {editingId ? '💾 Lưu thay đổi' : '➕ Thêm kích thước'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DANH SÁCH */}
      <div className="page-card__header">
        <h3 className="page-card__title">Danh sách kích thước màn hình</h3>
        {selectedIds.length > 0 && (
          <button className="btn btn-danger" onClick={handleDeleteSelected}>
            <Trash2 size={20} /> Xóa đã chọn ({selectedIds.length})
          </button>
        )}
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}>
                <input
                  type="checkbox"
                  checked={
                    sizes.length > 0 && selectedIds.length === sizes.length
                  }
                  onChange={toggleSelectAll}
                  style={{ cursor: 'pointer' }}
                />
              </th>
              <th>ID</th>
              <th>Kích thước</th>
              <th>Số sản phẩm</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((s) => (
              <tr key={s.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(s.id)}
                    onChange={() => toggleSelect(s.id)}
                    style={{ cursor: 'pointer' }}
                  />
                </td>
                <td className="font-medium">{s.id}</td>
                <td>{formatSizeName(s.value)}</td> {/* Hiển thị giá trị */}
                <td>{s.productCount}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn action-btn--edit"
                      onClick={() => handleEdit(s)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="action-btn action-btn--delete"
                      onClick={() => handleDelete(s.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sizes.length === 0 && (
          <p className="empty-message">Chưa có kích thước nào được thêm.</p>
        )}
      </div>
    </div>
  );
};
export default ScreenSizePage;