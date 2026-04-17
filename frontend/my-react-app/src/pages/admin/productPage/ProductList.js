import React, { useState, useRef } from "react";
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight, Package, RefreshCw, FileDown, Layers } from "lucide-react";
import { getProductImage, StatusBadge } from "./helpers";

const ProductList = ({
  products, onAdd, onEdit, onVariants, onDelete, onImport,
  brands, purposes,
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  const [search, setSearch] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterPurpose, setFilterPurpose] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const fileInputRef = useRef(null);

  // GIỮ NGUYÊN LOGIC LỌC FRONT-END CỦA HIỂN
  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const pBrandId = p.brandId || p.brand?.id;
    const matchBrand = !filterBrand || Number(pBrandId) === Number(filterBrand);
    const pPurposeId = p.purposeId || p.usagePurpose?.id;
    const matchPurpose = !filterPurpose || Number(pPurposeId) === Number(filterPurpose);
    const matchStatus = !filterStatus || p.status === filterStatus;

    return matchSearch && matchBrand && matchPurpose && matchStatus;
  });

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', 'Be Vietnam Pro', sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform: translateY(0); } }
        .prod-row:hover { background: #f0f5ff !important; }
        .prod-row { animation: fadeUp 0.3s ease both; }
        .icon-btn:hover { opacity: 0.85; transform: scale(1.05); }
        .icon-btn { transition: all 0.15s; }
        .page-btn { 
          display: flex; alignItems: center; gap: 6px; padding: 8px 16px; 
          border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; 
          font-weight: 600; font-size: 13px; cursor: pointer; transition: all 0.2s;
        }
        .page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .page-btn:not(:disabled):hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }
      `}</style>

      {/* Header Actions */}
      <div style={{ display: "flex", gap: 10 }}>
        <input type="file" ref={fileInputRef} onChange={onImport} style={{ display: "none" }} accept=".csv,.xlsx,.xls" />
        <button onClick={() => fileInputRef.current.click()} className="icon-btn" style={{
          display: "flex", alignItems: "center", gap: 8, background: "#f1f5f9",
          border: "1px solid #d1d5db", padding: "10px 16px", borderRadius: 10,
          fontWeight: 600, fontSize: 14, cursor: "pointer"
        }}>
          <FileDown size={16} /> Nhập file
        </button>
        <button onClick={onAdd} className="icon-btn" style={{
          display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
          color: "#fff", border: "none", padding: "10px 18px", borderRadius: 10,
          fontWeight: 600, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 12px rgba(37,99,235,0.3)"
        }}>
          <Plus size={16} /> Thêm sản phẩm
        </button>
      </div>

      {/* Filters */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 18, marginTop: 18,
        padding: "14px 16px", background: "#fff", borderRadius: 12,
        border: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <div style={{ position: "relative", flex: "1 1 220px" }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo tên sản phẩm..."
            style={{ width: "100%", paddingLeft: 36, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", background: "#f9fafb" }} />
        </div>
        
        <select value={filterBrand} onChange={e => setFilterBrand(e.target.value)}
          style={{ padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, background: "#f9fafb", cursor: "pointer", minWidth: 140, outline: "none" }}>
          <option value="">-- Thương hiệu --</option>
          {brands?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>

        <select value={filterPurpose} onChange={e => setFilterPurpose(e.target.value)}
          style={{ padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, background: "#f9fafb", cursor: "pointer", minWidth: 140, outline: "none" }}>
          <option value="">-- Mục đích --</option>
          {purposes?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, background: "#f9fafb", cursor: "pointer", minWidth: 140, outline: "none" }}>
          <option value="">-- Trạng thái --</option>
          <option value="ACTIVE">Hoạt động</option>
          <option value="INACTIVE">Ẩn</option>
        </select>

        {(search || filterBrand || filterPurpose || filterStatus) && (
          <button onClick={() => { setSearch(""); setFilterBrand(""); setFilterPurpose(""); setFilterStatus(""); }}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 12px", border: "1px solid #fca5a5", borderRadius: 8, background: "#fef2f2", color: "#dc2626", fontSize: 13, cursor: "pointer" }}>
            <RefreshCw size={13} /> Xoá lọc
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 50 }} />
              <col style={{ width: 70 }} />
              <col style={{ width: 250 }} />
              <col style={{ width: 130 }} />
              <col style={{ width: 110 }} />
              <col style={{ width: 120 }} />
              <col style={{ width: 110 }} />
              <col style={{ width: 140 }} />
            </colgroup>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                {["ID", "Ảnh", "Tên sản phẩm", "Thương hiệu", "Tổng kho", "Mục đích", "Trạng thái", "Thao tác"]
                  .map(h => (
                    <th key={h} style={{ padding: "12px 10px", textAlign: "center", fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: 48, color: "#9ca3af" }}>
                  <Package size={36} style={{ marginBottom: 8, opacity: 0.3 }} /><br />Không tìm thấy sản phẩm nào ở trang này
                </td></tr>
              ) : filtered.map((p, idx) => {
                const totalStock = p.variants?.reduce((sum, v) => sum + (Number(v.stockQuantity) || 0), 0) || 0;

                return (
                  <tr key={p.id} className="prod-row" style={{ borderBottom: "1px solid #f1f5f9", background: "#fff", animationDelay: `${idx * 0.05}s` }}>
                    <td style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>#{p.id}</td>
                    <td style={{ textAlign: "center", padding: "10px 8px" }}>
                      <div style={{ width: 56, height: 42, borderRadius: 8, overflow: "hidden", margin: "0 auto", border: "1px solid #e5e7eb" }}>
                        <img src={getProductImage(p)} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.src = "https://placehold.co/56x42/f1f5f9/94a3b8?text=IMG"} />
                      </div>
                    </td>
                    <td style={{ padding: "10px 10px" }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{p.variants?.length || 0} biến thể</div>
                    </td>
                    <td style={{ textAlign: "center", fontSize: 13, fontWeight: 500 }}>{p.brand?.name || p.brandName}</td>
                    <td style={{ textAlign: "center" }}>
                      <span style={{ 
                        fontSize: 13, fontWeight: 700, 
                        color: totalStock > 10 ? "#16a34a" : (totalStock > 0 ? "#ea580c" : "#dc2626") 
                      }}>{totalStock}</span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span style={{ fontSize: 12, padding: "3px 8px", borderRadius: 6, background: "#eff6ff", color: "#2563eb", fontWeight: 500 }}>{p.usagePurpose?.name || p.purposeName}</span>
                    </td>
                    <td style={{ textAlign: "center" }}><StatusBadge status={p.status} /></td>
                    <td style={{ textAlign: "center" }}>
                      <div style={{ display: "flex", gap: 4, justifyContent: "center", flexWrap: "nowrap" }}>
                        <button onClick={() => onVariants(p)} className="icon-btn" title="Quản lý biến thể" style={{ padding: "6px 8px", borderRadius: 7, border: "1px solid #ddd6fe", background: "#ede9fe", color: "#7c3aed", cursor: "pointer" }}><Layers size={14} /></button>
                        
                        {/* ✅ NÚT CHỈNH SỬA: ĐÃ CẬP NHẬT ĐẦY ĐỦ LOGIC PHẲNG HÓA DỮ LIỆU ✅ */}
                        <button 
                          onClick={() => {
                            const spec = p.specification || {};
                            const preparedProduct = {
                              ...p, // Giữ lại toàn bộ dữ liệu gốc (bao gồm price, description, slug)
                              
                              // 1. Phẳng hóa ID cho Select (Ép về String để khớp Option)
                              brandId: p.brand?.id ? String(p.brand.id) : (p.brandId ? String(p.brandId) : ""),
                              purposeId: p.usagePurpose?.id ? String(p.usagePurpose.id) : (p.purposeId ? String(p.purposeId) : ""),
                              screenSizeId: p.screenSize?.id ? String(p.screenSize.id) : (p.screenSizeId ? String(p.screenSizeId) : ""),
                              
                              // ✅ QUAN TRỌNG: Phẳng hóa Khuyến mãi
                              promotionId: p.promotion?.id ? String(p.promotion.id) : (p.promotionId ? String(p.promotionId) : ""),
                              
                              // 2. ✅ QUAN TRỌNG: Phẳng hóa Specification để hiện trong Tab Thông số
                              resolution: spec.resolution || "",
                              refreshRate: spec.refreshRate || "",
                              panelType: spec.panelType || "",
                              batteryCapacity: spec.batteryCapacity || "",
                              weight: spec.weight || "",
                              os: spec.os || "",
                              wifi: spec.wifi || "",
                              bluetooth: spec.bluetooth || "" ,
                              ports: spec.ports || "",

                              // 3. ✅ QUAN TRỌNG: Phẳng hóa mảng ảnh để hiện Review
                              imageUrls: (p.images && p.images.length > 0) ? p.images.map(img => img.urlImage) : [""]
                            };
                            onEdit(preparedProduct);
                          }} 
                          className="icon-btn" title="Chỉnh sửa" style={{ padding: "6px 8px", borderRadius: 7, border: "1px solid #bfdbfe", background: "#eff6ff", color: "#2563eb", cursor: "pointer" }}
                        >
                          <Edit size={14} />
                        </button>

                        <button onClick={() => onDelete(p.id)} className="icon-btn" title="Xoá" style={{ padding: "6px 8px", borderRadius: 7, border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", cursor: "pointer" }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Chuyển trang */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>
            Trang <strong style={{ color: "#1e293b" }}>{(Number(currentPage) || 0) + 1}</strong> / {Number(totalPages) || 1}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="page-btn" disabled={(Number(currentPage) || 0) <= 0} onClick={() => onPageChange((Number(currentPage) || 0) - 1)}>
              <ChevronLeft size={16} /> Trang trước
            </button>
            <button className="page-btn" disabled={(Number(currentPage) || 0) >= (Number(totalPages) || 1) - 1} onClick={() => onPageChange((Number(currentPage) || 0) + 1)}>
              Trang sau <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;