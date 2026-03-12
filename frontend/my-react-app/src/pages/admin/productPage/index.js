// src/pages/admin/productPage/index.js
import React, { useState, useEffect } from "react";
import apiClient from "../../../api/axiosConfig";
import { Toast } from "./helpers";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";
import VariantManagement from "./VariantManagement";

const ProductsPage = () => {
  const [view, setView] = useState("list"); // 'list' | 'form' | 'variants'
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState(null);

  // Danh mục
  const [brands, setBrands] = useState([]);
  const [purposes, setPurposes] = useState([]);
  const [screenSizes, setScreenSizes] = useState([]);
  const [promotions, setPromotions] = useState([]);
  
  // Dữ liệu cấu hình cho Variant
  const [ramList, setRamList] = useState([]);
  const [gpuList, setGpuList] = useState([]);
  const [chipList, setChipList] = useState([]);
  const [storageList, setStorageList] = useState([]);
  const [colorList, setColorList] = useState([]);

  const showToast = (message, type = "success") => setToast({ message, type });

  // 👇 GỌI API LẤY DỮ LIỆU TỪ BACKEND
  const fetchAllData = async () => {
    try {
      // 1. Lấy danh sách sản phẩm
      const prodRes = await apiClient.get("/products");
      setProducts(prodRes.data || []);

      // 2. Lấy TẤT CẢ danh mục & phần cứng từ API gộp đã tạo
      const hwRes = await apiClient.get("/hardware-options/all");
      const hwData = hwRes.data;

      setBrands(hwData.brands || []);
      setPurposes(hwData.purposes || []);
      setScreenSizes(hwData.screenSizes || []);
      setRamList(hwData.rams || []);
      setGpuList(hwData.gpus || []);
      setChipList(hwData.chips || []);
      setStorageList(hwData.storages || []);
      setColorList(hwData.colors || []);

      // 3. Lấy danh sách khuyến mãi
      const promoRes = await apiClient.get("/promotions");
      setPromotions(promoRes.data || []);

    } catch (error) {
      console.error("Lỗi khi fetch data:", error);
      showToast("Không thể kết nối đến máy chủ!", "error");
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Xử lý Xóa sản phẩm
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    try {
      await apiClient.delete(`/products/${id}`);
      showToast("Đã xóa sản phẩm!");
      fetchAllData(); // Refresh list
    } catch (error) {
      showToast("Xóa thất bại!", "error");
    }
  };

  // Xử lý Lưu sản phẩm (Thêm mới / Cập nhật)
  const handleSaveProduct = async (formData) => {
    try {
      if (formData.id) {
        await apiClient.put(`/products/${formData.id}`, formData);
        showToast("Cập nhật sản phẩm thành công!");
      } else {
        await apiClient.post("/products", formData);
        showToast("Thêm sản phẩm thành công!");
      }
      setView("list");
      fetchAllData();
    } catch (error) {
      const msg = error.response?.data?.message || "Lỗi khi lưu sản phẩm";
      showToast(msg, "error");
    }
  };

  return (
    <>
      <style>{`
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
      `}</style>
      
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {view === "list" && (
        <ProductList
          products={products}
          brands={brands}
          purposes={purposes}
          onAdd={() => { setSelectedProduct(null); setView("form"); }}
          onEdit={(p) => { setSelectedProduct(p); setView("form"); }}
          onVariants={(p) => { setSelectedProduct(p); setView("variants"); }}
          onDelete={handleDelete}
          onImport={() => showToast("Chức năng Import đang phát triển", "info")}
        />
      )}

      {view === "form" && (
        <ProductForm
          product={selectedProduct}
          brands={brands}
          purposes={purposes}
          screenSizes={screenSizes}
          promotions={promotions}
          onSave={handleSaveProduct}
          onBack={() => setView("list")}
          showToast={showToast}
        />
      )}

      {view === "variants" && (
        <VariantManagement
          product={selectedProduct}
          ramList={ramList}
          gpuList={gpuList}
          chipList={chipList}
          storageList={storageList}
          colorList={colorList}
          onBack={() => setView("list")}
          showToast={showToast}
          onUpdateProduct={() => fetchAllData()} 
        />
      )}
    </>
  );
};

export default ProductsPage;