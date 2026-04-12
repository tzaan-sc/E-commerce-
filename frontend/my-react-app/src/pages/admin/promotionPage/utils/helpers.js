// src/pages/admin/promotionPage/utils/helpers.js
import React, { useEffect } from "react";
import { Percent, TrendingDown, CheckCircle, AlertCircle, X } from "lucide-react";

export const DISCOUNT_TYPES = [
  { value: "PERCENTAGE", label: "Giảm theo %", icon: Percent },
  { value: "FIXED_AMOUNT", label: "Giảm số tiền cố định", icon: TrendingDown },
];

export const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Đang hoạt động", color: "#10b981", bg: "#d1fae5", border: "#34d399" },
  { value: "INACTIVE", label: "Không hoạt động", color: "#6b7280", bg: "#f3f4f6", border: "#d1d5db" },
  { value: "EXPIRED", label: "Đã hết hạn", color: "#ef4444", bg: "#fee2e2", border: "#f87171" },
  { value: "UPCOMING", label: "Sắp diễn ra", color: "#f59e0b", bg: "#fef3c7", border: "#fbbf24" },
];

export const PER_PAGE = 8;

export const getStatusConfig = (status) =>
  STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[1];

export const formatPrice = (n) =>
  n != null ? Number(n).toLocaleString("vi-VN") + "₫" : "—";

export const formatDateDisplay = (str) => {
  if (!str) return "—";
  const d = new Date(str);
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

export const formatDatetimeLocal = (str) => {
  if (!str) return "";
  const d = new Date(str);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const computeAutoStatus = (startDate, endDate, currentStatus) => {
  if (currentStatus === "INACTIVE") return "INACTIVE";
  const now = new Date();
  if (endDate && new Date(endDate) < now) return "EXPIRED";
  if (startDate && new Date(startDate) > now) return "UPCOMING";
  return "ACTIVE";
};

export const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div style={{
      position: "fixed", top: 20, right: 20, zIndex: 99999,
      display: "flex", alignItems: "center", gap: 10,
      background: type === "success" ? "#064e3b" : "#7f1d1d",
      color: "#fff", padding: "13px 20px", borderRadius: 12,
      boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
      animation: "slideInRight 0.3s ease", fontSize: 14, fontWeight: 500,
      maxWidth: 340,
    }}>
      {type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      <span>{message}</span>
      <button onClick={onClose} style={{ marginLeft: 8, background: "transparent", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", padding: 2 }}>
        <X size={14} />
      </button>
    </div>
  );
};

export const StatusBadge = ({ status }) => {
  const cfg = getStatusConfig(status);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "4px 11px", borderRadius: 999, fontSize: 12, fontWeight: 600,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
      whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
};

export const SectionTitle = ({ icon: Icon, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 18, paddingBottom: 12, borderBottom: "1px solid #f3f4f6" }}>
    <Icon size={15} color="#7c3aed" />
    <span style={{ fontSize: 13, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
  </div>
);

export const FormField = ({ label, error, children, style }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
    <label style={{ fontWeight: 600, fontSize: 13, color: "#374151" }}>{label}</label>
    {children}
    {error && <span style={{ fontSize: 12, color: "#ef4444", display: "flex", alignItems: "center", gap: 4 }}><AlertCircle size={12} />{error}</span>}
  </div>
);
