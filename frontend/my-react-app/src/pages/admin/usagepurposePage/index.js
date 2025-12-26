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
const UsagePurposePage = () => {
  const {
    data: purposes,
    loading,
    addItem: addPurpose,
    deleteItem: deletePurpose,
    updateItem: updatePurpose,
  } = useGenericApi("usage-purposes");

  const [formData, setFormData] = useState({ name: "" });
  const [editingId, setEditingId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const formRef = useRef(null);

  const resetForm = () => {
    setFormData({ name: "" });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên nhu cầu sử dụng!");
      return;
    }
    const payload = editingId ? { id: editingId, ...formData } : formData;
    const fn = editingId ? updatePurpose(payload) : addPurpose(formData);
    const result = await fn;

    if (result.success) {
      alert(editingId ? "Cập nhật thành công!" : "Thêm mới thành công!");
      resetForm();
    } else {
      // 👇 Hiển thị lỗi chuẩn từ Backend
      alert(result.error);
    }
  };

  const handleEdit = (item) => {
    setFormData({ name: item.name });
    setEditingId(item.id);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ✅ SỬA LOGIC XÓA 1
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa nhu cầu này?")) return;
    const result = await deletePurpose(id);
    if (result.success) {
      alert("Xóa thành công!");
      setSelectedIds((prev) => prev.filter((x) => x !== id));
    } else {
      // 👇 Hiển thị lỗi chuẩn
      alert(result.error);
    }
  };

  // ✅ SỬA LOGIC XÓA NHIỀU
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert("Vui lòng chọn ít nhất một mục để xóa!");
      return;
    }
    if (
      !window.confirm(`Bạn có chắc muốn xóa ${selectedIds.length} mục đã chọn?`)
    )
      return;

    let hasError = false;
    for (const id of selectedIds) {
      const result = await deletePurpose(id);
      if (!result.success) {
        alert(`Không thể xóa (ID: ${id}):\n${result.error}`);
        hasError = true;
        break;
      }
    }

    if (!hasError) {
      alert("Xóa tất cả thành công!");
      setSelectedIds([]);
    } else {
      // Clear những ID đã xóa thành công khỏi danh sách chọn
      setSelectedIds((prev) =>
        prev.filter((id) => purposes.find((p) => p.id === id))
      );
    }
  };

  const toggleSelect = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  const toggleSelectAll = () =>
    setSelectedIds((prev) =>
      purposes.length > 0 && prev.length === purposes.length
        ? []
        : purposes.map((x) => x.id)
    );

  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;

  return (
    <div className="page-card">
      <div ref={formRef} className="container mt-4 mb-4">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-primary text-white d-flex align-items-center justify-content-between">
            <h5 className="mb-0">
              {editingId ? " Chỉnh sửa nhu cầu" : " Thêm nhu cầu mới"}
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
                <label className="form-label fw-semibold">Tên nhu cầu</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="VD: Gaming, Văn phòng..."
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="text-center mt-4">
              <button className="btn btn-primary px-4" onClick={handleSubmit}>
                {editingId ? " Lưu thay đổi" : " Thêm nhu cầu"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="page-card__header">
        <h3 className="page-card__title">Danh sách nhu cầu sử dụng</h3>
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
              <th style={{ width: "50px" }}>
                <input
                  type="checkbox"
                  checked={
                    purposes.length > 0 &&
                    selectedIds.length === purposes.length
                  }
                  onChange={toggleSelectAll}
                  style={{ cursor: "pointer" }}
                />
              </th>
              <th>ID</th>
              <th>Tên nhu cầu</th>
              <th>Số sản phẩm</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {purposes.map((p) => (
              <tr key={p.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(p.id)}
                    onChange={() => toggleSelect(p.id)}
                    style={{ cursor: "pointer" }}
                  />
                </td>
                <td className="font-medium">{p.id}</td>
                <td>{p.name}</td>
                <td>{p.productCount}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn action-btn--edit"
                      onClick={() => handleEdit(p)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="action-btn action-btn--delete"
                      onClick={() => handleDelete(p.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {purposes.length === 0 && !loading && (
          <p className="empty-message">Chưa có nhu cầu nào được thêm.</p>
        )}
      </div>
    </div>
  );
};
export default UsagePurposePage;