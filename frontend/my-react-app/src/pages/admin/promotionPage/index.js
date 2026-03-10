// src/pages/admin/promotionPage/index.js
import React, { useState, useEffect, useCallback } from "react";
import apiClient from "../../../api/axiosConfig";
import { Toast } from "./utils/helpers";
import PromotionList from "./PromotionList";
import PromotionForm from "./PromotionForm";

const PromotionPage = () => {
  const [view, setView] = useState("list"); // list | form
  const [selected, setSelected] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  // ---- FETCH ----
  const fetchPromotions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get("/promotions");
      setPromotions(res.data || []);
    } catch (err) {
      setError("Không thể tải danh sách khuyến mãi. Vui lòng thử lại.");
      console.error("Fetch promotions error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPromotions(); }, [fetchPromotions]);

  // ---- TOGGLE STATUS ----
  const handleToggleStatus = async (promo) => {
    const isActive = promo.status === "ACTIVE";
    const endpoint = isActive ? `/promotions/${promo.id}/deactivate` : `/promotions/${promo.id}/activate`;
    try {
      await apiClient.patch(endpoint);
      showToast(isActive ? "Đã tắt khuyến mãi!" : "Đã kích hoạt khuyến mãi!");
      fetchPromotions();
    } catch (err) {
      showToast("Thao tác thất bại: " + (err.response?.data?.message || err.message), "error");
    }
  };

  // ---- DELETE ----
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Xác nhận xoá khuyến mãi "${name}"?`)) return;
    try {
      await apiClient.delete(`/promotions/${id}`);
      showToast("Đã xoá khuyến mãi!");
      fetchPromotions();
    } catch (err) {
      showToast("Xoá thất bại: " + (err.response?.data?.message || err.message), "error");
    }
  };

  // ---- NAVIGATE ----
  const handleEdit = (p) => { setSelected(p); setView("form"); };
  const handleAdd = () => { setSelected(null); setView("form"); };
  const handleSaved = () => { setView("list"); fetchPromotions(); };

  return (
    <>
      <style>{`
        ::-webkit-scrollbar { width:6px; height:6px; }
        ::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:3px; }
      `}</style>
      
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {view === "list" && (
        <PromotionList
          promotions={promotions}
          loading={loading}
          error={error}
          fetchPromotions={fetchPromotions}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {view === "form" && (
        <PromotionForm
          promotion={selected}
          onSaved={handleSaved}
          onBack={() => setView("list")}
          showToast={showToast}
        />
      )}
    </>
  );
};

export default PromotionPage;