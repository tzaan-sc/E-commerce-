import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Package,
  Search,
  X,
  History,
  ClipboardCheck,
  AlertCircle,
  FileText,
} from 'lucide-react';
import inventoryApi from '../../../../api/inventoryApi';
import variantApi from '../../../../api/variantApi';
import './style.scss';

const InventoryPage = () => {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- STATE QUẢN LÝ CÁC MODAL ---
  const [showImportModal, setShowImportModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);

  // --- STATE DỮ LIỆU ---
  // 1. Dữ liệu Nhập kho
  const [importData, setImportData] = useState({
    supplierName: '',
    note: '',
    items: [{ variantId: '', quantity: 1, importPrice: 0 }],
  });

  // 2. Dữ liệu Lịch sử (Đang xem của sản phẩm nào)
  const [historyData, setHistoryData] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // 3. Dữ liệu Kiểm kê
  const [adjustData, setAdjustData] = useState({
    variantId: '',
    actualQuantity: 0,
    reason: '',
  });

  // --- KHỞI TẠO ---
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await variantApi.getAll();
      setVariants(res.data);
    } catch (error) {
      console.error('Lỗi tải kho:', error);
    }
  };

  // =================================================================
  // CHỨC NĂNG 1: NHẬP KHO (IMPORT)
  // =================================================================
  const handleAddImportRow = () => {
    setImportData((prev) => ({
      ...prev,
      items: [...prev.items, { variantId: '', quantity: 1, importPrice: 0 }],
    }));
  };

  const handleRemoveImportRow = (index) => {
    if (importData.items.length === 1) return;
    const newItems = importData.items.filter((_, i) => i !== index);
    setImportData((prev) => ({ ...prev, items: newItems }));
  };

  const handleChangeImportRow = (index, field, value) => {
    const newItems = [...importData.items];
    newItems[index][field] = value;
    setImportData((prev) => ({ ...prev, items: newItems }));
  };

  const handleSubmitImport = async () => {
    if (!importData.supplierName) return alert('Thiếu tên Nhà cung cấp');
    try {
      setLoading(true);
      await inventoryApi.importGoods(importData);
      alert('Nhập kho thành công!');
      setShowImportModal(false);
      setImportData({
        supplierName: '',
        note: '',
        items: [{ variantId: '', quantity: 1, importPrice: 0 }],
      });
      fetchInventory();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Server Error'));
    } finally {
      setLoading(false);
    }
  };

  // =================================================================
  // CHỨC NĂNG 2: XEM LỊCH SỬ (HISTORY)
  // =================================================================
  const handleOpenHistory = async (variant) => {
    setSelectedVariant(variant);
    setShowHistoryModal(true);
    setHistoryData([]); // Reset cũ
    try {
      const res = await inventoryApi.getHistory(variant.id);
      setHistoryData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const translateType = (type) => {
    const map = {
      IMPORT: { text: 'Nhập hàng', class: 'success' },
      SALE: { text: 'Bán hàng', class: 'info' },
      RETURN: { text: 'Khách trả', class: 'warning' },
      ADJUSTMENT_UP: { text: 'Kiểm kê (Thừa)', class: 'primary' },
      ADJUSTMENT_DOWN: { text: 'Kiểm kê (Thiếu)', class: 'danger' },
    };
    return map[type] || { text: type, class: 'secondary' };
  };

  // =================================================================
  // CHỨC NĂNG 3: KIỂM KÊ / ĐIỀU CHỈNH (ADJUSTMENT)
  // =================================================================
  const handleOpenAdjust = (variant) => {
    setSelectedVariant(variant);
    setAdjustData({
      variantId: variant.id,
      actualQuantity: variant.stockQuantity || 0, // Mặc định là số tồn hiện tại
      reason: '',
    });
    setShowAdjustModal(true);
  };

  const handleSubmitAdjust = async () => {
    if (!adjustData.reason) return alert('Vui lòng nhập lý do kiểm kê!');

    // Kiểm tra xem có thay đổi không
    if (adjustData.actualQuantity === selectedVariant.stockQuantity) {
      return alert('Số lượng thực tế khớp với hệ thống. Không cần điều chỉnh.');
    }

    try {
      setLoading(true);
      await inventoryApi.adjustStock(adjustData);
      alert('Đã cân bằng kho thành công!');
      setShowAdjustModal(false);
      fetchInventory();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Server Error'));
    } finally {
      setLoading(false);
    }
  };

  // =================================================================
  // RENDER GIAO DIỆN
  // =================================================================
  return (
    <div className="page-card">
      <div className="page-card__header">
        <div className="header-title">
          <Package size={24} /> <h3>Quản lý Tồn kho</h3>
        </div>
        <button
          className="btn-primary"
          onClick={() => setShowImportModal(true)}
        >
          <Plus size={18} /> Lập Phiếu Nhập
        </button>
      </div>

      {/* BẢNG TỒN KHO CHÍNH */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Sản Phẩm</th>
              <th>Thuộc tính</th>
              <th>Tồn Kho</th>
              <th className="text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {variants.length > 0 ? (
              variants.map((v) => {
                const prodName = v.product
                  ? v.product.name
                  : v.productName || 'Sản phẩm...';
                return (
                  <tr key={v.id}>
                    <td className="sku-cell">{v.sku}</td>
                    <td>{prodName}</td>
                    <td>
                      <span className="attr-badge">
                        {v.attributesJson || '-'}
                      </span>
                    </td>
                    <td className="stock-cell">
                      <span
                        className={`status-dot ${
                          v.stockQuantity > 0 ? 'green' : 'red'
                        }`}
                      ></span>
                      {v.stockQuantity}
                    </td>
                    <td className="text-right">
                      <button
                        className="btn-icon"
                        title="Xem Lịch sử Giao dịch"
                        onClick={() => handleOpenHistory(v)}
                      >
                        <History size={18} color="#007bff" />
                      </button>
                      <button
                        className="btn-icon"
                        title="Kiểm kê / Điều chỉnh kho"
                        onClick={() => handleOpenAdjust(v)}
                        style={{ marginLeft: 10 }}
                      >
                        <ClipboardCheck size={18} color="#28a745" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  Chưa có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL 1: NHẬP KHO (IMPORT) --- */}
      {showImportModal && (
        <div className="modal-overlay">
          <div className="modal-container large">
            <div className="modal-header">
              <h2>Phiếu Nhập Kho</h2>
              <button
                className="close-btn"
                onClick={() => setShowImportModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div>
                  <label>Nhà cung cấp (*)</label>
                  <input
                    className="form-control"
                    value={importData.supplierName}
                    onChange={(e) =>
                      setImportData({
                        ...importData,
                        supplierName: e.target.value,
                      })
                    }
                    placeholder="VD: FPT Trading"
                  />
                </div>
                <div>
                  <label>Ghi chú</label>
                  <input
                    className="form-control"
                    value={importData.note}
                    onChange={(e) =>
                      setImportData({ ...importData, note: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="import-list">
                <table className="data-table small">
                  <thead>
                    <tr>
                      <th width="40%">Sản phẩm</th>
                      <th width="15%">Số lượng</th>
                      <th width="20%">Giá vốn</th>
                      <th width="20%">Thành tiền</th>
                      <th width="5%"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {importData.items.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <select
                            className="form-control"
                            value={item.variantId}
                            onChange={(e) =>
                              handleChangeImportRow(
                                index,
                                'variantId',
                                e.target.value
                              )
                            }
                          >
                            <option value="">-- Chọn SKU --</option>
                            {variants.map((v) => (
                              <option key={v.id} value={v.id}>
                                {v.sku} - {v.productName || v.product?.name} (
                                {v.attributesJson})
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            min="1"
                            className="form-control"
                            value={item.quantity}
                            onChange={(e) =>
                              handleChangeImportRow(
                                index,
                                'quantity',
                                parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            className="form-control"
                            value={item.importPrice}
                            onChange={(e) =>
                              handleChangeImportRow(
                                index,
                                'importPrice',
                                parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </td>
                        <td>
                          {new Intl.NumberFormat('vi-VN').format(
                            item.quantity * item.importPrice
                          )}
                        </td>
                        <td>
                          <button
                            onClick={() => handleRemoveImportRow(index)}
                            className="btn-icon delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                className="btn-secondary"
                onClick={handleAddImportRow}
                style={{ marginTop: 10 }}
              >
                + Thêm dòng
              </button>
            </div>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowImportModal(false)}
              >
                Hủy
              </button>
              <button
                className="btn-submit"
                onClick={handleSubmitImport}
                disabled={loading}
              >
                {loading ? 'Đang lưu...' : 'Lưu & Nhập Kho'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: LỊCH SỬ (HISTORY) --- */}
      {showHistoryModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>
                Thẻ kho:{' '}
                <span style={{ color: '#007bff' }}>{selectedVariant?.sku}</span>
              </h2>
              <button
                className="close-btn"
                onClick={() => setShowHistoryModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body scrollable">
              {historyData.length === 0 ? (
                <div className="empty-state">Chưa có giao dịch nào</div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Thời gian</th>
                      <th>Loại GD</th>
                      <th>Thay đổi</th>
                      <th>Tồn cuối</th>
                      <th>Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyData.map((h, i) => {
                      const typeInfo = translateType(h.type);
                      return (
                        <tr key={i}>
                          <td>
                            {new Date(h.createdAt).toLocaleString('vi-VN')}
                          </td>
                          <td>
                            <span className={`badge ${typeInfo.class}`}>
                              {typeInfo.text}
                            </span>
                          </td>
                          <td
                            style={{
                              color: h.quantityChange > 0 ? 'green' : 'red',
                              fontWeight: 'bold',
                            }}
                          >
                            {h.quantityChange > 0 ? '+' : ''}
                            {h.quantityChange}
                          </td>
                          <td style={{ fontWeight: 'bold' }}>
                            {h.balanceAfter}
                          </td>
                          <td style={{ fontSize: '13px', color: '#666' }}>
                            {h.note}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 3: KIỂM KÊ (ADJUSTMENT) --- */}
      {showAdjustModal && (
        <div className="modal-overlay">
          <div className="modal-container small">
            <div className="modal-header">
              <h2>Kiểm kê kho</h2>
              <button
                className="close-btn"
                onClick={() => setShowAdjustModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="info-box">
                <AlertCircle size={20} className="icon" />
                <p>
                  Bạn đang điều chỉnh kho cho SKU:{' '}
                  <strong>{selectedVariant?.sku}</strong>
                </p>
              </div>

              <div className="form-group" style={{ marginTop: 20 }}>
                <label>Tồn kho trên hệ thống:</label>
                <input
                  className="form-control"
                  disabled
                  value={selectedVariant?.stockQuantity}
                />
              </div>

              <div className="form-group">
                <label>Số lượng thực tế kiểm đếm (*):</label>
                <input
                  type="number"
                  className="form-control"
                  style={{
                    fontWeight: 'bold',
                    fontSize: '16px',
                    color: '#28a745',
                  }}
                  value={adjustData.actualQuantity}
                  onChange={(e) =>
                    setAdjustData({
                      ...adjustData,
                      actualQuantity: parseInt(e.target.value) || 0,
                    })
                  }
                />
                <small
                  style={{
                    color:
                      adjustData.actualQuantity !==
                      selectedVariant?.stockQuantity
                        ? 'red'
                        : '#666',
                  }}
                >
                  Chênh lệch:{' '}
                  {adjustData.actualQuantity -
                    (selectedVariant?.stockQuantity || 0)}
                </small>
              </div>

              <div className="form-group">
                <label>Lý do chênh lệch (*):</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="VD: Hàng vỡ khi vận chuyển, Thất lạc, Tìm thấy kho cũ..."
                  value={adjustData.reason}
                  onChange={(e) =>
                    setAdjustData({ ...adjustData, reason: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowAdjustModal(false)}
              >
                Hủy
              </button>
              <button
                className="btn-submit"
                onClick={handleSubmitAdjust}
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận Cân bằng'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
