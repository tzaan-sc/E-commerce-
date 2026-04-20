import { toast } from 'react-toastify';
import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Save, Laptop, Cpu, Image as ImageIcon, Upload, Star, X, Loader2, Link as LinkIcon } from "lucide-react";
import { FormField } from "./helpers";
import axios from "axios";

const ProductForm = ({ product, onSave, onBack, brands, purposes, screenSizes, promotions }) => {
  const isEdit = !!product;
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const BASE_URL = "http://localhost:8080";

  // ✅ LOGIC TÍNH TỔNG KHO TỪ BIẾN THỂ
  const calculateTotalStock = (variants) => {
    if (!variants || variants.length === 0) return product?.stockQuantity || 0;
    return variants.reduce((sum, v) => sum + (Number(v.stockQuantity) || 0), 0);
  };

  const [form, setForm] = useState({
    id: product?.id || null,
    name: product?.name || "", 
    slug: product?.slug || "",
    description: product?.description || "", 
    status: product?.status || "ACTIVE",
    // ✅ CHỈNH: Lấy tổng tồn kho từ biến thể
    stockQuantity: calculateTotalStock(product?.variants),
    // ✅ CHỈNH: Lấy đúng ID từ object lồng nhau trong Database
    brandId: product?.brand?.id || product?.brandId || "", 
    brandName: product?.brand?.name || product?.brandName || "",
    screenSizeId: product?.screenSize?.id || product?.screenSizeId || "", 
    screenSizeValue: product?.screenSize?.value || product?.screenSizeValue || "",
    purposeId: product?.usagePurpose?.id || product?.purposeId || "", 
    purposeName: product?.usagePurpose?.name || product?.purposeName || "",
    promotionId: product?.promotion?.id || product?.promotionId || "", 
    promotionName: product?.promotion?.name || product?.promotionName || "",
    imageUrl: product?.imageUrl || "", 
    specification: product?.specification || { resolution: "", refreshRate: "", panelType: "", battery: "", weight: "", os: "", wifi: "", bluetooth: "", ports: "" },
    variants: product?.variants || [],
  });

  // ✅ ĐẢM BẢO DỮ LIỆU ĐƯỢC CẬP NHẬT KHI PRODUCT THAY ĐỔI (DÙNG CHO TRƯỜNG HỢP CHỈNH SỬA)
  useEffect(() => {
    if (product) {
      setForm({
        ...product,
        stockQuantity: calculateTotalStock(product.variants),
        brandId: product.brand?.id || product.brandId || "",
        screenSizeId: product.screenSize?.id || product.screenSizeId || "",
        purposeId: product.usagePurpose?.id || product.purposeId || "",
        promotionId: product.promotion?.id || product.promotionId || "",
        specification: product.specification || { resolution: "", refreshRate: "", panelType: "", battery: "", weight: "", os: "", wifi: "", bluetooth: "", ports: "" }
      });
    }
  }, [product]);

  const [activeTab, setActiveTab] = useState("general");
  const [errors, setErrors] = useState({});

  const setF = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setSpec = (key, val) => setForm(f => ({ ...f, specification: { ...f.specification, [key]: val } }));

  const handleFileUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file); 

    setIsUploading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/uploads/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const serverUrl = response.data.url; 
      setF("imageUrl", serverUrl);
    } catch (error) {
      console.error("Lỗi upload:", error);
      toast.error("Không thể tải ảnh lên thư mục Backend!");
    } finally {
      setIsUploading(false);
    }
  };

  const getPreviewUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const onFileSelect = (e) => { handleFileUpload(e.target.files[0]); };
  const onDrop = (e) => { e.preventDefault(); handleFileUpload(e.dataTransfer.files[0]); };

  const autoSlug = (name) => name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

  const validate = () => {
    const e = {};
    if (!form.name || !form.name.trim()) e.name = "Tên sản phẩm không được để trống";
    if (!form.brandId) e.brandId = "Chọn thương hiệu";
    if (!form.purposeId) e.purposeId = "Chọn mục đích sử dụng";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      setActiveTab("general"); 
      return;
    }

    const brand = brands?.find(b => String(b.id) === String(form.brandId));
    const purpose = purposes?.find(p => String(p.id) === String(form.purposeId));
    const screen = screenSizes?.find(s => String(s.id) === String(form.screenSizeId));
    const promo = promotions?.find(p => String(p.id) === String(form.promotionId));

    const specData = { ...form.specification };
    
    const finalData = { 
      ...form, 
      brandId: form.brandId ? Number(form.brandId) : null,
      purposeId: form.purposeId ? Number(form.purposeId) : null,
      screenSizeId: form.screenSizeId ? Number(form.screenSizeId) : null,
      promotionId: form.promotionId ? Number(form.promotionId) : null,
      stockQuantity: Number(form.stockQuantity || 0),
      specification: specData,
      brandName: brand?.name || "", 
      purposeName: purpose?.name || "", 
      screenSizeValue: screen?.value || "", 
      promotionName: promo?.name || null 
    };

    console.log("Dữ liệu gửi lên server:", finalData);
    onSave(finalData);
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
            <FormField label="Số lượng tồn kho tổng (Tự động cộng từ biến thể)" style={{ gridColumn: "1/-1" }}>
              <input type="number" value={form.stockQuantity} readOnly style={{ ...inputStyle(), background: "#f3f4f6", cursor: "not-allowed", fontWeight: 'bold', color: '#2563eb' }} />
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
          <div onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
            <input type="file" ref={fileInputRef} onChange={onFileSelect} style={{ display: "none" }} accept="image/*" />
            
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: "#f8fafc", padding: 16, borderRadius: 12, border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, color: "#475569" }}>
                  <LinkIcon size={16} /> <span style={{ fontWeight: 600, fontSize: 13 }}>Nhập link ảnh trực tiếp</span>
                </div>
                <input 
                  value={form.imageUrl && form.imageUrl.startsWith('http') ? form.imageUrl : ""} 
                  onChange={e => setF("imageUrl", e.target.value)} 
                  placeholder="https://example.com/laptop-image.jpg" 
                  style={inputStyle()} 
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1, height: 1, background: "#e2e8f0" }}></div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8" }}>HOẶC</span>
                <div style={{ flex: 1, height: 1, background: "#e2e8f0" }}></div>
              </div>

              <div 
                onClick={() => fileInputRef.current.click()}
                style={{ 
                  border: "2px dashed #cbd5e1", borderRadius: 12, padding: 32, 
                  textAlign: "center", background: "#f8fafc", cursor: "pointer",
                  transition: "border-color 0.2s"
                }}
              >
                {isUploading ? (
                  <>
                    <Loader2 size={36} className="animate-spin" style={{ color: "#2563eb", marginBottom: 10, margin: "0 auto" }} />
                    <p style={{ margin: 0, fontWeight: 600, color: "#2563eb" }}>Đang tải ảnh lên...</p>
                  </>
                ) : (
                  <>
                    <Upload size={36} style={{ color: "#94a3b8", marginBottom: 10 }} />
                    <p style={{ margin: 0, fontWeight: 600, color: "#475569" }}>Kéo thả hoặc click để tải ảnh từ máy tính</p>
                    <p style={{ margin: "4px 0 0", fontSize: 11, color: "#94a3b8" }}>File sẽ được lưu vào thư mục server</p>
                  </>
                )}
              </div>
            </div>

            {form.imageUrl && (
              <div style={{ marginTop: 24, padding: 16, border: "1px solid #e5e7eb", borderRadius: 12 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 12 }}>Ảnh sản phẩm hiện tại:</p>
                <div style={{ position: "relative", width: 140, height: 100, borderRadius: 10, overflow: "hidden", border: "2px solid #2563eb", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
                  <img 
                    src={getPreviewUrl(form.imageUrl)} 
                    alt="preview" 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  />
                  <div style={{ position: "absolute", top: 4, right: 4, background: "#2563eb", borderRadius: "50%", padding: 2 }}>
                    <Star size={10} color="#fff" />
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setF("imageUrl", ""); }}
                    style={{ position: "absolute", top: 4, left: 4, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", padding: 2, cursor: "pointer" }}
                  >
                    <X size={10} color="#ef4444" />
                  </button>
                </div>
                <div style={{ marginTop: 8 }}>
                  <p style={{ fontSize: 11, color: "#64748b", wordBreak: "break-all" }}>
                    <strong>Nguồn:</strong> {form.imageUrl.startsWith('http') ? "Link bên ngoài" : "Tệp máy chủ"}
                  </p>
                  <p style={{ fontSize: 11, color: "#94a3b8" }}>{form.imageUrl}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 20 }}>
        <button onClick={onBack} style={{ padding: "10px 20px", border: "1px solid #d1d5db", borderRadius: 9, background: "#fff", cursor: "pointer", fontWeight: 500, fontSize: 14, color: "#374151" }}>
          Huỷ
        </button>
        <button onClick={handleSubmit} disabled={isUploading} style={{
          display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", border: "none", borderRadius: 9,
          background: isUploading ? "#94a3b8" : "linear-gradient(135deg, #2563eb, #1d4ed8)", 
          color: "#fff", cursor: isUploading ? "not-allowed" : "pointer", fontWeight: 600, fontSize: 14,
          boxShadow: isUploading ? "none" : "0 4px 12px rgba(37,99,235,0.3)",
        }}>
          <Save size={15} /> {isEdit ? "Lưu thay đổi" : "Tạo sản phẩm"}
        </button>
      </div>
    </div>
  );
};

export default ProductForm;