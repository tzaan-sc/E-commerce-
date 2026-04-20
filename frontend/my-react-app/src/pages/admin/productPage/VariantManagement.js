import React, { useState } from "react";
import { ArrowLeft, Plus, Edit, Trash2, Cpu, Monitor, Package, HardDrive, Palette, Layers, Image as ImageIcon } from "lucide-react"; 
import { formatPrice, StatusBadge, BASE_URL } from "./helpers";
import VariantFormModal from "./VariantFormModal";
import axios from "axios";

const VariantManagement = ({ product, onBack, showToast, onUpdateProduct, fetchAllData, ramList, gpuList, chipList, storageList, colorList }) => {
  const [variants, setVariants] = useState(product?.variants || []);
  const [showForm, setShowForm] = useState(false);
  const [editVariant, setEditVariant] = useState(null);

  const handleSave = async (variantData) => {
    try {
      const payload = { ...variantData, productId: product.id };
      const response = await axios.post(`${BASE_URL}/api/variants`, payload);

      if (response.data) {
        showToast(editVariant ? "Cập nhật biến thể thành công!" : "Thêm biến thể thành công!");
        const savedVariant = response.data;
        let updated;
        if (editVariant) {
          updated = variants.map(v => v.id === savedVariant.id ? savedVariant : v);
        } else {
          updated = [...variants, savedVariant];
        }
        setVariants(updated);
        onUpdateProduct({ ...product, variants: updated });
        setShowForm(false);
        setEditVariant(null);
        if (fetchAllData) fetchAllData();
      }
    } catch (error) {
      console.error("Lỗi khi lưu biến thể:", error);
      showToast(error.response?.data?.message || "Lỗi không thể lưu vào Database", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa vĩnh viễn biến thể này khỏi Database?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/variants/${id}`);
      const updated = variants.filter(v => v.id !== id);
      setVariants(updated);
      onUpdateProduct({ ...product, variants: updated });
      if (fetchAllData) fetchAllData();
      showToast("Đã xoá biến thể thành công");
    } catch (error) {
      showToast("Lỗi khi xóa biến thể trong Database", "error");
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
          </div>
        ) : variants.map(v => (
          <div key={v.id} style={{ 
  background: "#fff", 
  borderRadius: 16, // Bo góc mềm mại hơn
  border: "1px solid #e5e7eb", 
  padding: 20, // Padding rộng rãi hơn
  boxShadow: "0 2px 10px rgba(0,0,0,0.04)" // Shadow nhẹ sang trọng
}}>
  
  {/* ✅ KHU VỰC ẢNH BIẾN THỂ ĐÃ CHỈNH SỬA: Chuyên nghiệp hơn */}
  <div style={{ display: "flex", gap: 10, marginBottom: 18, alignItems: "center" }}>
    <div style={{ 
      display: "flex", gap: 8, overflowX: "auto", flex: 1, paddingBottom: 5 
    }}>
      {((v.imageUrls && v.imageUrls.length > 0) || (v.images && v.images.length > 0)) ? (
        (v.imageUrls || v.images).map((img, index) => {
          const rawSrc = typeof img === 'string' ? img : img.imageUrl;
          if (!rawSrc) return null;
          const fullSrc = rawSrc.startsWith("http") ? rawSrc : `${BASE_URL}${rawSrc}`;
          
          return (
            <img 
              key={index} 
              src={fullSrc} 
              alt="variant" 
              style={{ 
                width: 58, 
                height: 58, 
                objectFit: "cover", 
                borderRadius: 10, 
                border: index === 0 ? "2px solid #7c3aed" : "1px solid #f1f5f9", // Ảnh đầu tiên làm ảnh chính
                flexShrink: 0,
                boxShadow: index === 0 ? "0 4px 10px rgba(124,58,237,0.1)" : "none"
              }} 
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = "https://placehold.co/58x58/e2e8f0/94a3b8?text=Loi"; 
              }}
            />
          );
        })
      ) : (
        <div style={{ width: "100%", height: 58, background: "#f8fafc", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed #e2e8f0" }}>
          <ImageIcon size={18} style={{ color: "#94a3b8", marginRight: 8 }} />
          <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>Chưa có ảnh biến thể</span>
        </div>
      )}
    </div>

    {/* Nút Sửa/Xóa ảnh được đưa vào đây cho gọn (nếu cần) */}
  </div>

  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
    <div>
      <span style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.05em" }}>Mã hàng (SKU)</span>
      <p style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 600, color: "#111827" }}>{v.sku}</p>
    </div>
    {/* ✅ Chỗ hoạt động đẹp hơn: Tên gọi rõ ràng, bo góc fit */}
    <span style={{ 
      fontSize: 12, 
      fontWeight: 600, 
      padding: "5px 12px", 
      borderRadius: 100, // Bo tròn hoàn toàn dạng pill
      background: v.isActive ? "#dcfce7" : "#fee2e2", 
      color: v.isActive ? "#166534" : "#991b1b",
      border: `1px solid ${v.isActive ? "#bbf7d0" : "#fecaca"}` // Thêm border nhẹ
    }}>
      {v.isActive ? "● Hoạt động" : "○ Tạm ẩn"}
    </span>
  </div>

  {/* ✅ PHẦN CẤU HÌNH ĐÃ CHỈNH SỬA: Tự fit nội dung, nhảy hàng khi tràn */}
  <div style={{ 
    display: "flex", 
    flexWrap: "wrap", // Chìa khóa: Cho phép nhảy hàng
    gap: 8, 
    marginBottom: 16,
    padding: "12px",
    background: "#f9fafb",
    borderRadius: 12,
    border: "1px solid #f1f5f9"
  }}>
    {[
      [Cpu, "CPU", v.chipName || v.chip?.cpuName], 
      [Monitor, "GPU", v.gpuName || v.gpu?.gpuName],
      [Package, "RAM", v.ramSize || v.ram?.ramSize], 
      [HardDrive, "Lưu trữ", v.storageDisplay || (v.storage ? `${v.storage.capacity} ${v.storage.storageType}` : "")],
      [Palette, "Màu", v.colorName || v.color?.colorName],
    ].map(([Icon, label, val], i) => (
      <div key={i} style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 6, 
        background: "#fff", 
        padding: "6px 12px", // Thêm padding ngang
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        width: "fit-content", // Khung vừa khít nội dung
        maxWidth: "100%",     // Không tràn quá cha
      }}>
        <Icon size={12} style={{ color: "#7c3aed", flexShrink: 0 }} />
        <span style={{ fontSize: 11, color: "#6b7280", whiteSpace: "nowrap" }}>{label}: </span>
        <span style={{ 
          fontSize: 12, 
          fontWeight: 600, 
          color: "#1f2937",
          // Cho phép text xuống dòng nếu quá dài thay vì bị cắt
          wordBreak: "break-word" 
        }}>
          {val || "—"}
        </span>
      </div>
    ))}
  </div>

  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: "1px solid #f1f5f9" }}>
    <div>
      <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#2563eb" }}>{formatPrice(v.price)}</p>
      <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>Tồn kho: <span style={{ fontWeight: 700, color: v.stockQuantity > 5 ? "#16a34a" : "#dc2626" }}>{v.stockQuantity}</span></p>
    </div>
    <div style={{ display: "flex", gap: 8 }}>
      <button onClick={() => { setEditVariant(v); setShowForm(true); }} className="icon-btn-edit" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "1px solid #bfdbfe", borderRadius: 9, background: "#eff6ff", color: "#2563eb", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
        <Edit size={13} /> Sửa
      </button>
      <button onClick={() => handleDelete(v.id)} className="icon-btn-delete" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "1px solid #fecaca", borderRadius: 9, background: "#fef2f2", color: "#dc2626", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
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