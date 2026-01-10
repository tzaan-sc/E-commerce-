import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  X,
  Settings,
  FileDown,
  Filter
} from "lucide-react";
import VariantManager from "./VariantManager";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // --- STATE LỌC ---
  const [filterBrand, setFilterBrand] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [filterStock, setFilterStock] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const fileInputRef = useRef(null);

  const BASE_URL = "http://localhost:8080";

  const [formData, setFormData] = useState({
    name: "", slug: "", description: "", price: "",
    stockQuantity: "", imageUrls: "", brandId: "",
    usagePurposeId: "", screenSizeId: "", specifications: "",
  });

  const [brands, setBrands] = useState([]);
  const [usagePurposes, setUsagePurposes] = useState([]);
  const [screenSizes, setScreenSizes] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [resP, resB, resU, resS] = await Promise.all([
        fetch(`${BASE_URL}/api/products`),
        fetch(`${BASE_URL}/api/brands`),
        fetch(`${BASE_URL}/api/usage-purposes`),
        fetch(`${BASE_URL}/api/screen-sizes`),
      ]);
      const [dataP, dataB, dataU, dataS] = await Promise.all([
        resP.json(), resB.json(), resU.json(), resS.json(),
      ]);
      setProducts(dataP);
      setBrands(dataB);
      setUsagePurposes(dataU);
      setScreenSizes(dataS);
    } catch (error) {
      console.error("Lỗi fetch dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const resetForm = () => {
    setFormData({
      name: "", slug: "", description: "", price: "",
      stockQuantity: "", imageUrls: "", brandId: "",
      usagePurposeId: "", screenSizeId: "", specifications: "",
    });
  };

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleImportFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileFormData = new FormData();
    fileFormData.append("file", file);

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/products/import`, {
        method: "POST",
        body: fileFormData,
      });

      const result = await res.json();

      if (res.ok) {
        alert(`Nhập thành công ${result.count || ''} sản phẩm!`);
        fetchAllData();
      } else {
        alert(`THÔNG BÁO LỖI FILE:\n------------------\n${result.message || "Định dạng file không hợp lệ hoặc lỗi máy chủ."}`);
      }
    } catch (err) {
      alert("Lỗi kết nối server! Vui lòng kiểm tra lại đường truyền.");
    } finally {
      setLoading(false);
      e.target.value = null;
    }
  };

  const getProductImage = (p) => {
    let url = "";
    if (p.images && p.images.length > 0) {
      url = p.images[0].urlImage || p.images[0];
    } else if (p.imageUrl) { url = p.imageUrl; }
    if (!url) return "https://via.placeholder.com/80x60?text=No+Img";
    if (url.startsWith("http")) return url;
    return `${BASE_URL}${url.startsWith("/") ? "" : "/uploads/products/"}${url}`;
  };

  const uploadFromUrl = async (urlOnline) => {
    try {
      const res = await fetch(`${BASE_URL}/api/uploads/image-from-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlOnline }),
      });
      const data = await res.json();
      if (res.ok) return data.url;
      return null;
    } catch (err) { return null; }
  };

  const handleAutoUploadImages = async () => {
    if (!formData.imageUrls.trim()) return;
    setIsUploading(true);
    const lines = formData.imageUrls.split("\n");
    const newLines = [];
    let successCount = 0;
    for (let line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("http") && !trimmedLine.includes("/uploads/")) {
        const newUrl = await uploadFromUrl(trimmedLine);
        if (newUrl) { newLines.push(newUrl); successCount++; } 
        else { newLines.push(trimmedLine); }
      } else { newLines.push(trimmedLine); }
    }
    setFormData((prev) => ({ ...prev, imageUrls: newLines.join("\n") }));
    setIsUploading(false);
    if (successCount > 0) alert(`Đã tải thành công ${successCount} ảnh về Server!`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const priceVal = parseFloat(formData.price);
    const stockVal = parseInt(formData.stockQuantity);
    if (isNaN(priceVal) || priceVal < 0) return alert("Giá không được âm!");
    if (isNaN(stockVal) || stockVal < 0) return alert("Số lượng không được âm!");
    try {
      const imageList = formData.imageUrls.split("\n").map(u => u.trim()).filter(u => u !== "");
      const payload = {
        ...formData, price: priceVal, stockQuantity: stockVal,
        imageUrls: imageList, brandId: parseInt(formData.brandId),
        usagePurposeId: parseInt(formData.usagePurposeId),
        screenSizeId: parseInt(formData.screenSizeId),
      };
      const url = editingProductId ? `${BASE_URL}/api/products/${editingProductId}` : `${BASE_URL}/api/products`;
      const method = editingProductId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const responseData = await res.json();
      if (!res.ok) throw new Error(responseData.message || "Lỗi lưu sản phẩm!");
      fetchAllData(); handleCloseModal(); alert("Thành công!");
    } catch (err) { alert("Lỗi: " + err.message); }
  };

  const handleEditProduct = (productId) => {
    const p = products.find((p) => p.id === productId);
    if (!p) return;
    setEditingProductId(productId);
    const specText = p.specification?.otherSpecs || p.specifications || "";
    setFormData({
      name: p.name, 
      slug: p.slug, 
      description: p.description || "",
      price: p.price, stockQuantity: p.stockQuantity,
      imageUrls: p.images?.map(img => img.urlImage || img).join("\n") || p.imageUrl || "",
      brandId: p.brand?.id || "", usagePurposeId: p.usagePurpose?.id || "",
      screenSizeId: p.screenSize?.id || "", specifications: specText,
    });
    setShowModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Xóa sản phẩm này?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Lỗi xóa!");
      setProducts(products.filter((p) => p.id !== id));
      alert("Đã xóa!");
    } catch (err) { alert("Lỗi: " + err.message); }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchBrand = filterBrand === "" || p.brand?.id === parseInt(filterBrand);
      const matchStock = filterStock === "" || (filterStock === "in" ? p.stockQuantity > 0 : p.stockQuantity <= 0);
      let matchPrice = true;
      if (filterPrice === "low") matchPrice = p.price < 15000000;
      else if (filterPrice === "mid") matchPrice = p.price >= 15000000 && p.price <= 25000000;
      else if (filterPrice === "high") matchPrice = p.price > 25000000;
      return matchSearch && matchBrand && matchPrice && matchStock;
    });
  }, [products, debouncedSearch, filterBrand, filterPrice, filterStock]);

  const currentItems = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleAddProduct = () => { resetForm(); setEditingProductId(null); setShowModal(true); };
  const handleCloseModal = () => { setShowModal(false); resetForm(); setEditingProductId(null); };
  const handleOpenVariants = (product) => { setSelectedProduct(product); setShowVariantModal(true); };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setFormData((prev) => ({ 
        ...prev, 
        name: value,
        slug: generateSlug(value)
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  if (loading && products.length === 0) return <div style={{ padding: "50px", textAlign: "center" }}>Đang tải dữ liệu...</div>;

  return (
    <div className="page-card">
      <div className="page-card__header" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', padding: '15px' }}>
        <div className="search-box" style={{ flex: '1', minWidth: '200px' }}>
          <Search className="search-box__icon" size={18} />
          <input type="text" placeholder="Tìm kiếm tên sản phẩm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-box__input" />
        </div>

        <select className="modal-select" style={{ width: '140px', margin: 0 }} value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)}>
          <option value="">Thương hiệu</option>
          {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>

        <select className="modal-select" style={{ width: '130px', margin: 0 }} value={filterPrice} onChange={(e) => setFilterPrice(e.target.value)}>
          <option value="">Giá bán</option>
          <option value="low">Dưới 15tr</option>
          <option value="mid">15tr - 25tr</option>
          <option value="high">Trên 25tr</option>
        </select>

        <select className="modal-select" style={{ width: '120px', margin: 0 }} value={filterStock} onChange={(e) => setFilterStock(e.target.value)}>
          <option value="">Kho hàng</option>
          <option value="in">Còn hàng</option>
          <option value="out">Hết hàng</option>
        </select>

        <input type="file" ref={fileInputRef} onChange={handleImportFile} style={{ display: 'none' }} accept=".csv, .xlsx, .xls" />
        <button className="btn btn--secondary" onClick={() => fileInputRef.current.click()} style={{ whiteSpace: 'nowrap' }}>
           <FileDown size={18} /> Nhập File
        </button>

        <button className="btn btn--primary" onClick={handleAddProduct} style={{ whiteSpace: 'nowrap' }}>
          <Plus size={18} /> Thêm mới
        </button>

        {(filterBrand || filterPrice || filterStock) && (
          <button onClick={() => { setFilterBrand(""); setFilterPrice(""); setFilterStock(""); }} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Xóa tất cả lọc">
            <X size={16} />
          </button>
        )}
      </div>

      <div className="table-container">
        <table className="data-table" style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <thead>
            <tr style={{ background: "#f4f4f4", height: "50px", textAlign: "left" }}>
              <th style={{ width: "50px", padding: "10px" }}>ID</th>
              <th style={{ width: "80px", padding: "10px" }}>Ảnh</th>
              <th style={{ minWidth: "200px", padding: "10px" }}>Tên</th>
              <th style={{ width: "100px", padding: "10px" }}>Thương hiệu</th>
              <th style={{ width: "120px", padding: "10px" }}>Giá</th>
              <th style={{ width: "70px", padding: "10px" }}>Kho</th>
              <th style={{ width: "150px", padding: "10px" }}>Cấu hình</th>
              <th style={{ width: "140px", padding: "10px" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((p) => (
              <tr key={p.id} style={{ height: "90px", borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "10px" }}>{p.id}</td>
                {/* --- SỬA CHỖ NÀY: XỬ LÝ DẤU CHẤM DƯ THỪA --- */}
                <td style={{ padding: "10px", textAlign: "center", overflow: "visible" }}>
                  <div style={{ width: "60px", height: "45px", margin: "0 auto", overflow: "hidden" }}>
                    <img 
                      src={getProductImage(p)} 
                      style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} 
                      alt=""
                      onError={(e) => { e.target.src = "https://via.placeholder.com/80x60?text=Error"; }}
                    />
                  </div>
                </td>
                <td style={{ padding: "10px", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</td>
                <td style={{ padding: "10px" }}>{p.brand?.name}</td>
                <td style={{ padding: "10px", color: "#d70018", fontWeight: "bold" }}>{new Intl.NumberFormat("vi-VN").format(p.price)} đ</td>
                <td style={{ padding: "10px", textAlign: "center" }}>
                   <span style={{ color: p.stockQuantity > 0 ? 'green' : 'red', fontWeight: 'bold' }}>{p.stockQuantity}</span>
                </td>
                <td style={{ padding: "10px", fontSize: "12px", color: "#666" }}>
                   <div className="line-clamp-2">{p.specification?.cpu ? `${p.specification.cpu} | ${p.specification.vga}` : "Chưa cấu hình"}</div>
                </td>
                <td style={{ padding: "10px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button className="action-btn" title="Biến thể" onClick={() => handleOpenVariants(p)}><Settings size={18} /></button>
                    <button className="action-btn action-btn--edit" onClick={() => handleEditProduct(p.id)}><Edit size={18} /></button>
                    <button className="action-btn action-btn--delete" onClick={() => handleDeleteProduct(p.id)}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-controls" style={{ display: "flex", justifyContent: "center", gap: "10px", padding: "20px" }}>
        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}><ChevronLeft size={20}/></button>
        <span style={{ alignSelf: "center" }}>Trang {currentPage} / {totalPages}</span>
        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}><ChevronRight size={20}/></button>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-container" style={{maxWidth: '700px'}} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProductId ? "Cập nhật sản phẩm" : "Thêm mới sản phẩm"}</h2>
              <button className="modal-close" onClick={handleCloseModal}><X size={26} /></button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="modal-grid">
                <div className="form-group"><label>Tên Sản Phẩm *</label><input className="modal-input" name="name" value={formData.name} onChange={handleInputChange} required /></div>
                
                <div className="form-group">
                  <label>Slug</label>
                  <input className="modal-input" name="slug" value={formData.slug} onChange={handleInputChange} placeholder="slug-tu-dong-theo-ten" />
                </div>

                <div className="form-group"><label>Giá (VND) *</label><input type="number" className="modal-input" name="price" value={formData.price} onChange={handleInputChange} required /></div>
                <div className="form-group"><label>Số lượng kho *</label><input type="number" className="modal-input" name="stockQuantity" value={formData.stockQuantity} onChange={handleInputChange} required /></div>
                
                <div className="form-group">
                  <label>Thương hiệu</label>
                  <select className="modal-select" name="brandId" value={formData.brandId} onChange={handleInputChange} required>
                    <option value="">-- Chọn thương hiệu --</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Mục đích</label>
                  <select className="modal-select" name="usagePurposeId" value={formData.usagePurposeId} onChange={handleInputChange} required>
                    <option value="">-- Chọn mục đích --</option>
                    {usagePurposes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Kích thước màn hình</label>
                  <select className="modal-select" name="screenSizeId" value={formData.screenSizeId} onChange={handleInputChange} required>
                    <option value="">-- Chọn kích thước --</option>
                    {screenSizes.map(s => <option key={s.id} value={s.id}>{s.value} inch</option>)}
                  </select>
                </div>

                <div className="form-group form-full">
                  <label style={{color: '#2563eb', fontWeight: 'bold'}}>Thông số kỹ thuật</label>
                  <textarea className="modal-textarea" name="specifications" value={formData.specifications} onChange={handleInputChange} rows={4} placeholder="CPU, VGA, RAM..." />
                </div>
                <div className="form-group form-full"><label>Mô tả</label><textarea className="modal-textarea" name="description" value={formData.description} onChange={handleInputChange} rows={2} /></div>
                <div className="form-group form-full">
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <label>Link hình ảnh (Mỗi link một dòng)</label>
                    <button type="button" onClick={handleAutoUploadImages} disabled={isUploading} className="btn-upload" style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: isUploading ? '#ccc' : '#2563eb', color: '#fff', padding: '5px 10px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '12px' }}>
                       <UploadCloud size={14}/> {isUploading ? "Đang tải..." : "Tải ảnh về Server"}
                    </button>
                  </div>
                  <textarea className="modal-textarea" name="imageUrls" value={formData.imageUrls} onChange={handleInputChange} rows={3} placeholder="Dán link ảnh online vào đây..." />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>Hủy</button>
                <button type="submit" className="btn-submit">Lưu sản phẩm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showVariantModal && selectedProduct && (
        <VariantManager
          productId={selectedProduct.id}
          productName={selectedProduct.name}
          productSlug={selectedProduct.slug} 
          onClose={() => setShowVariantModal(false)}
        />
      )}
    </div>
  );
};

export default ProductsPage;