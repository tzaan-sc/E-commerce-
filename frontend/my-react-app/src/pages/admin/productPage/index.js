import React, { useState, useEffect } from "react";
import apiClient from "../../../api/axiosConfig";
import { Toast } from "./helpers";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";
import VariantManagement from "./VariantManagement";

const ProductsPage = () => {
  const [view, setView] = useState("list"); 
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState(null);

  // ✅ QUẢN LÝ PHÂN TRANG VÀ BỘ LỌC
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    brandId: "",
    purposeId: "",
    status: ""
  });

  // Danh mục dữ liệu thật từ DB
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

  // ✅ CHỨC NĂNG MỚI: NHẬP FILE EXCEL
  const handleImportExcel = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Kiểm tra nhanh định dạng ở client
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
      showToast("Vui lòng chọn file Excel (.xlsx hoặc .xls)", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    showToast("Đang tải file và xử lý dữ liệu...", "info");

    try {
      const response = await apiClient.post("/products/import", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.status === "success" || response.status === 200) {
        showToast(response.data.message || "✅ Nhập sản phẩm thành công!");
        fetchProducts(); // Tải lại danh sách sau khi nhập
      }
    } catch (error) {
      console.error("Lỗi Import:", error);
      const errorMsg = error.response?.data?.message || "❌ Lỗi khi nhập file Excel!";
      showToast(errorMsg, "error");
    } finally {
      // Reset input file để có thể chọn lại chính file đó nếu cần
      event.target.value = "";
    }
  };

  // ✅ HÀM LẤY SẢN PHẨM
  const fetchProducts = async () => {
    try {
      const cleanParams = { page: page, size: 10 };
      if (filters.search) cleanParams.search = filters.search;
      if (filters.brandId) cleanParams.brandId = filters.brandId;
      if (filters.purposeId) cleanParams.purposeId = filters.purposeId;
      if (filters.status) cleanParams.status = filters.status;

      const prodRes = await apiClient.get("/products", { params: cleanParams });
      const data = prodRes.data;

      if (data && data.content) {
        setProducts(data.content); 
        setTotalPages(data.totalPages);
      } else if (Array.isArray(data)) {
        setProducts(data);
        setTotalPages(1);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Lỗi fetch products:", error);
      showToast("Lỗi kết nối API sản phẩm", "error");
    }
  };

  // ✅ HÀM LẤY OPTIONS
  const fetchHardwareOptions = async () => {
    try {
      const hwRes = await apiClient.get("/hardware-options/all");
      const hwData = hwRes.data;
      
      setBrands(hwData.brands || hwData.brandList || []);
      setPurposes(hwData.purposes || hwData.usagePurposes || []);
      setScreenSizes(hwData.screenSizes || []);
      setRamList(hwData.rams || hwData.ramList || []);
      setGpuList(hwData.gpus || hwData.gpuList || []);
      setChipList(hwData.chips || hwData.chipList || []);
      setStorageList(hwData.storages || hwData.storageList || []);
      setColorList(hwData.colors || hwData.colorList || []);

      const promoRes = await apiClient.get("/promotions");
      setPromotions(promoRes.data || []);
    } catch (error) {
      console.error("Lỗi fetch options:", error);
    }
  };

  useEffect(() => { fetchHardwareOptions(); }, []);
  useEffect(() => { fetchProducts(); }, [page, filters]); 

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    try {
      await apiClient.delete(`/products/${id}`);
      showToast("Đã xóa sản phẩm!");
      fetchProducts(); 
    } catch (error) {
      showToast("Xóa thất bại!", "error");
    }
  };

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
      fetchProducts();
    } catch (error) {
      const msg = error.response?.data?.message || "Lỗi khi lưu sản phẩm";
      showToast(msg, "error");
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(0); 
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
          
          // ✅ ĐÃ CẬP NHẬT HÀM IMPORT Ở ĐÂY
          onImport={handleImportExcel}
          
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          filters={filters}
          onFilterChange={handleFilterChange}
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
          onUpdateProduct={fetchProducts} 
        />
      )}
    </>
  );
};

export default ProductsPage;