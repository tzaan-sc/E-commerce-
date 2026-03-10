// src/pages/admin/productPage/helpers.js
import React, { useEffect } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

export const BASE_URL = "http://localhost:8080";

export const getProductImage = (p) => {
  let url = "";
  if (p.images && p.images.length > 0) {
    url = p.images[0].urlImage || p.images[0];
  } else if (p.imageUrl) {
    url = p.imageUrl;
  }
  if (!url) return "https://via.placeholder.com/80x60";
  if (url.startsWith("http")) return url;
  return `${BASE_URL}${url}`;
};

export const formatPrice = (p) => p?.toLocaleString("vi-VN") + "₫";

export const StatusBadge = ({ status }) => {
  const active = status === "ACTIVE" || status === true;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600,
      background: active ? "#d1fae5" : "#fee2e2",
      color: active ? "#065f46" : "#991b1b",
      border: `1px solid ${active ? "#34d399" : "#f87171"}`,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: active ? "#10b981" : "#ef4444", display: "inline-block" }} />
      {active ? "Hoạt động" : "Ẩn"}
    </span>
  );
};

export const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{
      position: "fixed", top: 20, right: 20, zIndex: 99999,
      display: "flex", alignItems: "center", gap: 10,
      background: type === "success" ? "#065f46" : "#991b1b",
      color: "#fff", padding: "12px 18px", borderRadius: 10,
      boxShadow: "0 8px 30px rgba(0,0,0,0.2)", animation: "slideIn 0.3s ease",
      fontSize: 14, fontWeight: 500,
    }}>
      {type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      {message}
    </div>
  );
};

export const FormField = ({ label, error, children, style }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
    <label style={{ fontWeight: 600, fontSize: 13, color: "#374151" }}>{label}</label>
    {children}
    {error && <span style={{ fontSize: 12, color: "#ef4444" }}>{error}</span>}
  </div>
);