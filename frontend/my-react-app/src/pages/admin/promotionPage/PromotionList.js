// src/pages/admin/promotionPage/PromotionList.js
import React, { useState } from "react";
import { Plus, Edit, Trash2, Search, X, ChevronLeft, ChevronRight, RefreshCw, AlertCircle, Gift, BadgePercent, Calendar, ToggleLeft, ToggleRight, Tag, Zap, Clock, Percent, TrendingDown } from "lucide-react";
import { STATUS_OPTIONS, DISCOUNT_TYPES, PER_PAGE, formatPrice, formatDateDisplay, StatusBadge } from "./utils/helpers";

const PromotionList = ({ promotions, loading, error, fetchPromotions, onAdd, onEdit, onDelete, onToggleStatus }) => {
  // Local states for filtering and pagination
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Apply filters
  const filtered = promotions.filter((p) => {
    const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || p.status === filterStatus;
    const matchType = !filterType || p.discountType === filterType;
    return matchSearch && matchStatus && matchType;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', 'Be Vietnam Pro', sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .promo-row { transition: background 0.15s; animation: fadeUp 0.3s ease both; }
        .promo-row:hover { background: #f5f3ff !important; }
        .icon-btn { transition: all 0.15s; cursor: pointer; }
        .icon-btn:hover { opacity:0.85; transform:scale(1.05); }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", borderRadius: 10, padding: "6px 9px", display: "inline-flex" }}>
              <Gift size={18} color="#fff" />
            </span>
            Quản lý khuyến mãi
          </h2>
          <p style={{ margin: "5px 0 0", fontSize: 13, color: "#6b7280" }}>
            {filtered.length} khuyến mãi · {promotions.filter(p => p.status === "ACTIVE").length} đang hoạt động
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={fetchPromotions} className="icon-btn" style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "1px solid #e5e7eb", borderRadius: 9, background: "#fff", color: "#374151", fontSize: 13, fontWeight: 500 }}>
            <RefreshCw size={14} /> Làm mới
          </button>
          <button onClick={onAdd} className="icon-btn" style={{
            display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff",
            border: "none", padding: "10px 18px", borderRadius: 10, fontWeight: 600, fontSize: 14, boxShadow: "0 4px 12px rgba(109,40,217,0.3)",
          }}>
            <Plus size={16} /> Thêm khuyến mãi
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Tổng khuyến mãi", value: promotions.length, color: "#7c3aed", bg: "#ede9fe", icon: Tag },
          { label: "Đang hoạt động", value: promotions.filter(p => p.status === "ACTIVE").length, color: "#10b981", bg: "#d1fae5", icon: Zap },
          { label: "Sắp diễn ra", value: promotions.filter(p => p.status === "UPCOMING").length, color: "#f59e0b", bg: "#fef3c7", icon: Clock },
          { label: "Đã hết hạn", value: promotions.filter(p => p.status === "EXPIRED").length, color: "#ef4444", bg: "#fee2e2", icon: AlertCircle },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <div key={label} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ background: bg, borderRadius: 10, padding: 10, flexShrink: 0 }}>
              <Icon size={18} color={color} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#111827" }}>{value}</p>
              <p style={{ margin: "1px 0 0", fontSize: 12, color: "#6b7280" }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16, padding: "14px 16px", background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div style={{ position: "relative", flex: "1 1 220px" }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Tìm tên hoặc mô tả khuyến mãi..." style={{ width: "100%", paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9, border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", background: "#f9fafb" }} />
        </div>
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }} style={{ padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, background: "#f9fafb", cursor: "pointer", outline: "none", minWidth: 170 }}>
          <option value="">-- Tất cả trạng thái --</option>
          {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select value={filterType} onChange={e => { setFilterType(e.target.value); setCurrentPage(1); }} style={{ padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, background: "#f9fafb", cursor: "pointer", outline: "none", minWidth: 180 }}>
          <option value="">-- Tất cả loại giảm --</option>
          {DISCOUNT_TYPES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
        </select>
        {(search || filterStatus || filterType) && (
          <button onClick={() => { setSearch(""); setFilterStatus(""); setFilterType(""); setCurrentPage(1); }} style={{ display: "flex", alignItems: "center", gap: 5, padding: "9px 13px", border: "1px solid #fca5a5", borderRadius: 8, background: "#fef2f2", color: "#dc2626", fontSize: 13, cursor: "pointer" }}>
            <X size={13} /> Xoá bộ lọc
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        {error && (
          <div style={{ padding: 32, textAlign: "center", color: "#dc2626" }}>
            <AlertCircle size={36} style={{ marginBottom: 8, opacity: 0.6 }} />
            <p style={{ margin: 0, fontWeight: 600 }}>{error}</p>
            <button onClick={fetchPromotions} style={{ marginTop: 12, padding: "8px 16px", border: "1px solid #fca5a5", borderRadius: 8, background: "#fef2f2", color: "#dc2626", cursor: "pointer", fontWeight: 500 }}>Thử lại</button>
          </div>
        )}

        {loading && !error && (
          <div style={{ padding: 52, textAlign: "center", color: "#9ca3af" }}>
            <div style={{ width: 36, height: 36, border: "3px solid #e5e7eb", borderTop: "3px solid #7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
            <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
            <p style={{ margin: 0 }}>Đang tải dữ liệu...</p>
          </div>
        )}

        {!loading && !error && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", minWidth: 850 }}>
              <colgroup>
                <col style={{ width: 52 }} /><col /><col style={{ width: 130 }} /><col style={{ width: 120 }} /><col style={{ width: 115 }} /><col style={{ width: 115 }} /><col style={{ width: 130 }} /><col style={{ width: 165 }} />
              </colgroup>
              <thead>
                <tr style={{ background: "#faf5ff", borderBottom: "2px solid #ede9fe" }}>
                  {["ID", "Tên khuyến mãi", "Loại giảm", "Giá trị", "Bắt đầu", "Kết thúc", "Trạng thái", "Thao tác"].map(h => (
                    <th key={h} style={{ padding: "12px 10px", textAlign: "center", fontSize: 12, fontWeight: 700, color: "#5b21b6", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: 56, color: "#9ca3af" }}>
                      <Gift size={40} style={{ marginBottom: 10, opacity: 0.25 }} />
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>Không có khuyến mãi nào</p>
                      <p style={{ margin: "6px 0 0", fontSize: 13 }}>{search || filterStatus || filterType ? "Thử thay đổi bộ lọc" : "Nhấn \"Thêm khuyến mãi\" để tạo mới"}</p>
                    </td>
                  </tr>
                ) : paginated.map((p, idx) => (
                  <tr key={p.id} className="promo-row" style={{ borderBottom: "1px solid #f3f4f6", background: "#fff", animationDelay: `${idx * 0.04}s` }}>
                    <td style={{ textAlign: "center", fontSize: 12, fontWeight: 600, color: "#9ca3af" }}>#{p.id}</td>
                    <td style={{ padding: "12px 10px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                        <div style={{ flexShrink: 0, width: 34, height: 34, background: "linear-gradient(135deg,#ede9fe,#ddd6fe)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <BadgePercent size={16} color="#7c3aed" />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                          {p.description && <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.description}</p>}
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {p.discountType === "PERCENTAGE" ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, padding: "3px 9px", borderRadius: 7, background: "#eff6ff", color: "#2563eb", fontWeight: 600 }}><Percent size={11} /> Phần trăm</span>
                      ) : (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, padding: "3px 9px", borderRadius: 7, background: "#fff7ed", color: "#ea580c", fontWeight: 600 }}><TrendingDown size={11} /> Cố định</span>
                      )}
                    </td>
                    <td style={{ textAlign: "center", fontWeight: 700, fontSize: 14, color: "#7c3aed" }}>
                      {p.discountType === "PERCENTAGE" ? `${p.discountValue ?? "—"}%` : formatPrice(p.discountValue)}
                    </td>
                    <td style={{ textAlign: "center", fontSize: 12, color: "#4b5563" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Calendar size={11} color="#94a3b8" /> {formatDateDisplay(p.startDate)}</span>
                    </td>
                    <td style={{ textAlign: "center", fontSize: 12, color: "#4b5563" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Calendar size={11} color="#94a3b8" /> {formatDateDisplay(p.endDate)}</span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <StatusBadge status={p.status} />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <div style={{ display: "flex", gap: 5, justifyContent: "center", alignItems: "center" }}>
                        <button onClick={() => onToggleStatus(p)} className="icon-btn" title={p.status === "ACTIVE" ? "Tắt khuyến mãi" : "Kích hoạt"} disabled={p.status === "EXPIRED"}
                          style={{ padding: "6px 8px", borderRadius: 7, border: "1px solid", borderColor: p.status === "ACTIVE" ? "#bbf7d0" : "#e5e7eb", background: p.status === "ACTIVE" ? "#f0fdf4" : "#f9fafb", color: p.status === "ACTIVE" ? "#16a34a" : "#6b7280", opacity: p.status === "EXPIRED" ? 0.4 : 1, cursor: p.status === "EXPIRED" ? "not-allowed" : "pointer" }}>
                          {p.status === "ACTIVE" ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        </button>
                        <button onClick={() => onEdit(p)} className="icon-btn" title="Chỉnh sửa" style={{ padding: "6px 8px", borderRadius: 7, border: "1px solid #bfdbfe", background: "#eff6ff", color: "#2563eb", cursor: "pointer" }}>
                          <Edit size={14} />
                        </button>
                        <button onClick={() => onDelete(p.id, p.name)} className="icon-btn" title="Xoá" style={{ padding: "6px 8px", borderRadius: 7, border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", cursor: "pointer" }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderTop: "1px solid #f3f4f6" }}>
            <span style={{ fontSize: 13, color: "#6b7280" }}>Hiển thị {(currentPage - 1) * PER_PAGE + 1}–{Math.min(currentPage * PER_PAGE, filtered.length)} / {filtered.length}</span>
            <div style={{ display: "flex", gap: 5 }}>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: "6px 10px", border: "1px solid #e5e7eb", borderRadius: 7, background: "#fff", cursor: currentPage === 1 ? "default" : "pointer", opacity: currentPage === 1 ? 0.4 : 1 }}>
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const page = totalPages <= 7 ? i + 1 : currentPage <= 4 ? i + 1 : currentPage >= totalPages - 3 ? totalPages - 6 + i : currentPage - 3 + i;
                return (
                  <button key={page} onClick={() => setCurrentPage(page)} style={{ padding: "6px 11px", border: "1px solid", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 600, borderColor: page === currentPage ? "#7c3aed" : "#e5e7eb", background: page === currentPage ? "#7c3aed" : "#fff", color: page === currentPage ? "#fff" : "#374151" }}>
                    {page}
                  </button>
                );
              })}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ padding: "6px 10px", border: "1px solid #e5e7eb", borderRadius: 7, background: "#fff", cursor: currentPage === totalPages ? "default" : "pointer", opacity: currentPage === totalPages ? 0.4 : 1 }}>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionList;
