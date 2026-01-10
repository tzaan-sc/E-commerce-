import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Package, Search, ChevronRight, AlertTriangle,
  History, ClipboardCheck, Filter, Download, X, Save, Image as ImageIcon, 
  PlusCircle, Trash2, CheckCircle, FileUp, Eye, EyeOff, AlertCircle,
  ChevronLeft, ChevronDown
} from "lucide-react";
import variantApi from "../../../../api/variantApi";
import inventoryApi from "../../../../api/inventoryApi"; 
import "./style.scss";

const InventoryPage = () => {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL"); 
  const fileInputRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef(null);

  const BASE_URL = "http://localhost:8080"; 

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false); 
  
  const [showPreviewModal, setShowPreviewModal] = useState(false); 
  const [previewData, setPreviewData] = useState([]); 
  const [showBlindStock, setShowBlindStock] = useState(false); 

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null); 
  
  const [historyData, setHistoryData] = useState([]); 
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [auditQuantity, setAuditQuantity] = useState(0);
  const [auditReason, setAuditReason] = useState("");
  const [importSearch, setImportSearch] = useState("");
  const [importCart, setImportCart] = useState([]); 
  const [importNote, setImportNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await variantApi.getAll();
      const realData = Array.isArray(res.data) ? res.data : [];
      setVariants(realData.sort((a, b) => a.productId - b.productId));
    } catch (error) {
      console.error("Lỗi tải kho:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async (type, variantId = null) => {
    try {
      setIsSubmitting(true);
      const res = await inventoryApi.exportReport({ type, variantId }); 
      
      const fileNameMap = {
        'SUMMARY': `Bao_cao_tong_hop_${new Date().toLocaleDateString()}.xlsx`,
        'STOCK_CARD_ALL': `Tat_ca_the_kho_${new Date().toLocaleDateString()}.xlsx`,
        'STOCK_CARD_SINGLE': `The_kho_${selectedVariant?.sku || 'SKU'}.xlsx`
      };

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileNameMap[type] || 'export.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      setShowExportMenu(false);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      alert("Lỗi xuất file: " + errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImportFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      setIsSubmitting(true);
      const res = await inventoryApi.dryRunImport(formData); 
      setPreviewData(res.data || []);
      setShowPreviewModal(true); 
    } catch (error) {
      const errorMsg = error.response?.data?.message || "File không đúng định dạng hoặc bị lỗi.";
      alert("Lỗi đọc file: " + errorMsg);
    } finally {
      setIsSubmitting(false);
      e.target.value = null; 
    }
  };

  const confirmBulkImport = async () => {
    const validItems = previewData.filter(i => i.isValid);
    if (validItems.length === 0) return alert("Không có dữ liệu hợp lệ để nhập!");
    try {
      setIsSubmitting(true);
      await inventoryApi.bulkImport(validItems);
      alert(`Thành công! Đã cập nhật kho cho ${validItems.length} dòng hàng.`);
      setShowPreviewModal(false);
      fetchInventory();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      alert("Lỗi nhập hàng loạt: " + errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStockStatus = (quantity) => {
    if (quantity <= 0) return <span className="status-label out-of-stock">Hết hàng</span>;
    if (quantity < 5) return <span className="status-label low-stock">Sắp hết</span>;
    return <span className="status-label in-stock">Sẵn sàng</span>;
  };

  const renderAttributes = (v) => {
    return (
      <div className="attrs-row">
        {v.ramCapacity && (
          <span className="attr-tag"><small>RAM:</small> <strong>{v.ramCapacity}</strong></span>
        )}
        {v.storageCapacity && (
          <span className="attr-tag"><small>SSD:</small> <strong>{v.storageCapacity}</strong></span>
        )}
        {v.color && (
          <span className="attr-tag"><small>Màu:</small> <strong>{v.color}</strong></span>
        )}
        {!v.ramCapacity && !v.storageCapacity && !v.color && <span>-</span>}
      </div>
    );
  };

  const inventoryDataFull = useMemo(() => {
    const grouped = {};
    variants.forEach(v => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || v.productName?.toLowerCase().includes(searchLower) || v.sku?.toLowerCase().includes(searchLower);
      let matchesStatus = true;
      if (filterStatus === "OUT") matchesStatus = v.stockQuantity <= 0;
      else if (filterStatus === "LOW") matchesStatus = v.stockQuantity > 0 && v.stockQuantity < 5;
      else if (filterStatus === "OK") matchesStatus = v.stockQuantity >= 5;
      if (matchesSearch && matchesStatus) {
        const prodId = v.productId || "unknown";
        if (!grouped[prodId]) {
          grouped[prodId] = { id: prodId, name: v.productName || "Sản phẩm chưa đặt tên", image: v.image || "", totalStock: 0, children: [] };
        }
        grouped[prodId].totalStock += (v.stockQuantity || 0);
        grouped[prodId].children.push(v);
      }
    });
    return Object.values(grouped);
  }, [variants, searchTerm, filterStatus]);

  const totalPages = Math.ceil(inventoryDataFull.length / itemsPerPage);
  const currentInventoryData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return inventoryDataFull.slice(start, start + itemsPerPage);
  }, [inventoryDataFull, currentPage]);

  // --- SỬA LOGIC LẤY ẢNH: Xử lý thông minh mọi định dạng đường dẫn ---
  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    
    // Làm sạch path: bỏ / ở đầu nếu có
    const cleanPath = url.startsWith("/") ? url.substring(1) : url;

    // Nếu database đã lưu full path (có chữ uploads) thì chỉ nối BASE_URL
    if (cleanPath.includes("uploads")) {
        return `${BASE_URL}/${cleanPath}`;
    }

    // Nếu database chỉ lưu tên file (abc.jpg) thì thêm path chuẩn
    return `${BASE_URL}/api/uploads/products/${cleanPath}`;
  };

  const getTransactionTypeName = (type) => {
    switch (type) {
      case 'IMPORT': return 'Nhập hàng';
      case 'SALE': return 'Bán hàng';
      case 'RETURN': return 'Khách trả hàng';
      case 'ADJUSTMENT_UP': return 'Kiểm kê: Thừa (+)';
      case 'ADJUSTMENT_DOWN': return 'Kiểm kê: Thiếu (-)';
      default: return type;
    }
  };

  const groupedVariantsForImport = useMemo(() => {
    const groups = {};
    variants.forEach(v => {
      const searchLower = importSearch.toLowerCase();
      const matchSearch = !importSearch || v.sku.toLowerCase().includes(searchLower) || v.productName.toLowerCase().includes(searchLower);
      if (matchSearch) {
        const pId = v.productId || 'unknown';
        if (!groups[pId]) {
          groups[pId] = { id: pId, name: v.productName || "Sản phẩm chưa đặt tên", image: v.image || "", children: [] };
        }
        groups[pId].children.push(v);
      }
    });
    return Object.values(groups);
  }, [variants, importSearch]);

  const handleOpenProductDetail = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const openImportModal = () => {
    setImportCart([]); setImportNote(""); setImportSearch(""); setShowImportModal(true);
  };

  const addToImportCart = (variant) => {
    const exists = importCart.find(item => item.id === variant.id);
    if (!exists) setImportCart([...importCart, { ...variant, importQty: 1, importPrice: 0 }]);
  };

  const removeFromImportCart = (id) => setImportCart(importCart.filter(item => item.id !== id));

  const updateImportItem = (id, field, value) => {
    const numericValue = value === "" ? 0 : parseFloat(value);
    setImportCart(importCart.map(item => item.id === id ? { ...item, [field]: numericValue } : item));
  };

  const submitImport = async () => {
    if (importCart.length === 0) return alert("Chưa chọn sản phẩm nào!");
    
    const invalidItem = importCart.find(i => Number(i.importQty) <= 0 || Number(i.importPrice) < 0);
    if(invalidItem) return alert(`Sản phẩm ${invalidItem.sku} có số lượng hoặc giá không hợp lệ.`);
    
    try {
        setIsSubmitting(true);
        const processedNote = importNote && importNote.trim() !== "" ? importNote.trim() : "Nhập hàng thủ công";

        const payload = {
            note: processedNote,
            items: importCart.map(item => ({ 
                variantId: Number(item.id), 
                quantity: Math.floor(Number(item.importQty)), 
                importPrice: Number(item.importPrice) 
            }))
        };

        await inventoryApi.importGoods(payload);
        
        alert("Nhập kho thành công!");
        setShowImportModal(false); 
        setImportCart([]);
        setImportNote("");
        fetchInventory(); 
    } catch (error) { 
        const errorDetail = error.response?.data?.message || error.message;
        alert(errorDetail.includes("nhân viên khác") ? "⚠️ CẢNH BÁO: " + errorDetail : "❌ LỖI: " + errorDetail);
    } 
    finally { setIsSubmitting(false); }
  };

  const handleOpenHistory = async (variant) => {
    setSelectedVariant(variant); setShowHistoryModal(true); setHistoryData([]); setLoadingHistory(true);
    try {
      const res = await inventoryApi.getHistory(variant.id);
      setHistoryData(res.data || []);
    } catch (error) { console.error(error); } 
    finally { setLoadingHistory(false); }
  };

  const handleOpenAudit = (variant) => {
    setSelectedVariant(variant); 
    setAuditQuantity(0); 
    setAuditReason(""); 
    setShowBlindStock(false); 
    setShowAuditModal(true);
  };

  const handleSubmitAudit = async () => {
    if (!auditReason.trim()) return alert("Vui lòng nhập lý do!");
    try {
      setIsSubmitting(true);
      await inventoryApi.adjustStock({ 
        variantId: Number(selectedVariant.id), 
        actualQuantity: parseInt(auditQuantity, 10), 
        reason: auditReason 
      });
      alert("Cân bằng kho thành công!");
      setShowAuditModal(false); fetchInventory(); setShowDetailModal(false);
    } catch (error) { 
      const errorDetail = error.response?.data?.message || error.message;
      alert("❌ LỖI KIỂM KÊ: " + errorDetail);
    } 
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="page-card inventory-page">
      <div className="page-card__header">
        <div className="header-left">
          <h3><Package size={22}/> Quản lý Tồn kho</h3>
          <p className="subtitle">Dữ liệu thời gian thực & Kiểm soát thông minh</p>
        </div>
        <div className="header-actions">
            <input type="file" ref={fileInputRef} style={{display: 'none'}} accept=".xlsx, .xls, .csv" onChange={handleImportFile} />
            <button className="btn-secondary" onClick={() => fileInputRef.current.click()}><FileUp size={16}/> Nhập File</button>
            <button className="btn-primary" onClick={openImportModal}><PlusCircle size={16}/> Tạo phiếu nhập</button>
            
            <div className="export-dropdown-container" ref={exportMenuRef}>
                <button className="btn-secondary" onClick={() => setShowExportMenu(!showExportMenu)}>
                    <Download size={16}/> Xuất Excel <ChevronDown size={14} style={{marginLeft: '4px'}}/>
                </button>
                {showExportMenu && (
                    <div className="export-menu">
                        <button onClick={() => handleExportExcel('SUMMARY')}>
                            <ClipboardCheck size={14}/> Báo cáo tổng hợp
                        </button>
                        <button onClick={() => handleExportExcel('STOCK_CARD_ALL')}>
                            <History size={14}/> Thẻ kho tất cả sản phẩm
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>

      <div className="inventory-toolbar">
        <div className="toolbar-flex">
            <div className="search-box-large">
                <Search size={20} className="icon"/>
                <input placeholder="Tìm theo Tên SP, SKU..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
            </div>
            <div className="filter-group">
                <Filter size={18} />
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="OUT">Đã hết hàng (0)</option>
                    <option value="LOW">Sắp hết hàng (&lt; 5)</option>
                    <option value="OK">Sẵn sàng (&ge; 5)</option>
                </select>
            </div>
        </div>
      </div>

      <div className="table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th style={{ width: "80px" }}>Ảnh</th>
              <th>Sản phẩm</th>
              <th width="150" className="text-center">Số SKU</th>
              <th width="200" className="text-center">Tổng tồn</th>
              <th width="80" className="text-right"></th>
            </tr>
          </thead>
          <tbody>
            {currentInventoryData.map(product => {
                const hasOutStock = product.children.some(c => c.stockQuantity <= 0);
                return (
                    <tr key={product.id} className="parent-row-clickable" onClick={() => handleOpenProductDetail(product)}>
                        {/* --- SỬA HIỂN THỊ ẢNH TRONG BẢNG --- */}
                        <td>
                            <div style={{ 
                                width: "50px", height: "50px", display: "flex", 
                                alignItems: "center", justifyContent: "center", 
                                overflow: "hidden", borderRadius: "4px", border: "1px solid #eee" 
                            }}>
                                {product.image ? (
                                    <img 
                                        src={getImageUrl(product.image)} 
                                        alt="" 
                                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                        onError={(e) => {
                                            // Fallback nếu ảnh lỗi: Thử bỏ /api/ nếu link đang có /api/
                                            if (e.target.src.includes("/api/")) {
                                                e.target.src = e.target.src.replace("/api/", "/");
                                            } else {
                                                e.target.src = "https://via.placeholder.com/50?text=Error";
                                            }
                                        }}
                                    />
                                ) : <ImageIcon size={20} color="#ccc"/>}
                            </div>
                        </td>
                        <td>
                            <div className="product-info">
                                <div className="name-wrapper">
                                    <span className="prod-name">{product.name}</span>
                                </div>
                                {hasOutStock && <AlertTriangle size={16} color="#dc2626" title="Có biến thể hết hàng"/>}
                            </div>
                        </td>
                        <td className="text-center stock-number">{product.children.length}</td>
                        <td className="text-center stock-number">
                            <div className="stock-status-wrapper">
                                <b>{product.totalStock}</b>
                                {renderStockStatus(product.totalStock)}
                            </div>
                        </td>
                        <td className="text-right"><ChevronRight size={20} color="#ccc"/></td>
                    </tr>
                );
            })}
          </tbody>
        </table>

        {totalPages > 1 && (
            <div className="pagination-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', padding: '20px' }}>
                <button 
                    className="btn-pagination" 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
                >
                    <ChevronLeft size={20}/>
                </button>
                <span className="page-info">Trang <b>{currentPage}</b> / {totalPages}</span>
                <button 
                    className="btn-pagination" 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
                >
                    <ChevronRight size={20}/>
                </button>
            </div>
        )}
      </div>

      {/* Modal chi tiết biến thể */}
      {showDetailModal && selectedProduct && (
        <div className="modal-overlay">
            <div className="modal-container large">
                <div className="modal-header">
                    <div className="header-title-info">
                        <div className="h-img" style={{ width: "40px", height: "40px", overflow: "hidden" }}>
                            {selectedProduct.image ? <img src={getImageUrl(selectedProduct.image)} alt="" style={{ width: "100%", objectFit: "contain" }}/> : <Package size={20}/>}
                        </div>
                        <h3>Danh sách biến thể: <span className="highlight">{selectedProduct.name}</span></h3>
                    </div>
                    <button className="btn-icon" onClick={() => setShowDetailModal(false)}><X size={20}/></button>
                </div>
                <div className="modal-body">
                    <table className="variant-table-modal">
                        <thead>
                            <tr>
                                <th>Mã SKU</th>
                                <th>Thuộc tính</th>
                                <th className="text-center">Tồn kho</th>
                                <th className="text-center">Trạng thái</th>
                                <th className="text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedProduct.children.map(v => (
                                <tr key={v.id}>
                                    <td><span className="sku-badge">{v.sku}</span></td>
                                    <td>{renderAttributes(v)}</td>
                                    <td className="text-center">
                                        <span className={`stock-text ${v.stockQuantity <= 0 ? 'text-red' : v.stockQuantity < 5 ? 'text-orange' : ''}`}>
                                            {v.stockQuantity}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        {renderStockStatus(v.stockQuantity)}
                                    </td>
                                    <td className="text-right">
                                        <button className="btn-icon" title="Xuất thẻ kho SKU này" onClick={(e) => { e.stopPropagation(); handleExportExcel('STOCK_CARD_SINGLE', v.id); }}><FileUp size={16} color="#2563eb"/></button>
                                        <button className="btn-icon" title="Lịch sử thẻ kho" onClick={(e) => { e.stopPropagation(); handleOpenHistory(v); }}><History size={16}/></button>
                                        <button className="btn-icon" title="Kiểm kê" onClick={(e) => { e.stopPropagation(); handleOpenAudit(v); }}><ClipboardCheck size={16}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={() => setShowDetailModal(false)}>Đóng</button>
                </div>
            </div>
        </div>
      )}

      {/* --- CÁC MODAL KHÁC GIỮ NGUYÊN (PREVIEW, HISTORY, AUDIT, IMPORT) --- */}
      {showPreviewModal && (
        <div className="modal-overlay z-top">
            <div className="modal-container large">
                <div className="modal-header">
                    <h3>Xem trước dữ liệu nhập kho</h3>
                    <button className="btn-icon" onClick={() => setShowPreviewModal(false)}><X size={20}/></button>
                </div>
                <div className="modal-body">
                    <div className="alert-banner-info">
                        <AlertCircle size={18}/> Vui lòng kiểm tra kỹ các dòng <span className="text-red">báo lỗi</span> trước khi xác nhận.
                    </div>
                    <table className="variant-table-modal">
                        <thead>
                            <tr>
                                <th>Mã SKU</th>
                                <th>Tên sản phẩm</th>
                                <th className="text-right">SL Nhập</th>
                                <th>Trạng thái / Chi tiết lỗi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {previewData.map((item, idx) => (
                                <tr key={idx} className={!item.isValid ? 'row-error' : ''}>
                                    <td><strong>{item.sku}</strong></td>
                                    <td>{item.productName}</td>
                                    <td className="text-right">{item.quantity}</td>
                                    <td>
                                        {item.isValid ? 
                                            <span className="text-green-bold"><CheckCircle size={14}/> Hợp lệ</span> : 
                                            <span className="text-red-bold">❌ {item.error}</span>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={() => setShowPreviewModal(false)}>Hủy bỏ</button>
                    <button className="btn-primary" onClick={confirmBulkImport} disabled={isSubmitting}>Xác nhận lưu vào kho</button>
                </div>
            </div>
        </div>
      )}

      {showHistoryModal && selectedVariant && (
        <div className="modal-overlay z-top">
            <div className="modal-container">
                <div className="modal-header">
                    <h3>Thẻ kho: <span className="highlight">{selectedVariant.sku}</span></h3>
                    <button className="btn-icon" onClick={() => setShowHistoryModal(false)}><X size={20}/></button>
                </div>
                <div className="modal-body">
                    {loadingHistory ? <p className="text-center">Đang tải lịch sử...</p> : (
                        <table className="history-table">
                            <thead><tr><th>Thời gian</th><th>Loại giao dịch</th><th>Diễn giải</th><th className="text-right">Biến động</th><th className="text-right">Tồn cuối</th></tr></thead>
                            <tbody>
                                {historyData.map((h, idx) => {
                                    const type = h.type || h.transactionType;
                                    const isIncrease = ['IMPORT', 'RETURN', 'ADJUSTMENT_UP'].includes(type);
                                    return (
                                        <tr key={idx}>
                                            <td>{new Date(h.createdAt).toLocaleString('vi-VN')}</td>
                                            <td><span className={`badge ${isIncrease ? 'in' : 'out'}`}>{getTransactionTypeName(type)}</span></td>
                                            <td>{h.description || h.reason || h.note}</td>
                                            <td className={`text-right ${isIncrease ? 'text-green' : 'text-red'}`}>
                                                <b>{isIncrease ? '+' : '-'}{h.quantity || h.quantityChange}</b>
                                            </td>
                                            <td className="text-right font-bold">{h.balanceAfter}</td>
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

      {showAuditModal && selectedVariant && (
        <div className="modal-overlay z-top">
            <div className="modal-container small">
                <div className="modal-header">
                    <h3>Kiểm kê mù: <span className="highlight">{selectedVariant.sku}</span></h3>
                    <button className="btn-icon" onClick={() => setShowAuditModal(false)}><X size={20}/></button>
                </div>
                <div className="modal-body">
                    <div className="audit-info">
                        <div className="info-item">
                            <label>Số lượng hệ thống</label>
                            <div className="blind-value">
                                <strong>{showBlindStock ? selectedVariant.stockQuantity : '••••'}</strong>
                                <button className="btn-eye" onClick={() => setShowBlindStock(!showBlindStock)}>
                                    {showBlindStock ? <EyeOff size={16}/> : <Eye size={16}/>}
                                </button>
                            </div>
                        </div>
                        <div className="info-item">
                            <label>Số lượng thực tế (đếm tay)</label>
                            <input type="number" className="audit-input" autoFocus value={auditQuantity} onChange={e => setAuditQuantity(e.target.value)}/>
                        </div>
                        {showBlindStock && (
                            <div className="info-item diff animated fadeIn">
                                <label>Chênh lệch đối soát</label>
                                <span className={Number(auditQuantity) - selectedVariant.stockQuantity < 0 ? 'text-red' : 'text-green'}>
                                    {Number(auditQuantity) - selectedVariant.stockQuantity > 0 ? '+' : ''}{Number(auditQuantity) - selectedVariant.stockQuantity}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="form-group"><label>Lý do điều chỉnh (*):</label><textarea rows="2" placeholder="Ví dụ: Hàng hư hỏng, kiểm kho định kỳ..." value={auditReason} onChange={e => setAuditReason(e.target.value)}></textarea></div>
                </div>
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={() => setShowAuditModal(false)}>Hủy</button>
                    <button className="btn-primary" onClick={handleSubmitAudit} disabled={isSubmitting}>Xác nhận cân bằng</button>
                </div>
            </div>
        </div>
      )}

      {showImportModal && (
        <div className="modal-overlay z-top">
            <div className="modal-container large">
                <div className="modal-header">
                    <h3>Tạo phiếu nhập kho thủ công</h3>
                    <button className="btn-icon" onClick={() => setShowImportModal(false)}><X size={20}/></button>
                </div>
                <div className="modal-body import-layout">
                    <div className="import-sidebar">
                        <div className="search-box">
                            <Search size={16}/><input placeholder="Tìm SP hoặc SKU..." value={importSearch} onChange={e => setImportSearch(e.target.value)} />
                        </div>
                        <div className="product-list-select">
                            {groupedVariantsForImport.map(prod => (
                                <div key={prod.id} className="prod-group-item">
                                    <div className="group-header">
                                        <div className="g-img">{prod.image ? <img src={getImageUrl(prod.image)} alt=""/> : <ImageIcon size={14}/>}</div>
                                        <span className="g-name">{prod.name}</span>
                                    </div>
                                    <div className="group-variants-list">
                                        {prod.children.map(v => {
                                            const isAdded = importCart.some(item => item.id === v.id);
                                            return (
                                                <div key={v.id} className={`variant-mini-item ${isAdded ? 'added' : ''}`} onClick={() => !isAdded && addToImportCart(v)}>
                                                    <div className="v-info">
                                                        <div className="v-sku">{v.sku}</div>
                                                        <div className="v-specs-mini">
                                                            <small>{v.ramCapacity} | {v.storageCapacity}</small>
                                                        </div>
                                                    </div>
                                                    <div className="v-action">{isAdded ? <CheckCircle size={14} color="green"/> : <PlusCircle size={14}/>}</div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="import-main">
                        <div className="table-wrapper">
                            <table className="import-table">
                                <thead><tr><th>SKU</th><th>Sản phẩm</th><th width="80">SL</th><th>Giá nhập</th><th>Tổng</th><th></th></tr></thead>
                                <tbody>
                                    {importCart.map(item => (
                                        <tr key={item.id}>
                                            <td><small>{item.sku}</small></td>
                                            <td>{item.productName}</td>
                                            <td><input type="number" value={item.importQty} onChange={e => updateImportItem(item.id, 'importQty', e.target.value)}/></td>
                                            <td><input type="number" value={item.importPrice} onChange={e => updateImportItem(item.id, 'importPrice', e.target.value)}/></td>
                                            <td>{(Number(item.importQty || 0) * Number(item.importPrice || 0)).toLocaleString()}</td>
                                            <td><button className="text-red" onClick={() => removeFromImportCart(item.id)}><Trash2 size={16}/></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="import-footer-ctrl">
                            <textarea placeholder="Ghi chú phiếu nhập..." value={importNote} onChange={e => setImportNote(e.target.value)}></textarea>
                            <button className="btn-primary" onClick={submitImport} disabled={isSubmitting}>
                                {isSubmitting ? "Đang xử lý..." : "Hoàn tất nhập kho"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;