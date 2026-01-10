import React, { useState, useEffect, useCallback } from "react";
import { X, Trash2, Save, Copy, RefreshCw, AlertCircle, Image as ImageIcon, CheckCircle, Plus, Edit2, XCircle } from "lucide-react";
import variantApi from "../../../../api/variantApi"; 
import "./style.scss";

const VariantManager = ({ productId, productName, productSlug, onClose }) => {
  const [loading, setLoading] = useState(false);
  const BASE_URL = "http://localhost:8080"; 

  const [existingVariants, setExistingVariants] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const [attrGroups, setAttrGroups] = useState([
    { name: "RAM", values: ["8GB", "16GB"], inputValue: "" },
    { name: "SSD", values: ["256GB", "512GB"], inputValue: "" },
    { name: "Màu sắc", values: ["Đen"], inputValue: "" }
  ]);
  const [variantMatrix, setVariantMatrix] = useState([]);

  const loadExistingVariants = useCallback(async () => {
    try {
      const res = await variantApi.getByProduct(productId);
      setExistingVariants(res.data || []);
    } catch (error) {
      console.error("Lỗi tải variants cũ:", error);
    }
  }, [productId]);

  useEffect(() => {
    loadExistingVariants();
  }, [loadExistingVariants]);

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("https")) return url;
    if (url.startsWith("/")) return `${BASE_URL}${url}`;
    return `${BASE_URL}/uploads/products/${url}`;
  };

  const startEditRow = (variant) => {
    setEditingRowId(variant.id);
    setEditFormData({ ...variant });
  };

  const cancelEditRow = () => {
    setEditingRowId(null);
    setEditFormData({});
  };

  // --- LOGIC 1: LƯU KHI CHỈNH SỬA DÒNG CÓ SẴN ---
  const saveEditRow = async () => {
    // Kiểm tra giá trị âm
    if (editFormData.price < 0) return alert("Lỗi: Giá bán không được nhỏ hơn 0!");
    if (editFormData.stockQuantity < 0) return alert("Lỗi: Số lượng tồn kho không được nhỏ hơn 0!");

    try {
        await variantApi.save(editFormData);
        alert("Cập nhật thành công!");
        setEditingRowId(null);
        loadExistingVariants();
    } catch (error) {
        // Báo lỗi cụ thể từ Server (VD: Trùng SKU)
        const serverMsg = error.response?.data?.message || error.message;
        alert("Lỗi cập nhật: " + serverMsg);
    }
  };

  const handleEditChange = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
  }

  const generateSmartSku = (prodName, ram, storage, color) => {
    const cleanName = removeAccents(prodName).toUpperCase().replace(/\s+/g, "-");
    
    let ramCode = ram ? removeAccents(ram).toUpperCase().replace(/\s+/g, "") : "";
    if (ramCode && !ramCode.endsWith("GB")) {
        ramCode = ramCode.replace("G", "") + "GB";
    }

    let storageCode = storage ? removeAccents(storage).toUpperCase().replace(/\s+/g, "") : "";
    if (storageCode && !storageCode.endsWith("GB") && !storageCode.endsWith("TB")) {
        storageCode = storageCode.replace("SSD", "").replace("HDD", "") + "GB";
    }

    let colorCode = "DEF";
    if (color) {
        const val = removeAccents(color).toUpperCase();
        if (val.includes("DEN") || val.includes("BLACK")) colorCode = "BLK";
        else if (val.includes("TRANG") || val.includes("WHITE")) colorCode = "WHT";
        else if (val.includes("BAC") || val.includes("SILVER")) colorCode = "SLV";
        else if (val.includes("XAM") || val.includes("GRAY") || val.includes("GREY")) colorCode = "GRY";
        else if (val.includes("VANG") || val.includes("GOLD")) colorCode = "GLD";
        else colorCode = val.substring(0, 3);
    }

    return `${cleanName}-${ramCode}-${storageCode}-${colorCode}`
        .replace(/--+/g, "-") 
        .replace(/^-+|-+$/g, "") 
        .toUpperCase();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = attrGroups[index].inputValue.trim();
      if (val && !attrGroups[index].values.includes(val)) {
        const newGroups = [...attrGroups];
        newGroups[index].values.push(val);
        newGroups[index].inputValue = "";
        setAttrGroups(newGroups);
      }
    }
  };

  const removeValueTag = (groupIndex, valIndex) => {
    const newGroups = [...attrGroups];
    newGroups[groupIndex].values = newGroups[groupIndex].values.filter((_, i) => i !== valIndex);
    setAttrGroups(newGroups);
  };

  const addGroup = () => setAttrGroups([...attrGroups, { name: "", values: [], inputValue: "" }]);
  const removeGroup = (index) => setAttrGroups(attrGroups.filter((_, i) => i !== index));
  const updateGroup = (index, field, value) => {
    const newGroups = [...attrGroups];
    newGroups[index][field] = value;
    setAttrGroups(newGroups);
  };

  const generateVariants = () => {
    const validGroups = attrGroups.filter(g => g.name && g.values.length > 0);
    if (validGroups.length === 0) return alert("Vui lòng nhập ít nhất 1 thuộc tính!");

    const combinations = cartesian(validGroups.map(g => g.values));
    const newVariants = combinations.map(combo => {
      const rowData = {};
      validGroups.forEach((g, i) => {
          const key = removeAccents(g.name).toUpperCase();
          if (key.includes("RAM")) rowData.ramCapacity = combo[i];
          else if (key.includes("SSD") || key.includes("O CUNG")) rowData.storageCapacity = combo[i];
          else if (key.includes("MAU")) rowData.color = combo[i];
      });

      const autoSku = generateSmartSku(productName, rowData.ramCapacity, rowData.storageCapacity, rowData.color);
      
      return {
        ...rowData,
        image: "", 
        sku: autoSku, 
        price: 0, 
        stockQuantity: 0,
        tempId: Math.random()
      };
    });
    setVariantMatrix(newVariants);
  };

  const cartesian = (args) => {
    const r = [], max = args.length - 1;
    function helper(arr, i) {
      for (let j = 0, l = args[i].length; j < l; j++) {
        const a = arr.slice(0); a.push(args[i][j]);
        if (i === max) r.push(a); else helper(a, i + 1);
      }
    }
    helper([], 0); return r;
  };

  const updateVariantRow = (index, field, value) => {
    const newMatrix = [...variantMatrix];
    newMatrix[index][field] = value;
    setVariantMatrix(newMatrix);
  };

  const removeVariantRow = (index) => setVariantMatrix(variantMatrix.filter((_, i) => i !== index));
  
  const applyToAll = (field) => {
    if (variantMatrix.length === 0) return;
    const firstValue = variantMatrix[0][field];
    setVariantMatrix(variantMatrix.map(v => ({ ...v, [field]: firstValue })));
  };

  // --- LOGIC 2: LƯU TẤT CẢ BIẾN THỂ MỚI ---
  const handleSaveAll = async () => {
    if (variantMatrix.length === 0) return;

    // 1. Kiểm tra giá trị âm
    const negativePrice = variantMatrix.find(v => parseFloat(v.price) < 0);
    if (negativePrice) return alert(`Lỗi: Biến thể SKU ${negativePrice.sku} có giá âm!`);

    const negativeStock = variantMatrix.find(v => parseInt(v.stockQuantity) < 0);
    if (negativeStock) return alert(`Lỗi: Biến thể SKU ${negativeStock.sku} có tồn kho âm!`);

    // 2. Kiểm tra trùng SKU nội bộ (trong bảng đang tạo)
    const skuMap = {};
    for (const v of variantMatrix) {
        if (skuMap[v.sku]) return alert(`Lỗi: Trùng mã SKU nội bộ trong danh sách tạo mới: ${v.sku}`);
        skuMap[v.sku] = true;
    }

    // 3. Kiểm tra trùng SKU với Database (đã load ở existingVariants)
    for (const v of variantMatrix) {
        const isDuplicate = existingVariants.some(exist => exist.sku.toUpperCase() === v.sku.toUpperCase());
        if (isDuplicate) return alert(`Lỗi: Mã SKU '${v.sku}' đã tồn tại trong hệ thống. Vui lòng đổi mã khác!`);
    }

    try {
      setLoading(true);
      const promises = variantMatrix.map(v => {
        return variantApi.save({
          productId: productId,
          sku: v.sku,
          price: parseFloat(v.price) || 0,
          image: v.image,
          stockQuantity: parseInt(v.stockQuantity) || 0,
          ramCapacity: v.ramCapacity,
          storageCapacity: v.storageCapacity,
          color: v.color
        });
      });
      await Promise.all(promises);
      alert("Đã lưu tất cả biến thể thành công!");
      setVariantMatrix([]); 
      loadExistingVariants(); 
    } catch (error) {
      const serverMsg = error.response?.data?.message || "Lỗi máy chủ không xác định";
      alert("Lỗi khi lưu danh sách: " + serverMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExisting = async (id) => {
    if(!window.confirm("Bạn chắc chắn muốn xóa biến thể này?")) return;
    try {
      await variantApi.delete(id);
      loadExistingVariants();
    } catch (error) {
      alert("Lỗi xóa: " + error.message);
    }
  }

  return (
    <div className="vm-overlay">
      <div className="vm-container">
        <div className="vm-header">
          <div><h2>Quản lý biến thể: <span className="highlight">{productName}</span></h2></div>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>

        <div className="vm-body">
          {/* A. DANH SÁCH ĐÃ CÓ */}
          <div className="vm-section existing-section">
            <h4><CheckCircle size={18} color="green"/> Biến thể đang hoạt động ({existingVariants.length})</h4>
            <div className="table-responsive">
                <table className="matrix-table simple-view">
                    <thead>
                        <tr>
                            <th>Ảnh</th>
                            <th>SKU</th>
                            <th>Cấu hình</th>
                            <th>Giá bán</th>
                            <th>Tồn kho</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {existingVariants.map(v => (
                            <tr key={v.id}>
                                <td>{editingRowId === v.id ? 
                                    <input className="input-url" value={editFormData.image || ''} onChange={e => handleEditChange('image', e.target.value)}/> : 
                                    <img src={getImageUrl(v.image)} className="img-thumb-small" alt=""/>}
                                </td>
                                <td style={{fontWeight:'bold', color: '#2563eb'}}>{v.sku}</td>
                                <td>
                                    <div className="variant-tags">
                                        {v.ramCapacity && <span className="v-tag">RAM: {v.ramCapacity}</span>}
                                        {v.storageCapacity && <span className="v-tag">SSD: {v.storageCapacity}</span>}
                                        {v.color && <span className="v-tag">Màu: {v.color}</span>}
                                    </div>
                                </td>
                                <td>{editingRowId === v.id ? 
                                    <input type="number" className="input-table" value={editFormData.price} onChange={e => handleEditChange('price', e.target.value)} /> : 
                                    new Intl.NumberFormat('vi-VN').format(v.price)}
                                </td>
                                <td>{editingRowId === v.id ? 
                                    <input type="number" className="input-table" value={editFormData.stockQuantity} onChange={e => handleEditChange('stockQuantity', e.target.value)} /> : 
                                    v.stockQuantity}
                                </td>
                                <td>
                                    {editingRowId === v.id ? (
                                        <div className="flex-center"><CheckCircle className="cursor-p" onClick={saveEditRow}/><XCircle className="cursor-p" onClick={cancelEditRow}/></div>
                                    ) : (
                                        <div className="flex-center"><Edit2 className="cursor-p" size={16} onClick={() => startEditRow(v)}/><Trash2 className="cursor-p" size={16} onClick={() => handleDeleteExisting(v.id)}/></div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>

          <hr className="divider"/>

          <div className="vm-section builder-section">
            <h4><Plus size={18}/> Tạo thêm biến thể</h4>
            <div className="builder-controls">
                {attrGroups.map((group, idx) => (
                <div key={idx} className="attr-group-row">
                    <input className="input-attr-name" placeholder="Tên (RAM/SSD/Màu sắc)" value={group.name} onChange={e => updateGroup(idx, 'name', e.target.value)} />
                    <div className="tags-list">
                        {group.values.map((val, vIdx) => (
                            <span key={vIdx} className="tag-pill">{val} <X size={12} onClick={() => removeValueTag(idx, vIdx)}/></span>
                        ))}
                        <input className="input-ghost" placeholder="Enter để thêm..." value={group.inputValue} onChange={e => updateGroup(idx, 'inputValue', e.target.value)} onKeyDown={e => handleKeyDown(idx, e)} />
                    </div>
                </div>
                ))}
                <div className="builder-actions">
                    <button onClick={addGroup} className="btn-text">+ Thêm nhóm</button>
                    <button onClick={generateVariants} className="btn-primary-outline"><RefreshCw size={16}/> Xem trước ma trận</button>
                </div>
            </div>
          </div>

          {variantMatrix.length > 0 && (
            <div className="vm-section matrix-section active">
              <table className="matrix-table">
                <thead>
                  <tr>
                    <th>Ảnh <Copy size={12} className="cursor-p" onClick={() => applyToAll('image')}/></th>
                    <th>RAM / SSD / Màu</th>
                    <th>SKU (Auto)</th>
                    <th>Giá <Copy size={12} className="cursor-p" onClick={() => applyToAll('price')}/></th>
                    <th>Tồn kho <Copy size={12} className="cursor-p" onClick={() => applyToAll('stockQuantity')}/></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {variantMatrix.map((variant, idx) => (
                    <tr key={variant.tempId}>
                      <td><input className="input-url" placeholder="URL..." value={variant.image} onChange={e => updateVariantRow(idx, 'image', e.target.value)}/></td>
                      <td>
                        <small>{variant.ramCapacity} | {variant.storageCapacity} | {variant.color}</small>
                      </td>
                      <td><input className="input-table" value={variant.sku} onChange={e => updateVariantRow(idx, 'sku', e.target.value)}/></td>
                      <td><input type="number" className="input-table" value={variant.price} onChange={e => updateVariantRow(idx, 'price', e.target.value)}/></td>
                      <td><input type="number" className="input-table" value={variant.stockQuantity} onChange={e => updateVariantRow(idx, 'stockQuantity', e.target.value)}/></td>
                      <td><Trash2 className="cursor-p" onClick={() => removeVariantRow(idx)}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="save-actions"><button onClick={handleSaveAll} className="btn-primary large" disabled={loading}><Save size={18}/> {loading ? "Đang lưu..." : "Xác nhận tạo biến thể"}</button></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VariantManager;