// src/pages/admin/productPage/ProductForm.js
import React, { useState } from "react";
import { ArrowLeft, Save, Laptop, Cpu, Image as ImageIcon, Upload, Star } from "lucide-react";
import { FormField } from "./helpers";

const ProductForm = ({ product, onSave, onBack, brands, purposes, screenSizes, promotions }) => {
  const isEdit = !!product;
  const [form, setForm] = useState({
    id: product?.id || null,
    name: product?.name || "", slug: product?.slug || "",
    description: product?.description || "", status: product?.status || "ACTIVE",
    brandId: product?.brandId || "", brandName: product?.brandName || "",
    screenSizeId: product?.screenSizeId || "", screenSizeValue: product?.screenSizeValue || "",
    purposeId: product?.purposeId || "", purposeName: product?.purposeName || "",
    promotionId: product?.promotionId || "", promotionName: product?.promotionName || "",
    imageUrl: product?.imageUrl || "",
    specification: product?.specification || { resolution: "", refreshRate: "", panelType: "", battery: "", weight: "", os: "", wifi: "", bluetooth: "", ports: "" },
    variants: product?.variants || [],
  });
  const [activeTab, setActiveTab] = useState("general");
  const [errors, setErrors] = useState({});

  const setF = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setSpec = (key, val) => setForm(f => ({ ...f, specification: { ...f.specification, [key]: val } }));

  const autoSlug = (name) => name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Tên sản phẩm không được để trống";
    if (!form.brandId) e.brandId = "Chọn thương hiệu";
    if (!form.purposeId) e.purposeId = "Chọn mục đích sử dụng";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const brand = brands.find(b => b.id === Number(form.brandId));
    const purpose = purposes.find(p => p.id === Number(form.purposeId));
    const screen = screenSizes.find(s => s.id === Number(form.screenSizeId));
    const promo = promotions.find(p => p.id === Number(form.promotionId));
    onSave({ ...form, brandName: brand?.name, purposeName: purpose?.name, screenSizeValue: screen?.value, promotionName: promo?.name || null });
  };

  const tabs = [
    { id: "general", label: "Thông tin chung", icon: Laptop },
    { id: "spec", label: "Thông số kỹ thuật", icon: Cpu },
    { id: "image", label: "Hình ảnh", icon: ImageIcon },
  ];

  const inputStyle = (err) => ({
    width: "100%", padding: "9px 12px", border: `1.5px solid ${err ? "#f87171" : "#d1d5db"}`,
    borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box",
    background: "#fff", transition: "border-color 0.2s",
  });

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "1px solid #e5e7eb", borderRadius: 9, background: "#fff", cursor: "pointer", fontSize: 14, color: "#374151", fontWeight: 500 }}>
          <ArrowLeft size={15} /> Quay lại
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>
            {isEdit ? `Chỉnh sửa: ${product.name}` : "Thêm sản phẩm mới"}
          </h2>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>
            {isEdit ? "Cập nhật thông tin sản phẩm" : "Điền đầy đủ thông tin để tạo sản phẩm"}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 0, marginBottom: 20, background: "#f1f5f9", borderRadius: 10, padding: 4 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            padding: "9px 16px", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer",
            background: activeTab === t.id ? "#fff" : "transparent",
            color: activeTab === t.id ? "#2563eb" : "#6b7280",
            boxShadow: activeTab === t.id ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
            transition: "all 0.2s",
          }}>
            <t.icon size={15} />{t.label}
          </button>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: 28, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        {activeTab === "general" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <FormField label="Tên sản phẩm *" error={errors.name} style={{ gridColumn: "1/-1" }}>
              <input value={form.name} onChange={e => { setF("name", e.target.value); setF("slug", autoSlug(e.target.value)); }}
                placeholder="VD: ASUS ROG Strix G15" style={inputStyle(errors.name)} />
            </FormField>
            <FormField label="Slug" style={{ gridColumn: "1/-1" }}>
              <input value={form.slug} onChange={e => setF("slug", e.target.value)} placeholder="asus-rog-strix-g15" style={inputStyle()} />
            </FormField>
            <FormField label="Mô tả" style={{ gridColumn: "1/-1" }}>
              <textarea value={form.description} onChange={e => setF("description", e.target.value)}
                rows={3} placeholder="Mô tả sản phẩm..." style={{ ...inputStyle(), resize: "vertical", minHeight: 90 }} />
            </FormField>
            <FormField label="Thương hiệu *" error={errors.brandId}>
              <select value={form.brandId} onChange={e => setF("brandId", e.target.value)} style={inputStyle(errors.brandId)}>
                <option value="">-- Chọn thương hiệu --</option>
                {brands?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </FormField>
            <FormField label="Mục đích sử dụng *" error={errors.purposeId}>
              <select value={form.purposeId} onChange={e => setF("purposeId", e.target.value)} style={inputStyle(errors.purposeId)}>
                <option value="">-- Chọn mục đích --</option>
                {purposes?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </FormField>
            <FormField label="Kích thước màn hình">
              <select value={form.screenSizeId} onChange={e => setF("screenSizeId", e.target.value)} style={inputStyle()}>
                <option value="">-- Chọn kích thước --</option>
                {screenSizes?.map(s => <option key={s.id} value={s.id}>{s.value}"</option>)}
              </select>
            </FormField>
            <FormField label="Khuyến mãi">
              <select value={form.promotionId} onChange={e => setF("promotionId", e.target.value)} style={inputStyle()}>
                <option value="">-- Không có --</option>
                {promotions?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </FormField>
            <FormField label="Trạng thái" style={{ gridColumn: "1/-1" }}>
              <div style={{ display: "flex", gap: 12 }}>
                {[["ACTIVE", "Hoạt động", "#10b981"], ["INACTIVE", "Ẩn", "#ef4444"]].map(([val, label, color]) => (
                  <label key={val} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "10px 18px", borderRadius: 9, border: `2px solid ${form.status === val ? color : "#e5e7eb"}`, background: form.status === val ? `${color}14` : "#fff" }}>
                    <input type="radio" checked={form.status === val} onChange={() => setF("status", val)} style={{ accentColor: color }} />
                    <span style={{ fontWeight: 600, fontSize: 14, color: form.status === val ? color : "#374151" }}>{label}</span>
                  </label>
                ))}
              </div>
            </FormField>
          </div>
        )}

        {activeTab === "spec" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            {[
              ["resolution", "Độ phân giải", "VD: 1920x1080"],
              ["refreshRate", "Tần số quét", "VD: 144Hz"],
              ["panelType", "Loại tấm nền", "VD: IPS, OLED"],
              ["battery", "Dung lượng pin", "VD: 90Wh"],
              ["weight", "Trọng lượng", "VD: 2.3kg"],
              ["os", "Hệ điều hành", "VD: Windows 11"],
              ["wifi", "WiFi", "VD: WiFi 6E"],
              ["bluetooth", "Bluetooth", "VD: 5.3"],
            ].map(([key, label, ph]) => (
              <FormField key={key} label={label}>
                <input value={form.specification[key] || ""} onChange={e => setSpec(key, e.target.value)}
                  placeholder={ph} style={inputStyle()} />
              </FormField>
            ))}
            <FormField label="Cổng kết nối" style={{ gridColumn: "1/-1" }}>
              <input value={form.specification.ports || ""} onChange={e => setSpec("ports", e.target.value)}
                placeholder="VD: USB-A x3, USB-C, HDMI 2.1, SD Card" style={inputStyle()} />
            </FormField>
          </div>
        )}

        {activeTab === "image" && (
          <div>
            <div style={{ border: "2px dashed #cbd5e1", borderRadius: 12, padding: 32, textAlign: "center", background: "#f8fafc", cursor: "pointer" }}>
              <Upload size={36} style={{ color: "#94a3b8", marginBottom: 10 }} />
              <p style={{ margin: 0, fontWeight: 600, color: "#475569" }}>Kéo thả hoặc click để tải ảnh</p>
              <p style={{ margin: "6px 0 0", fontSize: 12, color: "#94a3b8" }}>PNG, JPG, WebP · Tối đa 5MB · Nhiều ảnh</p>
            </div>
            <div style={{ marginTop: 16 }}>
              <FormField label="URL ảnh đại diện (tạm thời)">
                <input value={form.imageUrl} onChange={e => setF("imageUrl", e.target.value)}
                  placeholder="https://..." style={inputStyle()} />
              </FormField>
              {form.imageUrl && (
                <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <div style={{ position: "relative", width: 100, height: 75, borderRadius: 8, overflow: "hidden", border: "2px solid #2563eb" }}>
                    <img src={form.imageUrl} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", top: 3, right: 3, background: "#2563eb", borderRadius: "50%", padding: 2 }}>
                      <Star size={10} color="#fff" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 20 }}>
        <button onClick={onBack} style={{ padding: "10px 20px", border: "1px solid #d1d5db", borderRadius: 9, background: "#fff", cursor: "pointer", fontWeight: 500, fontSize: 14, color: "#374151" }}>
          Huỷ
        </button>
        <button onClick={handleSubmit} style={{
          display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", border: "none", borderRadius: 9,
          background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 14,
          boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
        }}>
          <Save size={15} /> {isEdit ? "Lưu thay đổi" : "Tạo sản phẩm"}
        </button>
      </div>
    </div>
  );
};

export default ProductForm;