import React, { useState, useEffect } from "react";
import { X, Save, Plus, Trash2, Image as ImageIcon } from "lucide-react"; 
import { FormField, BASE_URL } from "./helpers";

const VariantFormModal = ({ product, variant, onSave, onClose, ramList, gpuList, chipList, storageList, colorList }) => {
  // ✅ CẬP NHẬT STATE: Bóc tách cả dữ liệu phẳng (DTO) và dữ liệu lồng (Entity)
  const [form, setForm] = useState({
    id: variant?.id || null,
    sku: variant?.sku || "",
    price: variant?.price || "",
    importPrice: variant?.importPrice || "",
    stockQuantity: variant?.stockQuantity || "",
    isActive: variant?.isActive ?? true,
    
    ramId: variant?.ramId ? String(variant.ramId) : (variant?.ram?.id ? String(variant.ram.id) : ""), 
    gpuId: variant?.gpuId ? String(variant.gpuId) : (variant?.gpu?.id ? String(variant.gpu.id) : ""),
    chipId: variant?.chipId ? String(variant.chipId) : (variant?.chip?.id ? String(variant.chip.id) : ""),
    storageId: variant?.storageId ? String(variant.storageId) : (variant?.storage?.id ? String(variant.storage.id) : ""),
    colorId: variant?.colorId ? String(variant.colorId) : (variant?.color?.id ? String(variant.color.id) : ""),
    
    imageUrls: (variant?.imageUrls && variant.imageUrls.length > 0)
      ? [...variant.imageUrls]
      : (variant?.images && variant.images.length > 0)
        ? variant.images.map(img => img.imageUrl)
        : [""], 
  });

  const [errors, setErrors] = useState({});
  const setF = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleImageUrlChange = (index, value) => {
    const newUrls = [...form.imageUrls];
    newUrls[index] = value;
    setF("imageUrls", newUrls);
  };

  const addImageField = () => setF("imageUrls", [...form.imageUrls, ""]);

  const removeImageField = (index) => {
    const newUrls = form.imageUrls.filter((_, i) => i !== index);
    setF("imageUrls", newUrls.length > 0 ? newUrls : [""]);
  };

  const validate = () => {
    const e = {};
    if (!form.sku?.trim()) e.sku = "SKU không được để trống";
    
    if (form.price === "" || isNaN(form.price)) {
      e.price = "Giá bán không được để trống";
    } else if (Number(form.price) < 0) {
      e.price = "Giá tiền phải lớn hơn hoặc bằng 0";
    }

    if (form.stockQuantity === "" || isNaN(form.stockQuantity)) {
      e.stockQuantity = "Số lượng không được để trống";
    } else if (Number(form.stockQuantity) < 0) {
      e.stockQuantity = "Số lượng phải lớn hơn hoặc bằng 0";
    }

    if (!form.ramId) e.ramId = "Chọn RAM";
    if (!form.gpuId) e.gpuId = "Chọn GPU";
    if (!form.chipId) e.chipId = "Chọn CPU";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    
    const selectedRam = ramList?.find(r => String(r.id) === String(form.ramId));
    const selectedGpu = gpuList?.find(g => String(g.id) === String(form.gpuId));
    const selectedStorage = storageList?.find(s => String(s.id) === String(form.storageId));
    const selectedChip = chipList?.find(c => String(c.id) === String(form.chipId));
    const selectedColor = colorList?.find(c => String(c.id) === String(form.colorId));

    const finalImageUrls = form.imageUrls
      .map(url => url.trim())
      .filter(url => url !== "");

    const payload = {
      id: form.id,
      productId: product?.id,
      sku: form.sku.trim(),
      price: Number(form.price),
      importPrice: form.importPrice ? Number(form.importPrice) : Number(form.price) * 0.7,
      stockQuantity: Number(form.stockQuantity),
      isActive: Boolean(form.isActive),
      ramId: form.ramId ? Number(form.ramId) : null,
      gpuId: form.gpuId ? Number(form.gpuId) : null,
      chipId: form.chipId ? Number(form.chipId) : null,
      storageId: form.storageId ? Number(form.storageId) : null,
      colorId: form.colorId ? Number(form.colorId) : null,
      imageUrls: finalImageUrls,
      ramSize: selectedRam?.ramSize || "",
      gpuName: selectedGpu?.gpuName || "",
      chipName: selectedChip?.cpuName || "",
      storageDisplay: selectedStorage ? `${selectedStorage.capacity} ${selectedStorage.storageType}` : "",
      colorName: selectedColor?.colorName || ""
    };

    onSave(payload);
  };

  const inputStyle = (err) => ({
    width: "100%", padding: "10px 12px", border: `1.5px solid ${err ? "#f87171" : "#d1d5db"}`,
    borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fff"
  });

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, backdropFilter: "blur(4px)" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: 640, maxWidth: "95vw", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <div>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 19 }}>{variant ? "Chỉnh sửa biến thể" : "Thêm biến thể mới"}</h3>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>Sản phẩm: <b>{product?.name}</b></p>
          </div>
          <button onClick={onClose} style={{ padding: 8, border: "none", background: "#f3f4f6", borderRadius: 10, cursor: "pointer" }}>
            <X size={20} color="#4b5563" />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <FormField label="SKU / Mã định danh *" error={errors.sku} style={{ gridColumn: "1/-1" }}>
            <input value={form.sku} onChange={e => setF("sku", e.target.value)} placeholder="Ví dụ: LAP-ASUS-VIVO-01" style={inputStyle(errors.sku)} />
          </FormField>

          <FormField label="Giá bán (VNĐ) *" error={errors.price}>
            <input type="number" value={form.price} onChange={e => setF("price", e.target.value)} placeholder="0" style={inputStyle(errors.price)} />
          </FormField>
          <FormField label="Số lượng tồn kho *" error={errors.stockQuantity}>
            <input type="number" value={form.stockQuantity} onChange={e => setF("stockQuantity", e.target.value)} placeholder="0" style={inputStyle(errors.stockQuantity)} />
          </FormField>

          <div style={{ gridColumn: "1/-1", height: 1, background: "#f1f5f9", margin: "8px 0" }} />
          <p style={{ gridColumn: "1/-1", margin: 0, fontWeight: 700, fontSize: 13, color: "#4b5563", textTransform: "uppercase" }}>⚙️ Cấu hình phần cứng</p>

          {[
            ["RAM *", "ramId", ramList, r => `${r.ramSize}`, errors.ramId],
            ["GPU *", "gpuId", gpuList, g => g.gpuName, errors.gpuId],
            ["CPU / Chip *", "chipId", chipList, c => c.cpuName, errors.chipId],
            ["Storage", "storageId", storageList, s => `${s.capacity} ${s.storageType}`, null],
            ["Màu sắc", "colorId", colorList, c => c.colorName, null],
          ].map(([label, key, opts, display, err]) => (
            <FormField key={key} label={label} error={err}>
              <select 
                value={String(form[key] || "")} 
                onChange={e => setF(key, e.target.value)} 
                style={inputStyle(err)}
              >
                <option value="">-- Chọn {label.replace(" *", "")} --</option>
                {opts?.map(o => (
                  <option key={o.id} value={String(o.id)}>{display(o)}</option>
                ))}
              </select>
            </FormField>
          ))}

          {/* ✅ KHU VỰC QUẢN LÝ ẢNH CÓ REVIEW */}
          <div style={{ gridColumn: "1/-1", marginTop: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: "#4b5563", textTransform: "uppercase" }}>📸 Hình ảnh biến thể (Review)</p>
              <button onClick={addImageField} type="button" style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>
                <Plus size={14} /> Thêm ảnh
              </button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {form.imageUrls.map((url, index) => {
                const fullUrl = url ? (url.startsWith("http") ? url : `${BASE_URL}${url}`) : "";
                
                return (
                  <div key={index} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    {/* Ô Review ảnh nhỏ */}
                    <div style={{ 
                      width: 48, height: 48, borderRadius: 8, border: "1px solid #e5e7eb", 
                      background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 
                    }}>
                      {url ? (
                        <img 
                          src={fullUrl} 
                          alt="Review" 
                          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                          onError={(e) => { 
                            e.target.style.display = 'none'; 
                            e.target.nextSibling.style.display = 'block'; 
                          }} 
                        />
                      ) : null}
                      <ImageIcon size={18} style={{ color: "#d1d5db", display: url ? 'none' : 'block' }} />
                      <span style={{ fontSize: 8, color: "#ef4444", display: 'none', textAlign: 'center' }}>Lỗi ảnh</span>
                    </div>

                    {/* Ô nhập link */}
                    <div style={{ flex: 1 }}>
                      <input 
                        value={url} 
                        onChange={(e) => handleImageUrlChange(index, e.target.value)} 
                        placeholder="Dán URL ảnh tại đây..." 
                        style={inputStyle()} 
                      />
                    </div>

                    {/* Nút xóa ô nhập */}
                    {form.imageUrls.length > 1 && (
                      <button onClick={() => removeImageField(index)} style={{ padding: "10px", background: "#fff1f2", border: "1px solid #fecaca", borderRadius: 10, color: "#e11d48", cursor: "pointer" }}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <FormField label="Trạng thái kinh doanh" style={{ gridColumn: "1/-1" }}>
            <div style={{ display: "flex", gap: 12 }}>
              {[[true, "Đang bán", "#10b981"], [false, "Tạm ẩn", "#f43f5e"]].map(([val, label, color]) => (
                <label key={label} style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "12px", borderRadius: 10, border: `2px solid ${form.isActive === val ? color : "#f3f4f6"}`, background: form.isActive === val ? `${color}10` : "#fff" }}>
                  <input type="radio" checked={form.isActive === val} onChange={() => setF("isActive", val)} style={{ accentColor: color }} />
                  <span style={{ fontWeight: 600, fontSize: 13, color: form.isActive === val ? color : "#6b7280" }}>{label}</span>
                </label>
              ))}
            </div>
          </FormField>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 30, paddingTop: 20, borderTop: "1px solid #f1f5f9" }}>
          <button onClick={onClose} style={{ padding: "11px 22px", border: "1px solid #d1d5db", borderRadius: 10, background: "#fff", cursor: "pointer", fontWeight: 600, color: "#4b5563" }}>Huỷ</button>
          <button onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 25px", border: "none", borderRadius: 10, background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "#fff", cursor: "pointer", fontWeight: 700 }}>
            <Save size={16} /> {variant ? "Lưu thay đổi" : "Xác nhận thêm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariantFormModal;