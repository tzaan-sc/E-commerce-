// src/pages/admin/productPage/VariantManagement.js
import React, { useState } from "react";
import { ArrowLeft, Plus, Edit, Trash2, Cpu, Monitor, Package, HardDrive, Palette, Layers } from "lucide-react";
import { formatPrice, StatusBadge, BASE_URL } from "./helpers";
import VariantFormModal from "./VariantFormModal";

const VariantManagement = ({ product, onBack, showToast, onUpdateProduct, fetchAllData, ramList, gpuList, chipList, storageList, colorList }) => {
  const [variants, setVariants] = useState(product?.variants || []);
  const [showForm, setShowForm] = useState(false);
  const [editVariant, setEditVariant] = useState(null);

  const handleSave = (variantData) => {
    let updated;
    if (editVariant) {
      updated = variants.map(v => v.id === variantData.id ? variantData : v);
      showToast("Cập nhật biến thể thành công!");
    } else {
      updated = [...variants, { ...variantData, id: Date.now() }];
      showToast("Thêm biến thể thành công!");
    }
    setVariants(updated);
    onUpdateProduct({ ...product, variants: updated });
    setShowForm(false);
    setEditVariant(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa biến thể?")) return;
    try {
      // Giả sử API delete biến thể
      // await fetch(`${BASE_URL}/api/products/variants/${id}`, { method: "DELETE" });
      
      // Update local state temporarily
      const updated = variants.filter(v => v.id !== id);
      setVariants(updated);
      onUpdateProduct({ ...product, variants: updated });
      
      fetchAllData();
      showToast("Đã xoá biến thể");
    } catch {
      showToast("Lỗi xoá biến thể", "error");
    }
  };

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      {showForm && (
        <VariantFormModal
          variant={editVariant}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditVariant(null); }}
          ramList={ramList}
          gpuList={gpuList}
          chipList={chipList}
          storageList={storageList}
          colorList={colorList}
        />
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "1px solid #e5e7eb", borderRadius: 9, background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
          <ArrowLeft size={15} /> Quay lại
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>Biến thể: {product?.name}</h2>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>{variants.length} biến thể đang có</p>
        </div>
        <button onClick={() => { setEditVariant(null); setShowForm(true); }} style={{
          marginLeft: "auto", display: "flex", alignItems: "center", gap: 7,
          padding: "10px 18px", border: "none", borderRadius: 9,
          background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
          color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 14,
          boxShadow: "0 4px 12px rgba(109,40,217,0.3)",
        }}>
          <Plus size={15} /> Thêm biến thể
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
        {variants.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: "#9ca3af", background: "#fff", borderRadius: 14, border: "2px dashed #e5e7eb" }}>
            <Layers size={40} style={{ marginBottom: 10, opacity: 0.3 }} />
            <p style={{ margin: 0, fontWeight: 600 }}>Chưa có biến thể nào</p>
            <p style={{ margin: "6px 0 0", fontSize: 13 }}>Click "Thêm biến thể" để bắt đầu</p>
          </div>
        ) : variants.map(v => (
          <div key={v.id} style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: 18, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", transition: "box-shadow 0.2s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.05em" }}>SKU</span>
                <p style={{ margin: "2px 0 0", fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{v.sku}</p>
              </div>
              <StatusBadge status={v.isActive} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
              {[
                [Cpu, "CPU", v.chipName], [Monitor, "GPU", v.gpuName],
                [Package, "RAM", v.ramSize], [HardDrive, "Lưu trữ", v.storageDisplay],
                [Palette, "Màu", v.colorName],
              ].map(([Icon, label, val], i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, background: "#f8fafc", padding: "7px 10px", borderRadius: 8 }}>
                  <Icon size={13} style={{ color: "#7c3aed", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "#6b7280" }}>{label}: </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{val}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
              <div>
                <p style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#2563eb" }}>{formatPrice(v.price)}</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>Tồn kho: <span style={{ fontWeight: 600, color: v.stockQuantity > 5 ? "#16a34a" : "#dc2626" }}>{v.stockQuantity}</span></p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { setEditVariant(v); setShowForm(true); }} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", border: "1px solid #bfdbfe", borderRadius: 8, background: "#eff6ff", color: "#2563eb", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
                  <Edit size={13} /> Sửa
                </button>
                <button onClick={() => handleDelete(v.id)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", border: "1px solid #fecaca", borderRadius: 8, background: "#fef2f2", color: "#dc2626", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VariantManagement;
