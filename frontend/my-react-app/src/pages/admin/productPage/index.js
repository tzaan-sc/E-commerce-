// src/pages/admin/productPage/index.js
import React, { useState } from "react";
import { BASE_URL, Toast } from "./helpers";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";
import VariantManagement from "./VariantManagement";

const ProductsPage = () => {
  const [view, setView] = useState("list"); // 'list' | 'form' | 'variants'
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState(null);

  // Danh sách các danh mục, cấu hình (bạn sẽ fetch từ API về sau)
  const [brands, setBrands] = useState([]);
  const [purposes, setPurposes] = useState([]);
  const [screenSizes, setScreenSizes] = useState([]);
  const [promotions, setPromotions] = useState([]);
  
  // Dữ liệu cho Variant
  const [ramList, setRamList] = useState([]);
  const [gpuList, setGpuList] = useState([]);
  const [chipList, setChipList] = useState([]);
  const [storageList, setStorageList] = useState([]);
  const [colorList, setColorList] = useState([]);

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchAllData = () => {
    // TODO: Viết logic gọi API lấy lại list products và các danh mục ở đây
    console.log("Đã gọi fetchAllData"); 
  };

  const handleImportFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${BASE_URL}/api/products/import`, {
        method: "POST",
        body: formData
      });

      const result = await res.json();

      if (res.ok) {
        showToast(`Nhập thành công ${result.count || ""} sản phẩm!`);
        fetchAllData();
      } else {
        showToast(result.message || "Lỗi import file", "error");
      }
    } catch (err) {
      showToast("Không kết nối được server", "error");
    }

    e.target.value = null;
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xác nhận xoá sản phẩm này?")) {
      try {
        // Giả sử gọi API xóa sản phẩm
        // await fetch(`${BASE_URL}/api/products/${id}`, { method: "DELETE" });
        setProducts(prev => prev.filter(p => p.id !== id));
        showToast("Đã xoá sản phẩm!");
      } catch (error) {
         showToast("Lỗi xoá sản phẩm", "error");
      }
    }
  };

  const handleSaveProduct = async (data) => {
    try {
      const method = data.id ? "PUT" : "POST";
      const url = data.id
        ? `${BASE_URL}/api/products/${data.id}`
        : `${BASE_URL}/api/products`;

      // Giả sử bạn gọi API
      // const res = await fetch(url, {
      //   method,
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data)
      // });
      // if (!res.ok) throw new Error("Save failed");

      // Cập nhật state tạm thời
      if(data.id) {
          setProducts(prev => prev.map(p => p.id === data.id ? data : p));
      } else {
          setProducts(prev => [...prev, {...data, id: Date.now()}]);
      }

      showToast("Lưu sản phẩm thành công");
      fetchAllData();
      setView("list");

    } catch (err) {
      showToast("Lỗi lưu sản phẩm", "error");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');
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
          onImport={handleImportFile}
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
          onUpdateProduct={(updated) => setProducts(prev => prev.map(p => p.id === updated.id ? updated : p))}
          fetchAllData={fetchAllData}
        />
      )}
    </>
  );
};

export default ProductsPage;