import React, { useState, useEffect, useRef, useMemo } from 'react';
// import axios from 'axios'; // You can remove axios if you use apiClient
import apiClient from '../../../api/axiosConfig'; // 👈 FIXED IMPORT PATH
import ImportProductModal from '../../../components/page/ImportProductModal';
import ProductsPage from '../ProductsPage';
import { Save, Upload } from 'lucide-react';
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
  FileSpreadsheet,
} from 'lucide-react';
import useGenericApi from 'hooks/useGenericApi';
import '../style.scss';

const BrandsPage = () => {
  const {
    data: brands,
    loading,
    error,
    addItem: addBrand,
    deleteItem: deleteBrand,
    updateItem: updateBrand,
  } = useGenericApi('brands');

  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const formRef = useRef(null);

  // Reset form
  const resetForm = () => {
    setFormData({ name: '', logoUrl: '' });
    setEditingId(null);
  };

  // Xử lý thêm/sửa thương hiệu
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên thương hiệu!');
      return;
    }

    if (editingId) {
      // Cập nhật
      // BrandsPage: Gộp ID và FormData thành một object
      const payload = { id: editingId, ...formData };
      const result = await updateBrand(payload);
      if (result.success) {
        alert('Cập nhật thương hiệu thành công!');
        resetForm();
      } else {
        alert(`Cập nhật thất bại: ${result.error}`);
      }
    } else {
      // Thêm mới
      const result = await addBrand(formData);
      if (result.success) {
        alert('Thêm thương hiệu thành công!');
        resetForm();
      } else {
        alert(`Thêm thất bại: ${result.error}`);
      }
    }
  };

  // Xử lý sửa - đổ dữ liệu lên form
  const handleEditBrand = (brand) => {
    setFormData({ name: brand.name, logoUrl: brand.logoUrl });
    setEditingId(brand.id);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Xử lý xóa một thương hiệu
  const handleDeleteBrand = async (brandId) => {
    if (window.confirm('Bạn có chắc muốn xóa thương hiệu này?')) {
      const result = await deleteBrand(brandId);
      if (result.success) {
        alert('Xóa thương hiệu thành công!');
        setSelectedBrands(selectedBrands.filter((id) => id !== brandId));
      } else {
        alert(`Xóa thất bại: ${result.error}`);
      }
    }
  };

  // Xử lý xóa nhiều thương hiệu
  const handleDeleteSelected = async () => {
    if (selectedBrands.length === 0) {
      alert('Vui lòng chọn ít nhất một thương hiệu để xóa!');
      return;
    }

    if (
      window.confirm(
        `Bạn có chắc muốn xóa ${selectedBrands.length} thương hiệu đã chọn?`
      )
    ) {
      for (const brandId of selectedBrands) {
        await deleteBrand(brandId);
      }
      alert('Xóa các thương hiệu thành công!');
      setSelectedBrands([]);
    }
  };

  // Toggle chọn một thương hiệu
  const toggleSelectBrand = (brandId) => {
    if (selectedBrands.includes(brandId)) {
      setSelectedBrands(selectedBrands.filter((id) => id !== brandId));
    } else {
      setSelectedBrands([...selectedBrands, brandId]);
    }
  };

  // Toggle chọn tất cả
  const toggleSelectAll = () => {
    if (selectedBrands.length === brands.length) {
      setSelectedBrands([]);
    } else {
      setSelectedBrands(brands.map((b) => b.id));
    }
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }
  if (error) {
    return <div className="error">Lỗi: {error}</div>;
  }

  return (
    <div className="page-card">
      {/* FORM THÊM/SỬA */}
      <div ref={formRef} className="container mt-4 mb-4">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-primary text-white d-flex align-items-center justify-content-between">
            <h5 className="mb-0">
              {editingId
                ? '✏️ Chỉnh sửa thương hiệu'
                : '➕ Thêm thương hiệu mới'}
            </h5>
            {editingId && (
              <button className="btn btn-light btn-sm" onClick={resetForm}>
                Hủy
              </button>
            )}
          </div>

          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Tên thương hiệu
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập tên thương hiệu"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">URL Logo</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập URL logo"
                  value={formData.logoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, logoUrl: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="text-center mt-4">
              <button className="btn btn-primary px-4" onClick={handleSubmit}>
                {editingId ? '💾 Lưu thay đổi' : '➕ Thêm thương hiệu'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DANH SÁCH THƯƠNG HIỆU */}
      <div className="page-card__header">
        <h3 className="page-card__title">Danh sách thương hiệu</h3>
        {selectedBrands.length > 0 && (
          <button className="btn btn-danger" onClick={handleDeleteSelected}>
            <Trash2 size={20} />
            Xóa đã chọn ({selectedBrands.length})
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
                    brands.length > 0 && selectedBrands.length === brands.length
                  }
                  onChange={toggleSelectAll}
                  style={{ cursor: 'pointer' }}
                />
              </th>
              <th>ID</th>
              <th>Tên thương hiệu</th>
              <th>Logo</th>
              <th>Số sản phẩm</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand.id)}
                    onChange={() => toggleSelectBrand(brand.id)}
                    style={{ cursor: 'pointer' }}
                  />
                </td>
                <td className="font-medium">{brand.id}</td>
                <td>{brand.name}</td>
                <td>
                  <img
                    src={
                      brand.logoUrl
                        ? brand.logoUrl.startsWith('http')
                          ? brand.logoUrl
                          : `http://localhost:8080${brand.logoUrl}`
                        : 'https://via.placeholder.com/40' // Ảnh mặc định nếu không có logo
                    }
                    alt={brand.name}
                    className="brand-logo-thumbnail"
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'contain',
                      border: '1px solid #eee',
                    }}
                    // Thêm xử lý lỗi ảnh nếu link chết
                    onError={(e) => {
                      e.target.src =
                        'https://via.placeholder.com/40?text=Error';
                    }}
                  />
                </td>
                <td>{brand.productCount}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn action-btn--edit"
                      onClick={() => handleEditBrand(brand)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="action-btn action-btn--delete"
                      onClick={() => handleDeleteBrand(brand.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {brands.length === 0 && !loading && (
          <p className="empty-message">Chưa có thương hiệu nào được thêm.</p>
        )}
      </div>
    </div>
  );
};
export default BrandsPage;
