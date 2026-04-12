// src/pages/admin/productPage/VariantFormModal.js
import React, { useState } from "react";
import { X, Save } from "lucide-react";
import { FormField } from "./helpers";

const VariantFormModal = ({ variant, onSave, onClose, ramList, gpuList, chipList, storageList, colorList }) => {
  const [form, setForm] = useState({
    id: variant?.id || null,
    sku: variant?.sku || "", price: variant?.price || "", stockQuantity: variant?.stockQuantity || "",
    isActive: variant?.isActive ?? true,
    ramId: variant?.ramId || "", ramSize: variant?.ramSize || "",
    gpuId: variant?.gpuId || "", gpuName: variant?.gpuName || "",
    storageId: variant?.storageId || "", storageDisplay: variant?.storageDisplay || "",
    chipId: variant?.chipId || "", chipName: variant?.chipName || "",
    colorId: variant?.colorId || "", colorName: variant?.colorName || "",
  });
  const [errors, setErrors] = useState({});

  const setF = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.sku.trim()) e.sku = "SKU không được để trống";
    if (!form.price || isNaN(form.price)) e.price = "Giá phải là số hợp lệ";
    if (!form.stockQuantity || isNaN(form.stockQuantity)) e.stockQuantity = "Số lượng phải là số hợp lệ";
    if (!form.ramId) e.ramId = "Chọn RAM";
    if (!form.gpuId) e.gpuId = "Chọn GPU";
    if (!form.chipId) e.chipId = "Chọn CPU";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const selectedRam = ramList?.find(r => r.id === Number(form.ramId));
    const selectedGpu = gpuList?.find(g => g.id === Number(form.gpuId));
    const selectedStorage = storageList?.find(s => s.id === Number(form.storageId));
    const selectedChip = chipList?.find(c => c.id === Number(form.chipId));
    const selectedColor = colorList?.find(c => c.id === Number(form.colorId));

    onSave({
      ...form, price: Number(form.price), stockQuantity: Number(form.stockQuantity),
      ramSize: selectedRam?.ramSize, gpuName: selectedGpu?.gpuName,
      storageDisplay: selectedStorage ? `${selectedStorage.capacity} ${selectedStorage.storageType}` : "",
      chipName: selectedChip?.cpuName, colorName: selectedColor?.colorName,
    });
  };

  const inputStyle = (err) => ({
    width: "100%", padding: "9px 12px", border: `1.5px solid ${err ? "#f87171" : "#d1d5db"}`,
    borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fff",
  });

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, backdropFilter: "blur(3px)" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: 600, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <div>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 18 }}>{variant ? "Chỉnh sửa biến thể" : "Thêm biến thể mới"}</h3>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>Cấu hình RAM · GPU · CPU · Storage · Màu</p>
          </div>
          <button onClick={onClose} style={{ padding: 6, border: "none", background: "#f1f5f9", borderRadius: 8, cursor: "pointer" }}>
            <X size={18} color="#374151" />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <FormField label="SKU *" error={errors.sku} style={{ gridColumn: "1/-1" }}>
            <input value={form.sku} onChange={e => setF("sku", e.target.value)} placeholder="VD: ASUS-ROG-16GB-512SSD-BLK" style={inputStyle(errors.sku)} />
          </FormField>
          <FormField label="Giá bán (VNĐ) *" error={errors.price}>
            <input type="number" value={form.price} onChange={e => setF("price", e.target.value)} placeholder="35000000" style={inputStyle(errors.price)} />
          </FormField>
          <FormField label="Số lượng tồn kho *" error={errors.stockQuantity}>
            <input type="number" value={form.stockQuantity} onChange={e => setF("stockQuantity", e.target.value)} placeholder="10" style={inputStyle(errors.stockQuantity)} />
          </FormField>

          <div style={{ gridColumn: "1/-1", height: 1, background: "#f1f5f9", margin: "4px 0" }} />
          <p style={{ gridColumn: "1/-1", margin: 0, fontWeight: 700, fontSize: 13, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em" }}>⚙ Cấu hình phần cứng</p>

          {[
            ["RAM *", "ramId", ramList, r => `${r.ramSize}`, "ramId", errors.ramId],
            ["GPU *", "gpuId", gpuList, g => g.gpuName, "gpuId", errors.gpuId],
            ["CPU / Chip *", "chipId", chipList, c => c.cpuName, "chipId", errors.chipId],
            ["Storage", "storageId", storageList, s => `${s.capacity} ${s.storageType}`, "storageId", null],
            ["Màu sắc", "colorId", colorList, c => c.colorName, "colorId", null],
          ].map(([label, key, opts, display, errKey, err]) => (
            <FormField key={key} label={label} error={err}>
              <select value={form[key]} onChange={e => setF(key, e.target.value)} style={inputStyle(err)}>
                <option value="">-- Chọn --</option>
                {opts?.map(o => <option key={o.id} value={o.id}>{display(o)}</option>)}
              </select>
            </FormField>
          ))}

          <FormField label="Trạng thái" style={{ gridColumn: "1/-1" }}>
            <div style={{ display: "flex", gap: 10 }}>
              {[[true, "Hoạt động", "#10b981"], [false, "Ẩn", "#ef4444"]].map(([val, label, color]) => (
                <label key={label} style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer", padding: "8px 14px", borderRadius: 8, border: `2px solid ${form.isActive === val ? color : "#e5e7eb"}`, background: form.isActive === val ? `${color}14` : "#fff" }}>
                  <input type="radio" checked={form.isActive === val} onChange={() => setF("isActive", val)} style={{ accentColor: color }} />
                  <span style={{ fontWeight: 600, fontSize: 13, color: form.isActive === val ? color : "#374151" }}>{label}</span>
                </label>
              ))}
            </div>
          </FormField>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22, paddingTop: 18, borderTop: "1px solid #f1f5f9" }}>
          <button onClick={onClose} style={{ padding: "10px 18px", border: "1px solid #d1d5db", borderRadius: 9, background: "#fff", cursor: "pointer", fontWeight: 500, fontSize: 14 }}>Huỷ</button>
          <button onClick={handleSave} style={{
            display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", border: "none", borderRadius: 9,
            background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 14,
            boxShadow: "0 4px 12px rgba(109,40,217,0.3)",
          }}>
            <Save size={14} /> {variant ? "Lưu thay đổi" : "Thêm biến thể"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariantFormModal;
