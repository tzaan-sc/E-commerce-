import React, { useState, useEffect, useRef,useMemo } from 'react';
// import axios from 'axios'; // You can remove axios if you use apiClient
import apiClient from "../../../api/axiosConfig"; // 👈 FIXED IMPORT PATH
import ImportProductModal from '../../../components/page/ImportProductModal';

import { Save,Upload } from 'lucide-react';
import {
  LayoutDashboard,
  Laptop,
  Users,
  ShoppingCart,
  Tag,
  Monitor,
  Target,
  LogOut,
  Menu,
  X,
  Plus,
  Edit,
  Trash2,
  Search,
   ChevronLeft, ChevronRight, UploadCloud,FileSpreadsheet
} from 'lucide-react';
import useGenericApi from 'hooks/useGenericApi';
import '../style.scss';
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Modal Thêm/Sửa
  const [showModal, setShowModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // 👇 Modal Import Excel (MỚI)
  const [showImportModal, setShowImportModal] = useState(false);

  // State loading khi upload ảnh
  const [isUploading, setIsUploading] = useState(false);

  // State cho phân trang & tìm kiếm
  const [debouncedSearch, setDebouncedSearch] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);          
  const itemsPerPage = 10;                                  

  // Form state
  const [formData, setFormData] = useState({
    name: "", slug: "", description: "", price: "", stockQuantity: "", 
    imageUrls: "", brandId: "", usagePurposeId: "", screenSizeId: "", specifications: "",
  });

  const [brands, setBrands] = useState([]);
  const [usagePurposes, setUsagePurposes] = useState([]);
  const [screenSizes, setScreenSizes] = useState([]);

  // Hàm tải danh sách sản phẩm riêng lẻ (để gọi lại sau khi Import)
  const fetchProductsOnly = async () => {
      try {
          const res = await fetch("http://localhost:8080/api/products");
          const data = await res.json();
          setProducts(data);
      } catch (e) { console.error("Lỗi reload products", e); }
  };

  // 1. Fetch dữ liệu ban đầu
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [resP, resB, resU, resS] = await Promise.all([
          fetch("http://localhost:8080/api/products"),
          fetch("http://localhost:8080/api/brands"),
          fetch("http://localhost:8080/api/usage-purposes"),
          fetch("http://localhost:8080/api/screen-sizes")
        ]);
        const [dataP, dataB, dataU, dataS] = await Promise.all([
          resP.json(), resB.json(), resU.json(), resS.json()
        ]);
        setProducts(dataP);
        setBrands(dataB);
        setUsagePurposes(dataU);
        setScreenSizes(dataS);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchAllData();
  }, []);

  // 2. Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); 
    }, 500); 
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const resetForm = () => {
    setFormData({ name: "", slug: "", description: "", price: "", stockQuantity: "", imageUrls: "", brandId: "", usagePurposeId: "", screenSizeId: "", specifications: "" });
  };

  const handleAddProduct = () => { resetForm(); setEditingProductId(null); setShowModal(true); };
  const handleCloseModal = () => { setShowModal(false); resetForm(); setEditingProductId(null); };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "name") {
      const slug = value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const getProductImage = (p) => {
    if (p.images && p.images.length > 0) {
        const img = p.images[0];
        const url = img.urlImage || img;
        return url.startsWith("http") ? url : `http://localhost:8080${url}`;
    }
    if (p.imageUrl) {
        return p.imageUrl.startsWith("http") ? p.imageUrl : `http://localhost:8080${p.imageUrl}`;
    }
    return "https://via.placeholder.com/80x60?text=No+Img";
  };

  const uploadFromUrl = async (urlOnline) => {
    try {
        const res = await fetch("http://localhost:8080/api/uploads/image-from-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: urlOnline })
        });
        const data = await res.json();
        if (res.ok) return data.url;
        else { console.error("Lỗi tải ảnh:", data.error); return null; }
    } catch (err) { console.error("Lỗi kết nối:", err); return null; }
  };

  const handleAutoUploadImages = async () => {
    if (!formData.imageUrls.trim()) return;
    setIsUploading(true);
    const lines = formData.imageUrls.split('\n');
    const newLines = [];
    let hasChange = false;

    for (let line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith("http") && !trimmedLine.includes("/uploads/products/")) {
            const newUrl = await uploadFromUrl(trimmedLine);
            if (newUrl) { newLines.push(newUrl); hasChange = true; } 
            else { newLines.push(trimmedLine); }
        } else {
            newLines.push(trimmedLine);
        }
    }
    setFormData(prev => ({ ...prev, imageUrls: newLines.join('\n') }));
    setIsUploading(false);
    if (hasChange) alert("Đã tải ảnh về server thành công!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const imageList = formData.imageUrls.split('\n').map(url => url.trim()).filter(url => url !== "");
      const payload = {
        name: formData.name, slug: formData.slug, description: formData.description,
        price: parseFloat(formData.price), stockQuantity: parseInt(formData.stockQuantity),
        imageUrls: imageList, imageUrl: imageList.length > 0 ? imageList[0] : "",
        brandId: parseInt(formData.brandId), usagePurposeId: parseInt(formData.usagePurposeId), screenSizeId: parseInt(formData.screenSizeId),
        specifications: formData.specifications,
      };

      let res;
      const url = editingProductId ? `http://localhost:8080/api/products/${editingProductId}` : "http://localhost:8080/api/products";
      const method = editingProductId ? "PUT" : "POST";

      res = await fetch(url, { method: method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });

      if (!res.ok) throw new Error("Lỗi lưu sản phẩm!");
      
      // Refresh list
      await fetchProductsOnly();

      handleCloseModal();
      alert(editingProductId ? "Cập nhật thành công!" : "Thêm sản phẩm thành công!");
    } catch (err) { console.error(err); alert("Lỗi: " + err.message); }
  };

  const handleEditProduct = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    setEditingProductId(productId);
    setShowModal(true);

    let imagesString = "";
    if (product.images && product.images.length > 0) {
        imagesString = product.images.map(img => img.urlImage || img).join("\n");
    } else if (product.imageUrl) {
        imagesString = product.imageUrl;
    }

    setFormData({
      name: product.name, slug: product.slug, description: product.description || "",
      price: product.price, stockQuantity: product.stockQuantity,
      imageUrls: imagesString, 
      brandId: product.brand?.id || "", usagePurposeId: product.usagePurpose?.id || "", screenSizeId: product.screenSize?.id || "",
      specifications: product.specifications || "",
    });
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Xóa thất bại!");
      setProducts(products.filter((p) => p.id !== id));
      alert("Xóa thành công!");
    } catch (err) { console.error(err); alert("Lỗi khi xóa sản phẩm!"); }
  };

  // --- LOGIC LỌC VÀ PHÂN TRANG ---
  const filteredProducts = useMemo(() => 
    products.filter((p) => p.name.toLowerCase().includes(debouncedSearch.toLowerCase())), 
  [products, debouncedSearch]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (loading) return <div style={{padding: '20px', textAlign: 'center'}}>Đang tải dữ liệu...</div>;

  return (
    <div className="page-card">
      <div className="page-card__header">
        <div className="search-box">
          <Search className="search-box__icon" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-box__input"
          />
        </div>
        {/* 👇 CỤM NÚT BẤM */}
        <div style={{display: 'flex', gap: '10px'}}>
            <button 
                className="btn" 
                onClick={() => setShowImportModal(true)}
                style={{backgroundColor: '#10b981', color: 'white', display: 'flex', alignItems: 'center', gap: '5px'}}
            >
                <FileSpreadsheet size={20} /> Nhập Excel
            </button>
            <button className="btn btn--primary" onClick={handleAddProduct}>
                <Plus size={20} /> Thêm sản phẩm
            </button>
        </div>
      </div>

      {/* TABLE LIST - GIỮ NGUYÊN ĐỊNH DẠNG CHUẨN, KHÔNG GIẬT */}
      <div className="table-container">
        {filteredProducts.length === 0 ? (
          <p style={{padding: '20px', textAlign: 'center'}}>Không có sản phẩm phù hợp</p>
        ) : (
          <>
            <table 
                className="data-table" 
                style={{width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed'}}
            >
              <thead>
                <tr style={{background: '#f4f4f4', height: '50px', textAlign: 'left'}}>
                  <th style={{width: '50px', padding: '10px'}}>ID</th> 
                  <th style={{width: '100px', padding: '10px'}}>Ảnh</th> 
                  <th style={{minWidth: '200px', padding: '10px'}}>Tên</th> 
                  <th style={{width: '120px', padding: '10px'}}>Thương hiệu</th> 
                  <th style={{width: '120px', padding: '10px'}}>Giá</th> 
                  <th style={{width: '70px', padding: '10px'}}>Kho</th> 
                  <th style={{width: '90px', padding: '10px'}}>Màn hình</th> 
                  <th style={{width: '100px', padding: '10px'}}>Mục đích</th> 
                  <th style={{width: '150px', padding: '10px'}}>Mô tả</th> 
                  <th style={{width: '150px', padding: '10px'}}>Thông số</th> 
                  <th style={{width: '100px', padding: '10px'}}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((p) => (
                  <tr key={p.id} style={{height: '90px', borderBottom: '1px solid #eee'}}>
                    <td style={{padding: '10px'}}>{p.id}</td>
                    <td style={{padding: '10px'}}>
                      <div style={{width: '80px', height: '60px', background: '#f9f9f9', borderRadius: '4px', overflow: 'hidden'}}>
                          <img
                            src={getProductImage(p)}
                            loading="lazy"
                            alt={p.name}
                            style={{ width: '100%', height: '100%', objectFit: "contain" }}
                            onError={(e) => { e.target.src = "https://via.placeholder.com/80x60?text=Error"; }}
                          />
                      </div>
                    </td>
                    <td style={{padding: '10px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} title={p.name}>{p.name}</td>
                    <td style={{padding: '10px'}}>{p.brand?.name}</td>
                    <td style={{padding: '10px', color: '#d70018', fontWeight: 'bold'}}>{new Intl.NumberFormat('vi-VN').format(p.price)} đ</td>
                    <td style={{padding: '10px', textAlign: 'center'}}>{p.stockQuantity}</td>
                    <td style={{padding: '10px'}}>{p.screenSize?.value} inch</td>
                    <td style={{padding: '10px'}}>{p.usagePurpose?.name}</td>
                    <td style={{padding: '10px', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '13px', color: '#666'}} title={p.description}>{p.description}</td>
                    <td style={{padding: '10px', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '12px', color: '#666'}} title={p.specifications}>{p.specifications}</td>
                    <td style={{padding: '10px'}}>
                      <div style={{display: 'flex', gap: '8px'}}>
                          <button className="action-btn action-btn--edit" onClick={() => handleEditProduct(p.id)}> <Edit size={18} /> </button>
                          <button className="action-btn action-btn--delete" onClick={() => handleDeleteProduct(p.id)}> <Trash2 size={18} /> </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '20px' }}>
                <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    style={{ padding: '5px 10px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
                >
                    <ChevronLeft size={20} />
                </button>
                
                <span style={{ alignSelf: 'center' }}>Trang {currentPage} / {totalPages}</span>

                <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    style={{ padding: '5px 10px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
                >
                    <ChevronRight size={20} />
                </button>
            </div>
          </>
        )}
      </div>

      {/* MODAL EDIT/ADD SẢN PHẨM */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProductId ? "Cập nhật sản phẩm" : "Thêm Sản Phẩm Mới"}</h2>
              <button className="modal-close" onClick={handleCloseModal}> <X size={26} /> </button>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="modal-grid">
                <div className="form-group"> <label>Tên Sản Phẩm *</label> <input className="modal-input" name="name" value={formData.name} onChange={handleInputChange} required /> </div>
                <div className="form-group"> <label>Slug *</label> <input className="modal-input" name="slug" value={formData.slug} onChange={handleInputChange} required /> </div>
                <div className="form-group form-full"> <label>Mô tả</label> <textarea className="modal-textarea" name="description" value={formData.description} onChange={handleInputChange} rows={3} /> </div>
                
                <div className="form-group form-full"> <label>Thông số kỹ thuật (JSON)</label> <textarea className="modal-textarea" name="specifications" value={formData.specifications} onChange={handleInputChange} rows={3} style={{fontFamily: 'monospace', fontSize: '13px'}} placeholder='[ {"label": "CPU", "value": "i7"} ]'/> </div>
                
                <div className="form-group"> <label>Giá (VND) *</label> <input type="number" className="modal-input" name="price" value={formData.price} onChange={handleInputChange} required /> </div>
                <div className="form-group"> <label>Số lượng *</label> <input type="number" className="modal-input" name="stockQuantity" value={formData.stockQuantity} onChange={handleInputChange} required /> </div>
                <div className="form-group"> <label>Thương hiệu</label> <select className="modal-select" name="brandId" value={formData.brandId} onChange={handleInputChange} required > <option value="">-- Chọn --</option> {brands.map((b) => (<option key={b.id} value={b.id}>{b.name}</option>))} </select> </div>
                <div className="form-group"> <label>Mục đích</label> <select className="modal-select" name="usagePurposeId" value={formData.usagePurposeId} onChange={handleInputChange} required > <option value="">-- Chọn --</option> {usagePurposes.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))} </select> </div>
                <div className="form-group"> <label>Màn hình</label> <select className="modal-select" name="screenSizeId" value={formData.screenSizeId} onChange={handleInputChange} required > <option value="">-- Chọn --</option> {screenSizes.map((s) => (<option key={s.id} value={s.id}>{s.value} inch</option>))} </select> </div>

                <div className="form-group form-full">
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px'}}>
                      <label>Link hình ảnh (Mỗi link một dòng)</label>
                      <button 
                        type="button" 
                        onClick={handleAutoUploadImages}
                        disabled={isUploading}
                        style={{
                            fontSize: '12px', 
                            padding: '4px 12px', 
                            cursor: 'pointer',
                            backgroundColor: isUploading ? '#9ca3af' : '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'background-color 0.2s'
                        }}
                      >
                        <UploadCloud size={16}/>
                        {isUploading ? "Đang tải..." : "Tải ảnh online về Server"}
                      </button>
                  </div>
                  <textarea className="modal-textarea" name="imageUrls" value={formData.imageUrls} onChange={handleInputChange} rows={4} placeholder="https://cdn.cellphones.com.vn/..." />
                  
                  {formData.imageUrls && (
                    <div className="image-preview" style={{ marginTop: "10px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      {formData.imageUrls.split('\n').slice(0, 5).map((url, idx) => {
                          if(!url.trim()) return null;
                          const fullUrl = url.trim().startsWith("http") ? url.trim() : `http://localhost:8080${url.trim()}`;
                          return <img key={idx} src={fullUrl} alt="Preview" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4, border: "1px solid #ddd" }} onError={(e) => e.target.style.display = "none"} />
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-actions"> <button type="button" className="btn-cancel" onClick={handleCloseModal}>Hủy</button> <button type="submit" className="btn-submit">Lưu</button> </div>
            </form>
          </div>
        </div>
      )}

      {/* 👇 MODAL IMPORT EXCEL (ĐÃ TÍCH HỢP) */}
      <ImportProductModal 
        show={showImportModal} 
        handleClose={() => setShowImportModal(false)}
        onSuccess={fetchProductsOnly}
      />

    </div>
  );
};
export default ProductsPage;