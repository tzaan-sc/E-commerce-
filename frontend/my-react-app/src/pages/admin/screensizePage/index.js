import { toast } from 'react-toastify';
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
const ScreenSizePage = () => {
  const {
    data: sizes,
    loading,
    addItem: addSize,
    deleteItem: deleteSize,
    updateItem: updateSize,
  } = useGenericApi("screen-sizes");

  const [formData, setFormData] = useState({ value: "" });
  const [editingId, setEditingId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const formRef = useRef(null);

  const resetForm = () => {
    setFormData({ value: "" });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    const valueAsDouble = parseFloat(formData.value);
    if (isNaN(valueAsDouble) || valueAsDouble <= 0) {
      toast.info("Vui lòng nhập kích thước màn hình hợp lệ!");
      return;
    }
    const payload = { id: editingId, value: valueAsDouble };
    const fn = editingId ? updateSize(payload) : addSize(payload);
    const result = await fn;

    if (result.success) {
      toast.info(editingId ? "Cập nhật thành công!" : "Thêm mới thành công!");
      resetForm();
    } else {
      toast.error(result.error);
    }
  };

  const handleEdit = (item) => {
    setFormData({ value: item.value.toString() });
    setEditingId(item.id);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ✅ SỬA LOGIC XÓA 1
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa kích thước này?")) return;
    const result = await deleteSize(id);
    if (result.success) {
      toast.success("Xóa thành công!");
      setSelectedIds((prev) => prev.filter((x) => x !== id));
    } else {
      // 👇 Hiện lỗi chuẩn
      toast.error(result.error);
    }
  };

  // ✅ SỬA LOGIC XÓA NHIỀU
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      toast.info("Vui lòng chọn ít nhất một mục để xóa!");
      return;
    }
    if (
      !window.confirm(`Bạn có chắc muốn xóa ${selectedIds.length} mục đã chọn?`)
    )
      return;

    let hasError = false;
    for (const id of selectedIds) {
      const result = await deleteSize(id);
      if (!result.success) {
        toast.error(`Không thể xóa (ID: ${id}):\n${result.error}`);
        hasError = true;
        break;
      }
    }

    if (!hasError) {
      toast.success("Xóa tất cả thành công!");
      setSelectedIds([]);
    } else {
      setSelectedIds((prev) =>
        prev.filter((id) => sizes.find((s) => s.id === id))
      );
    }
  };

  const toggleSelect = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  const toggleSelectAll = () =>
    setSelectedIds((prev) =>
      sizes.length > 0 && prev.length === sizes.length
        ? []
        : sizes.map((x) => x.id)
    );

  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;

  return (
    <div className="page-card">
      <div ref={formRef} className="container mt-4 mb-4">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-primary text-white d-flex align-items-center justify-content-between">
            <h5 className="mb-0">
              {editingId ? " Chỉnh sửa kích thước" : " Thêm kích thước mới"}
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
                  type="number"
                  step="0.1"
                  className="form-control"
                  placeholder="VD: 15.6"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="text-center mt-4">
              <button className="btn btn-primary px-4" onClick={handleSubmit}>
                {editingId ? " Lưu thay đổi" : " Thêm kích thước"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="page-card__header">
        <h3 className="page-card__title">Danh sách kích thước</h3>
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
                    sizes.length > 0 && selectedIds.length === sizes.length
                  }
                  onChange={toggleSelectAll}
                  style={{ cursor: "pointer" }}
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
                    style={{ cursor: "pointer" }}
                  />
                </td>
                <td className="font-medium">{s.id}</td>
                <td>{s.value} inch</td>
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
        {sizes.length === 0 && !loading && (
          <p className="empty-message">Chưa có kích thước nào được thêm.</p>
        )}
      </div>
    </div>
  );
};
export default ScreenSizePage;
