// src/pages/admin/productPage/ProductList.js
import React, { useState, useRef } from "react";
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight, Package, RefreshCw, FileDown, Layers } from "lucide-react";
import { getProductImage, StatusBadge } from "./helpers";

const ProductList = ({
  products, onAdd, onEdit, onVariants, onDelete, onImport,
  brands, purposes
}) => {
  const [search, setSearch] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterPurpose, setFilterPurpose] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;
  const fileInputRef = useRef(null);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchBrand = !filterBrand || p.brandId === Number(filterBrand);
    const matchPurpose = !filterPurpose || p.purposeId === Number(filterPurpose);
    const matchStatus = !filterStatus || p.status === filterStatus;
    return matchSearch && matchBrand && matchPurpose && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', 'Be Vietnam Pro', sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform: translateY(0); } }
        .prod-row:hover { background: #f0f5ff !important; }
        .prod-row { animation: fadeUp 0.3s ease both; }
        .icon-btn:hover { opacity: 0.85; transform: scale(1.05); }
        .icon-btn { transition: all 0.15s; }
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
          <input value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Tìm kiếm tên sản phẩm..."
            style={{ width: "100%", paddingLeft: 36, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", background: "#f9fafb" }} />
        </div>
        {[
          { label: "Thương hiệu", val: filterBrand, set: setFilterBrand, opts: brands?.map(b => ({ v: b.id, l: b.name })) || [] },
          { label: "Mục đích", val: filterPurpose, set: setFilterPurpose, opts: purposes?.map(p => ({ v: p.id, l: p.name })) || [] },
          { label: "Trạng thái", val: filterStatus, set: setFilterStatus, opts: [{ v: "ACTIVE", l: "Hoạt động" }, { v: "INACTIVE", l: "Ẩn" }] },
        ].map(({ label, val, set, opts }, idx) => (
          <select key={idx} value={val} onChange={e => { set(e.target.value); setCurrentPage(1); }}
            style={{ padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, background: "#f9fafb", cursor: "pointer", minWidth: 140, outline: "none" }}>
            <option value="">-- {label} --</option>
            {opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
        ))}
        {(search || filterBrand || filterPurpose || filterStatus) && (
          <button onClick={() => { setSearch(""); setFilterBrand(""); setFilterPurpose(""); setFilterStatus(""); setCurrentPage(1); }}
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
              <col style={{ width: 50 }} /><col style={{ width: 70 }} /><col /><col style={{ width: 100 }} />
              <col style={{ width: 110 }} /><col style={{ width: 105 }} /><col style={{ width: 110 }} />
              <col style={{ width: 115 }} /><col style={{ width: 160 }} />
            </colgroup>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                {["ID", "Ảnh", "Tên sản phẩm", "Thương hiệu", "Màn hình", "Mục đích", "Khuyến mãi", "Trạng thái", "Thao tác"]
                  .map(h => (
                    <th key={h} style={{ padding: "12px 10px", textAlign: "center", fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: "center", padding: 48, color: "#9ca3af" }}>
                  <Package size={36} style={{ marginBottom: 8, opacity: 0.3 }} /><br />Không tìm thấy sản phẩm nào
                </td></tr>
              ) : paginated.map((p, idx) => (
                <tr key={p.id} className="prod-row" style={{ borderBottom: "1px solid #f1f5f9", background: "#fff", animationDelay: `${idx * 0.05}s` }}>
                  <td style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>#{p.id}</td>
                  <td style={{ textAlign: "center", padding: "10px 8px" }}>
                    <div style={{ width: 56, height: 42, borderRadius: 8, overflow: "hidden", margin: "0 auto", border: "1px solid #e5e7eb" }}>
                      <img src={getProductImage(p)} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.src = "https://placehold.co/56x42/f1f5f9/94a3b8?text=IMG"} />
                    </div>
                  </td>
                  <td style={{ padding: "10px 10px" }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.slug}</div>
                    <div style={{ fontSize: 11, color: "#2563eb", marginTop: 2 }}>{p.variants?.length || 0} biến thể</div>
                  </td>
                  <td style={{ textAlign: "center", fontSize: 13, fontWeight: 500 }}>{p.brandName}</td>
                  <td style={{ textAlign: "center", fontSize: 13 }}>{p.screenSizeValue}"</td>
                  <td style={{ textAlign: "center" }}>
                    <span style={{ fontSize: 12, padding: "3px 8px", borderRadius: 6, background: "#eff6ff", color: "#2563eb", fontWeight: 500 }}>{p.purposeName}</span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {p.promotionName
                      ? <span style={{ fontSize: 12, padding: "3px 8px", borderRadius: 6, background: "#fff7ed", color: "#ea580c", fontWeight: 500 }}>{p.promotionName}</span>
                      : <span style={{ color: "#cbd5e1", fontSize: 12 }}>—</span>}
                  </td>
                  <td style={{ textAlign: "center" }}><StatusBadge status={p.status} /></td>
                  <td style={{ textAlign: "center" }}>
                    <div style={{ display: "flex", gap: 4, justifyContent: "center", flexWrap: "nowrap" }}>
                      <button onClick={() => onVariants(p)} className="icon-btn" title="Quản lý biến thể" style={{ padding: "6px 8px", borderRadius: 7, border: "1px solid #ddd6fe", background: "#ede9fe", color: "#7c3aed", cursor: "pointer" }}>
                        <Layers size={14} />
                      </button>
                      <button onClick={() => onEdit(p)} className="icon-btn" title="Chỉnh sửa" style={{ padding: "6px 8px", borderRadius: 7, border: "1px solid #bfdbfe", background: "#eff6ff", color: "#2563eb", cursor: "pointer" }}>
                        <Edit size={14} />
                      </button>
                      <button onClick={() => onDelete(p.id)} className="icon-btn" title="Xoá" style={{ padding: "6px 8px", borderRadius: 7, border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", cursor: "pointer" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: "1px solid #f1f5f9" }}>
            <span style={{ fontSize: 13, color: "#6b7280" }}>
              Hiển thị {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)} / {filtered.length}
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                style={{ padding: "6px 10px", border: "1px solid #e5e7eb", borderRadius: 7, background: "#fff", cursor: currentPage === 1 ? "default" : "pointer", opacity: currentPage === 1 ? 0.4 : 1 }}>
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                <button key={pg} onClick={() => setCurrentPage(pg)}
                  style={{ padding: "6px 12px", border: "1px solid", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 600, borderColor: pg === currentPage ? "#2563eb" : "#e5e7eb", background: pg === currentPage ? "#2563eb" : "#fff", color: pg === currentPage ? "#fff" : "#374151" }}>
                  {pg}
                </button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                style={{ padding: "6px 10px", border: "1px solid #e5e7eb", borderRadius: 7, background: "#fff", cursor: currentPage === totalPages ? "default" : "pointer", opacity: currentPage === totalPages ? 0.4 : 1 }}>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
