// src/pages/admin/promotionPage/PromotionForm.js
import React, { useState } from "react";
import apiClient from "../../../api/axiosConfig";
import { ArrowLeft, Save, Info, Zap, Clock } from "lucide-react";
import {
  DISCOUNT_TYPES, STATUS_OPTIONS, formatPrice, formatDateDisplay,
  formatDatetimeLocal, computeAutoStatus, StatusBadge, SectionTitle, FormField
} from "./utils/helpers";

const PromotionForm = ({ promotion, onSaved, onBack, showToast }) => {
  const isEdit = !!promotion;

  const [form, setForm] = useState({
    name: promotion?.name || "",
    description: promotion?.description || "",
    discountType: promotion?.discountType || "PERCENTAGE",
    discountValue: promotion?.discountValue ?? "",
    startDate: formatDatetimeLocal(promotion?.startDate) || "",
    endDate: formatDatetimeLocal(promotion?.endDate) || "",
    status: promotion?.status || "ACTIVE",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const setF = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Tên không được để trống";
    if (form.discountValue === "" || isNaN(Number(form.discountValue))) e.discountValue = "Giá trị giảm phải là số";
    if (Number(form.discountValue) <= 0) e.discountValue = "Giá trị giảm phải lớn hơn 0";
    if (form.discountType === "PERCENTAGE" && Number(form.discountValue) > 100) e.discountValue = "Giảm % không vượt quá 100";
    if (!form.startDate) e.startDate = "Chọn ngày bắt đầu";
    if (!form.endDate) e.endDate = "Chọn ngày kết thúc";
    if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate)) {
      e.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        discountValue: Number(form.discountValue),
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
      };
      if (isEdit) {
        await apiClient.put(`/promotions/${promotion.id}`, payload);
        showToast("Cập nhật khuyến mãi thành công!");
      } else {
        await apiClient.post("/promotions", payload);
        showToast("Tạo khuyến mãi thành công!");
      }
      onSaved();
    } catch (err) {
      showToast((isEdit ? "Cập nhật" : "Tạo") + " thất bại: " + (err.response?.data?.message || err.message), "error");
    } finally {
      setSaving(false);
    }
  };

  const previewStatus = computeAutoStatus(form.startDate, form.endDate, form.status);

  const inputStyle = (err) => ({
    width: "100%", padding: "10px 13px",
    border: `1.5px solid ${err ? "#f87171" : "#d1d5db"}`,
    borderRadius: 9, fontSize: 14, outline: "none",
    boxSizing: "border-box", background: "#fff",
    transition: "border-color 0.2s, box-shadow 0.2s",
    fontFamily: "inherit",
  });

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", maxWidth: 740, margin: "0 auto" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');
        input:focus, select:focus, textarea:focus { border-color:#7c3aed !important; box-shadow: 0 0 0 3px rgba(124,58,237,0.12); }
      `}</style>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 26 }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "1px solid #e5e7eb", borderRadius: 9, background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#374151" }}>
          <ArrowLeft size={15} /> Quay lại
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>
            {isEdit ? `Chỉnh sửa: ${promotion.name}` : "Tạo khuyến mãi mới"}
          </h2>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>
            {isEdit ? "Cập nhật thông tin khuyến mãi" : "Điền đầy đủ các trường bắt buộc (*)"}
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 18, alignItems: "start" }}>
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: 26, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <SectionTitle icon={Info} label="Thông tin cơ bản" />
          <div style={{ display: "grid", gap: 18 }}>
            <FormField label="Tên khuyến mãi *" error={errors.name}>
              <input value={form.name} onChange={e => setF("name", e.target.value)} placeholder="VD: Summer Sale 2025" style={inputStyle(errors.name)} />
            </FormField>

            <FormField label="Mô tả">
              <textarea value={form.description} onChange={e => setF("description", e.target.value)} rows={3} placeholder="Mô tả chi tiết về chương trình..." style={{ ...inputStyle(false), resize: "vertical", minHeight: 88 }} />
            </FormField>

            <FormField label="Loại giảm giá *">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {DISCOUNT_TYPES.map(({ value, label, icon: Icon }) => (
                  <label key={value} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", padding: "12px 14px", borderRadius: 10, border: `2px solid ${form.discountType === value ? "#7c3aed" : "#e5e7eb"}`, background: form.discountType === value ? "#faf5ff" : "#fff", transition: "all 0.15s" }}>
                    <input type="radio" checked={form.discountType === value} onChange={() => setF("discountType", value)} style={{ accentColor: "#7c3aed" }} />
                    <Icon size={16} color={form.discountType === value ? "#7c3aed" : "#6b7280"} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: form.discountType === value ? "#5b21b6" : "#374151" }}>{label}</span>
                  </label>
                ))}
              </div>
            </FormField>

            <FormField label={`Giá trị giảm * ${form.discountType === "PERCENTAGE" ? "(0–100%)" : "(VNĐ)"}`} error={errors.discountValue}>
              <div style={{ position: "relative" }}>
                <input type="number" value={form.discountValue} onChange={e => setF("discountValue", e.target.value)} placeholder={form.discountType === "PERCENTAGE" ? "VD: 15" : "VD: 500000"} min={0} max={form.discountType === "PERCENTAGE" ? 100 : undefined} style={{ ...inputStyle(errors.discountValue), paddingRight: 52 }} />
                <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 14, fontWeight: 700, color: "#7c3aed" }}>{form.discountType === "PERCENTAGE" ? "%" : "₫"}</span>
              </div>
            </FormField>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <FormField label="Ngày bắt đầu *" error={errors.startDate}>
                <input type="datetime-local" value={form.startDate} onChange={e => setF("startDate", e.target.value)} style={inputStyle(errors.startDate)} />
              </FormField>
              <FormField label="Ngày kết thúc *" error={errors.endDate}>
                <input type="datetime-local" value={form.endDate} onChange={e => setF("endDate", e.target.value)} style={inputStyle(errors.endDate)} />
              </FormField>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: 20, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <SectionTitle icon={Zap} label="Trạng thái" />
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {STATUS_OPTIONS.filter(s => s.value !== "EXPIRED" && s.value !== "UPCOMING").map(({ value, label, color, bg, border }) => (
                <label key={value} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", padding: "10px 13px", borderRadius: 9, border: `2px solid ${form.status === value ? border : "#e5e7eb"}`, background: form.status === value ? bg : "#fff", transition: "all 0.15s" }}>
                  <input type="radio" checked={form.status === value} onChange={() => setF("status", value)} style={{ accentColor: color }} />
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: form.status === value ? color : "#374151" }}>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ background: "linear-gradient(135deg,#5b21b6,#7c3aed)", borderRadius: 14, padding: 20, color: "#fff", boxShadow: "0 6px 20px rgba(109,40,217,0.3)" }}>
            <p style={{ margin: "0 0 4px", fontSize: 11, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>Xem trước</p>
            <p style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700, lineHeight: 1.3 }}>{form.name || "Tên khuyến mãi"}</p>

            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "10px 14px", marginBottom: 12, textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>
                {form.discountValue ? (form.discountType === "PERCENTAGE" ? `${form.discountValue}%` : formatPrice(form.discountValue)) : "—"}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 12, opacity: 0.8 }}>
                {form.discountType === "PERCENTAGE" ? "Giảm phần trăm" : "Giảm số tiền cố định"}
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
              {[["Bắt đầu", form.startDate], ["Kết thúc", form.endDate]].map(([lbl, val]) => (
                <div key={lbl} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 10px" }}>
                  <p style={{ margin: 0, fontSize: 10, opacity: 0.7 }}>{lbl}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 12, fontWeight: 600 }}>{val ? formatDateDisplay(val) : "—"}</p>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center" }}><StatusBadge status={previewStatus} /></div>
          </div>

          {form.startDate && form.endDate && new Date(form.endDate) > new Date(form.startDate) && (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 14px", display: "flex", gap: 9, alignItems: "flex-start" }}>
              <Clock size={16} color="#16a34a" style={{ marginTop: 1, flexShrink: 0 }} />
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#15803d" }}>Thời gian hiệu lực</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#16a34a" }}>
                  {(() => {
                    const diff = new Date(form.endDate) - new Date(form.startDate);
                    const days = Math.floor(diff / 86400000);
                    const hours = Math.floor((diff % 86400000) / 3600000);
                    return days > 0 ? `${days} ngày ${hours > 0 ? `${hours} giờ` : ""}` : `${hours} giờ`;
                  })()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 22 }}>
        <button onClick={onBack} style={{ padding: "10px 20px", border: "1px solid #d1d5db", borderRadius: 9, background: "#fff", cursor: "pointer", fontWeight: 500, fontSize: 14, color: "#374151" }}>Huỷ</button>
        <button onClick={handleSubmit} disabled={saving} style={{
          display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", border: "none", borderRadius: 9,
          background: saving ? "#a78bfa" : "linear-gradient(135deg,#7c3aed,#6d28d9)",
          color: "#fff", cursor: saving ? "not-allowed" : "pointer", fontWeight: 600, fontSize: 14,
          boxShadow: saving ? "none" : "0 4px 12px rgba(109,40,217,0.3)", transition: "all 0.2s",
        }}>
          {saving ? <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Đang lưu...</> : <><Save size={15} /> {isEdit ? "Lưu thay đổi" : "Tạo khuyến mãi"}</>}
        </button>
      </div>
    </div>
  );
};

export default PromotionForm;