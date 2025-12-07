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
import './style.scss';

// Router simulation
const AdminDashboard = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', name: 'Sản phẩm', icon: Laptop },
    { id: 'orders', name: 'Đơn hàng', icon: ShoppingCart },
    { id: 'accounts', name: 'Tài khoản', icon: Users },
    {
      id: 'categories',
      name: 'Danh mục',
      icon: Tag,
      submenu: [
        { id: 'brands', name: 'Thương hiệu', icon: Tag },
        { id: 'usage', name: 'Nhu cầu sử dụng', icon: Target },
        { id: 'screensize', name: 'Kích thước màn hình', icon: Monitor },
      ],
    },
  ];

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      // Xóa token khỏi localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redirect về trang đăng nhập
      window.location.href = '/dang-nhap';
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        // 👇 THAY ĐỔI: Truyền setter xuống DashboardPage
        return <DashboardPage setCurrentPage={setCurrentPage} />;
      case 'products':
        return <ProductsPage />;
      case 'orders':
        return <OrdersPage />;
      case 'accounts':
        return <AccountsPage />;
      case 'brands':
        return <BrandsPage />;
      case 'usage':
        return <UsagePurposePage />;
      case 'screensize':
        return <ScreenSizePage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside
        className={`sidebar ${
          sidebarOpen ? 'sidebar--open' : 'sidebar--closed'
        }`}
      >
        <div className="sidebar__header">
          {sidebarOpen && <h1 className="sidebar__title">Admin Panel</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="sidebar__toggle"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar__nav">
          {menuItems.map((item) => (
            <div key={item.id} className="sidebar__menu-group">
              <button
                onClick={() => !item.submenu && setCurrentPage(item.id)}
                className={`sidebar__menu-item ${
                  currentPage === item.id ? 'sidebar__menu-item--active' : ''
                }`}
              >
                <item.icon size={20} />
                {sidebarOpen && (
                  <span className="sidebar__menu-text">{item.name}</span>
                )}
              </button>

              {item.submenu && sidebarOpen && (
                <div className="sidebar__submenu">
                  {item.submenu.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => setCurrentPage(subItem.id)}
                      className={`sidebar__submenu-item ${
                        currentPage === subItem.id
                          ? 'sidebar__submenu-item--active'
                          : ''
                      }`}
                    >
                      <subItem.icon size={16} />
                      <span>{subItem.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="sidebar__footer">
          <button className="sidebar__logout" onClick={handleLogout}>
            <LogOut size={20} />
            {sidebarOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="main-content__header">
          <h2 className="main-content__title">
            {menuItems.find((m) => m.id === currentPage)?.name ||
              menuItems
                .flatMap((m) => m.submenu || [])
                .find((s) => s.id === currentPage)?.name}
          </h2>
        </div>
        <div className="main-content__body">{renderPage()}</div>
      </main>
    </div>
  );
};

// Dashboard Page
// const DashboardPage = () => {
//   const [stats, setStats] = useState([]);
//   const [recentOrders, setRecentOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       // TODO: Gọi API lấy dữ liệu thống kê
//       // const response = await fetch('/api/dashboard/stats');
//       // const data = await response.json();

//       // Mock data
//       setStats([
//         { label: 'Tổng sản phẩm', value: '248', icon: Laptop, color: 'blue' },
//         {
//           label: 'Đơn hàng mới',
//           value: '52',
//           icon: ShoppingCart,
//           color: 'green',
//         },
//         { label: 'Tài khoản', value: '1,234', icon: Users, color: 'purple' },
//         { label: 'Doanh thu', value: '524M', icon: Tag, color: 'orange' },
//       ]);

//       // TODO: Gọi API lấy đơn hàng gần đây
//       // const ordersResponse = await fetch('/api/orders/recent');
//       // const ordersData = await ordersResponse.json();

//       setRecentOrders([
//         {
//           id: '#ORD001',
//           customer: 'Nguyễn Văn A',
//           product: 'Dell XPS 15',
//           total: '35,000,000đ',
//           status: 'Đã giao',
//         },
//         {
//           id: '#ORD002',
//           customer: 'Trần Thị B',
//           product: 'HP Pavilion 14',
//           total: '18,500,000đ',
//           status: 'Đang xử lý',
//         },
//       ]);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <div className="loading">Đang tải dữ liệu...</div>;
//   }

//   return (
//     <div className="dashboard">
//       <div className="stats-grid">
//         {stats.map((stat, index) => (
//           <div key={index} className="stat-card">
//             <div className="stat-card__content">
//               <div className="stat-card__info">
//                 <p className="stat-card__label">{stat.label}</p>
//                 <p className="stat-card__value">{stat.value}</p>
//               </div>
//               <div className={`stat-card__icon stat-card__icon--${stat.color}`}>
//                 <stat.icon size={24} />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="recent-orders">
//         <h3 className="recent-orders__title">Đơn hàng gần đây</h3>
//         <div className="table-container">
//           <table className="data-table">
//             <thead>
//               <tr>
//                 <th>Mã đơn</th>
//                 <th>Khách hàng</th>
//                 <th>Sản phẩm</th>
//                 <th>Tổng tiền</th>
//                 <th>Trạng thái</th>
//               </tr>
//             </thead>
//             <tbody>
//               {recentOrders.map((order) => (
//                 <tr key={order.id}>
//                   <td>{order.id}</td>
//                   <td>{order.customer}</td>
//                   <td>{order.product}</td>
//                   <td>{order.total}</td>
//                   <td>
//                     <span
//                       className={`badge ${
//                         order.status === 'Đã giao'
//                           ? 'badge--success'
//                           : 'badge--warning'
//                       }`}
//                     >
//                       {order.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };
// TRONG AdminDashboard.js (Phần DashboardPage component)

 const DashboardPage = ({ setCurrentPage }) => {
    const [stats, setStats] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const getTargetPage = (label) => {
        if (label.includes('Tài khoản')) return 'accounts'; // Chuyển sang trang accounts
        if (label.includes('Đơn hàng') || label.includes('Doanh thu')) return 'orders'; // Chuyển sang trang orders
        return 'dashboard'; 
    };
    // --- HELPER FUNCTIONS (Cần thống nhất giữa các component) ---
    const translateStatus = (status) => {
        if (!status) return 'Không rõ';
        const map = {
            'PENDING': 'Chờ xác nhận',
            'PROCESSING': 'Đang xử lý',
            'SHIPPING': 'Đang giao',
            'COMPLETED': 'Đã giao',
            'CANCELLED': 'Đã hủy',
        };
        return map[status.toUpperCase()] || status;
    };
    
    // Hàm này trả về TÊN MÀU (blue, green, purple, orange) để khớp với SCSS stat-card__icon--<color>
    const getStatColorForStatus = (status) => {
        if (!status) return 'secondary';
        const statusUpper = status.toUpperCase();
        const statusMap = {
            'COMPLETED': 'orange', // Đơn hoàn tất (Dùng màu cam cho STATS)
            'PENDING': 'green',    // Đơn mới (Dùng màu xanh lá cho STATS)
        };
        return statusMap[statusUpper] || 'blue';
    };
    
    // Hàm này trả về tên class badge--<color> để khớp với bảng
    const getBadgeClass = (status) => {
        if (!status) return 'secondary';
        const statusUpper = status.toUpperCase();
        const statusMap = {
            'COMPLETED': 'success', 
            'SHIPPING': 'info', 
            'PROCESSING': 'primary', 
            'PENDING': 'warning', 
            'CANCELLED': 'danger', 
        };
        return statusMap[statusUpper] || 'secondary';
    };


    useEffect(() => {
        fetchDashboardData();
    }, []);

   const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            const ordersRes = await apiClient.get('/orders/admin?status=all');
            const usersCountRes = await apiClient.get('/users/count');
            
            const allOrders = ordersRes.data || [];
            const totalUsers = usersCountRes.data; 

            // Lọc dữ liệu
            const pendingOrders = allOrders.filter(o => o.status === 'PENDING');
            const completedOrders = allOrders.filter(o => o.status === 'COMPLETED');
            const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
            const revenueDisplay = (totalRevenue / 1000000).toLocaleString('vi-VN', { 
                maximumFractionDigits: 1 
            }) + ' Tr'; 
            
            // Cập nhật stats
            setStats([
                { label: 'Tổng đơn hàng', value: allOrders.length.toLocaleString('vi-VN'), icon: ShoppingCart, color: 'blue' },
                { label: 'Đơn hàng mới', value: pendingOrders.length.toLocaleString('vi-VN'), icon: ShoppingCart, color: 'green' },
                { label: 'Tài khoản', value: totalUsers.toLocaleString('vi-VN'), icon: Users, color: 'purple' },
                { label: 'Doanh thu', value: revenueDisplay, icon: Tag, color: 'orange' },
            ]);

            // Cập nhật đơn hàng gần đây
            const recentData = allOrders.slice(0, 5).map(order => ({
                id: `#ORD${String(order.id).padStart(3, '0')}`,
                customer: order.customerName,
                product: order.items[0]?.productName || 'Nhiều SP',
                total: (order.totalAmount || 0).toLocaleString('vi-VN') + 'đ',
                status: order.status, 
            }));
            
            setRecentOrders(recentData);
            
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setStats([{ label: 'Dữ liệu', value: 'Lỗi API', icon: Tag, color: 'danger' }]);
        } finally {
            setLoading(false);
        }
    };
    
    const handleStatClick = (pageId) => {
        if (setCurrentPage) {
            setCurrentPage(pageId);
        }
    };
  

    if (loading) {
        return <div className="loading">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="dashboard">
            {/* ... Stats Grid JSX giữ nguyên ... */}
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div 
                        key={index} 
                        className="stat-card" 
                        // 👇 SỬ DỤNG HÀM MỚI ĐỂ XÁC ĐỊNH TRANG ĐÍCH
                        onClick={() => handleStatClick(getTargetPage(stat.label))}
                        style={{cursor: 'pointer'}} 
                    >
                        <div className="stat-card__content">
                            <div className="stat-card__info">
                                <p className="stat-card__label">{stat.label}</p>
                                <p className="stat-card__value">{stat.value}</p>
                            </div>
                            <div className={`stat-card__icon stat-card__icon--${stat.color}`}>
                                <stat.icon size={24} /> 
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bảng Đơn hàng gần đây */}
            <div className="recent-orders">
                <h3 className="recent-orders__title">Đơn hàng gần đây</h3>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Mã đơn</th>
                                <th>Khách hàng</th>
                                <th>Sản phẩm</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order, index) => (
                                <tr key={order.id}>
                                    <td>{order.id}</td> 
                                    <td>{order.customer}</td>
                                    <td>{order.product}</td>
                                    <td>{order.total}</td>
                                    <td>
                                        {/* 👇 SỬ DỤNG HÀM DỊCH VÀ CLASS BADGE CHUẨN */}
                                        <span className={`badge badge--${getBadgeClass(order.status)}`}>
                                            {translateStatus(order.status)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {recentOrders.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{textAlign: 'center'}}>Chưa có đơn hàng nào được đặt.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// const ProductsPage = () => {
//   const [products, setProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingProductId, setEditingProductId] = useState(null);

//   // State loading khi upload ảnh
//   const [isUploading, setIsUploading] = useState(false);

//   // State cho phân trang & tìm kiếm
//   const [debouncedSearch, setDebouncedSearch] = useState(""); 
//   const [currentPage, setCurrentPage] = useState(1);          
//   const itemsPerPage = 10;                                    

//   // Form state
//   const [formData, setFormData] = useState({
//     name: "", slug: "", description: "", price: "", stockQuantity: "", 
//     imageUrls: "", brandId: "", usagePurposeId: "", screenSizeId: "", specifications: "",
//   });

//   const [brands, setBrands] = useState([]);
//   const [usagePurposes, setUsagePurposes] = useState([]);
//   const [screenSizes, setScreenSizes] = useState([]);

//   // 1. Fetch dữ liệu ban đầu
//   useEffect(() => {
//     const fetchAllData = async () => {
//       setLoading(true);
//       try {
//         const [resP, resB, resU, resS] = await Promise.all([
//           fetch("http://localhost:8080/api/products"),
//           fetch("http://localhost:8080/api/brands"),
//           fetch("http://localhost:8080/api/usage-purposes"),
//           fetch("http://localhost:8080/api/screen-sizes")
//         ]);
//         const [dataP, dataB, dataU, dataS] = await Promise.all([
//           resP.json(), resB.json(), resU.json(), resS.json()
//         ]);
//         setProducts(dataP);
//         setBrands(dataB);
//         setUsagePurposes(dataU);
//         setScreenSizes(dataS);
//       } catch (error) { console.error(error); } finally { setLoading(false); }
//     };
//     fetchAllData();
//   }, []);

//   // 2. Debounce Search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(searchTerm);
//       setCurrentPage(1); 
//     }, 500); 
//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   const resetForm = () => {
//     setFormData({ name: "", slug: "", description: "", price: "", stockQuantity: "", imageUrls: "", brandId: "", usagePurposeId: "", screenSizeId: "", specifications: "" });
//   };

//   const handleAddProduct = () => { resetForm(); setEditingProductId(null); setShowModal(true); };
//   const handleCloseModal = () => { setShowModal(false); resetForm(); setEditingProductId(null); };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (name === "name") {
//       const slug = value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
//       setFormData((prev) => ({ ...prev, slug }));
//     }
//   };

//   const getProductImage = (p) => {
//     if (p.images && p.images.length > 0) {
//         const img = p.images[0];
//         const url = img.urlImage || img;
//         return url.startsWith("http") ? url : `http://localhost:8080${url}`;
//     }
//     if (p.imageUrl) {
//         return p.imageUrl.startsWith("http") ? p.imageUrl : `http://localhost:8080${p.imageUrl}`;
//     }
//     return "https://via.placeholder.com/80x60?text=No+Img";
//   };

//   // --- HÀM GỌI API UPLOAD TỪ URL ---
//   const uploadFromUrl = async (urlOnline) => {
//     try {
//         const res = await fetch("http://localhost:8080/api/uploads/image-from-url", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ url: urlOnline })
//         });
//         const data = await res.json();
//         if (res.ok) return data.url;
//         else { console.error("Lỗi tải ảnh:", data.error); return null; }
//     } catch (err) { console.error("Lỗi kết nối:", err); return null; }
//   };

//   // --- XỬ LÝ NÚT TỰ ĐỘNG TẢI ẢNH ---
//   const handleAutoUploadImages = async () => {
//     if (!formData.imageUrls.trim()) return;
//     setIsUploading(true);
//     const lines = formData.imageUrls.split('\n');
//     const newLines = [];
//     let hasChange = false;

//     for (let line of lines) {
//         const trimmedLine = line.trim();
//         if (trimmedLine.startsWith("http") && !trimmedLine.includes("/uploads/products/")) {
//             const newUrl = await uploadFromUrl(trimmedLine);
//             if (newUrl) { newLines.push(newUrl); hasChange = true; } 
//             else { newLines.push(trimmedLine); }
//         } else {
//             newLines.push(trimmedLine);
//         }
//     }
//     setFormData(prev => ({ ...prev, imageUrls: newLines.join('\n') }));
//     setIsUploading(false);
//     if (hasChange) alert("Đã tải ảnh về server thành công!");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const imageList = formData.imageUrls.split('\n').map(url => url.trim()).filter(url => url !== "");
//       const payload = {
//         name: formData.name, slug: formData.slug, description: formData.description,
//         price: parseFloat(formData.price), stockQuantity: parseInt(formData.stockQuantity),
//         imageUrls: imageList, imageUrl: imageList.length > 0 ? imageList[0] : "",
//         brandId: parseInt(formData.brandId), usagePurposeId: parseInt(formData.usagePurposeId), screenSizeId: parseInt(formData.screenSizeId),
//         specifications: formData.specifications,
//       };

//       let res;
//       const url = editingProductId ? `http://localhost:8080/api/products/${editingProductId}` : "http://localhost:8080/api/products";
//       const method = editingProductId ? "PUT" : "POST";

//       res = await fetch(url, { method: method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });

//       if (!res.ok) throw new Error("Lỗi lưu sản phẩm!");
      
//       // Refresh list
//       const resP = await fetch("http://localhost:8080/api/products");
//       const dataP = await resP.json();
//       setProducts(dataP);

//       handleCloseModal();
//       alert(editingProductId ? "Cập nhật thành công!" : "Thêm sản phẩm thành công!");
//     } catch (err) { console.error(err); alert("Lỗi: " + err.message); }
//   };

//   const handleEditProduct = (productId) => {
//     const product = products.find((p) => p.id === productId);
//     if (!product) return;
//     setEditingProductId(productId);
//     setShowModal(true);

//     let imagesString = "";
//     if (product.images && product.images.length > 0) {
//         imagesString = product.images.map(img => img.urlImage || img).join("\n");
//     } else if (product.imageUrl) {
//         imagesString = product.imageUrl;
//     }

//     setFormData({
//       name: product.name, slug: product.slug, description: product.description || "",
//       price: product.price, stockQuantity: product.stockQuantity,
//       imageUrls: imagesString, 
//       brandId: product.brand?.id || "", usagePurposeId: product.usagePurpose?.id || "", screenSizeId: product.screenSize?.id || "",
//       specifications: product.specifications || "",
//     });
//   };

//   const handleDeleteProduct = async (id) => {
//     if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;
//     try {
//       const res = await fetch(`http://localhost:8080/api/products/${id}`, { method: "DELETE" });
//       if (!res.ok) throw new Error("Xóa thất bại!");
//       setProducts(products.filter((p) => p.id !== id));
//       alert("Xóa thành công!");
//     } catch (err) { console.error(err); alert("Lỗi khi xóa sản phẩm!"); }
//   };

//   // --- LOGIC LỌC VÀ PHÂN TRANG ---
//   const filteredProducts = useMemo(() => 
//     products.filter((p) => p.name.toLowerCase().includes(debouncedSearch.toLowerCase())), 
//   [products, debouncedSearch]);

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

//   if (loading) return <div style={{padding: '20px', textAlign: 'center'}}>Đang tải dữ liệu...</div>;

//   return (
//     <div className="page-card">
//       <div className="page-card__header">
//         <div className="search-box">
//           <Search className="search-box__icon" size={20} />
//           <input
//             type="text"
//             placeholder="Tìm kiếm sản phẩm..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="search-box__input"
//           />
//         </div>
//         <button className="btn btn--primary" onClick={handleAddProduct}>
//           <Plus size={20} /> ➕ Thêm sản phẩm
//         </button>
//       </div>

//       {/* TABLE LIST - GIỮ NGUYÊN ĐỊNH DẠNG CHUẨN, KHÔNG GIẬT */}
//       <div className="table-container">
//         {filteredProducts.length === 0 ? (
//           <p style={{padding: '20px', textAlign: 'center'}}>Không có sản phẩm phù hợp</p>
//         ) : (
//           <>
//             <table 
//                 className="data-table" 
//                 // 👇 Style cố định để tránh giật layout
//                 style={{width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed'}}
//             >
//               <thead>
//                 <tr style={{background: '#f4f4f4', height: '50px', textAlign: 'left'}}>
//                   <th style={{width: '50px', padding: '10px'}}>ID</th> 
//                   <th style={{width: '100px', padding: '10px'}}>Ảnh</th> 
//                   <th style={{minWidth: '200px', padding: '10px'}}>Tên</th> 
//                   <th style={{width: '120px', padding: '10px'}}>Thương hiệu</th> 
//                   <th style={{width: '120px', padding: '10px'}}>Giá</th> 
//                   <th style={{width: '70px', padding: '10px'}}>Kho</th> 
//                   <th style={{width: '90px', padding: '10px'}}>Màn hình</th> 
//                   <th style={{width: '100px', padding: '10px'}}>Mục đích</th> 
//                   <th style={{width: '150px', padding: '10px'}}>Mô tả</th> 
//                   <th style={{width: '150px', padding: '10px'}}>Thông số</th> 
//                   <th style={{width: '100px', padding: '10px'}}>Hành động</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentItems.map((p) => (
//                   // 👇 Khóa chiều cao dòng để tránh giật dọc
//                   <tr key={p.id} style={{height: '90px', borderBottom: '1px solid #eee'}}>
//                     <td style={{padding: '10px'}}>{p.id}</td>
//                     <td style={{padding: '10px'}}>
//                       <div style={{width: '80px', height: '60px', background: '#f9f9f9', borderRadius: '4px', overflow: 'hidden'}}>
//                           <img
//                             src={getProductImage(p)}
//                             loading="lazy"
//                             alt={p.name}
//                             style={{ width: '100%', height: '100%', objectFit: "contain" }}
//                             onError={(e) => { e.target.src = "https://via.placeholder.com/80x60?text=Error"; }}
//                           />
//                       </div>
//                     </td>
//                     <td style={{padding: '10px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} title={p.name}>{p.name}</td>
//                     <td style={{padding: '10px'}}>{p.brand?.name}</td>
//                     <td style={{padding: '10px', color: '#d70018', fontWeight: 'bold'}}>{new Intl.NumberFormat('vi-VN').format(p.price)} đ</td>
//                     <td style={{padding: '10px', textAlign: 'center'}}>{p.stockQuantity}</td>
//                     <td style={{padding: '10px'}}>{p.screenSize?.value} inch</td>
//                     <td style={{padding: '10px'}}>{p.usagePurpose?.name}</td>
//                     <td style={{padding: '10px', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '13px', color: '#666'}} title={p.description}>{p.description}</td>
//                     <td style={{padding: '10px', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '12px', color: '#666'}} title={p.specifications}>{p.specifications}</td>
//                     <td style={{padding: '10px'}}>
//                       <div style={{display: 'flex', gap: '8px'}}>
//                           <button className="action-btn action-btn--edit" onClick={() => handleEditProduct(p.id)}> <Edit size={18} /> </button>
//                           <button className="action-btn action-btn--delete" onClick={() => handleDeleteProduct(p.id)}> <Trash2 size={18} /> </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
            
//             {/* 👇 PHẦN NÚT PHÂN TRANG (ĐÃ THÊM CHEVRON) */}
//             <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '20px' }}>
//                 <button 
//                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                     disabled={currentPage === 1}
//                     style={{ padding: '5px 10px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
//                 >
//                     <ChevronLeft size={20} />
//                 </button>
                
//                 <span style={{ alignSelf: 'center' }}>Trang {currentPage} / {totalPages}</span>

//                 <button 
//                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                     disabled={currentPage === totalPages}
//                     style={{ padding: '5px 10px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
//                 >
//                     <ChevronRight size={20} />
//                 </button>
//             </div>
//           </>
//         )}
//       </div>

//       {/* MODAL */}
//       {showModal && (
//         <div className="modal-overlay" onClick={handleCloseModal}>
//           <div className="modal-container" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <h2>{editingProductId ? "Cập nhật sản phẩm" : "Thêm Sản Phẩm Mới"}</h2>
//               <button className="modal-close" onClick={handleCloseModal}> <X size={26} /> </button>
//             </div>

//             <form className="modal-form" onSubmit={handleSubmit}>
//               <div className="modal-grid">
//                 <div className="form-group"> <label>Tên Sản Phẩm *</label> <input className="modal-input" name="name" value={formData.name} onChange={handleInputChange} required /> </div>
//                 <div className="form-group"> <label>Slug *</label> <input className="modal-input" name="slug" value={formData.slug} onChange={handleInputChange} required /> </div>
//                 <div className="form-group form-full"> <label>Mô tả</label> <textarea className="modal-textarea" name="description" value={formData.description} onChange={handleInputChange} rows={3} /> </div>
                
//                 <div className="form-group form-full"> <label>Thông số kỹ thuật (JSON)</label> <textarea className="modal-textarea" name="specifications" value={formData.specifications} onChange={handleInputChange} rows={3} style={{fontFamily: 'monospace', fontSize: '13px'}} placeholder='[ {"label": "CPU", "value": "i7"} ]'/> </div>
                
//                 <div className="form-group"> <label>Giá (VND) *</label> <input type="number" className="modal-input" name="price" value={formData.price} onChange={handleInputChange} required /> </div>
//                 <div className="form-group"> <label>Số lượng *</label> <input type="number" className="modal-input" name="stockQuantity" value={formData.stockQuantity} onChange={handleInputChange} required /> </div>
//                 <div className="form-group"> <label>Thương hiệu</label> <select className="modal-select" name="brandId" value={formData.brandId} onChange={handleInputChange} required > <option value="">-- Chọn --</option> {brands.map((b) => (<option key={b.id} value={b.id}>{b.name}</option>))} </select> </div>
//                 <div className="form-group"> <label>Mục đích</label> <select className="modal-select" name="usagePurposeId" value={formData.usagePurposeId} onChange={handleInputChange} required > <option value="">-- Chọn --</option> {usagePurposes.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))} </select> </div>
//                 <div className="form-group"> <label>Màn hình</label> <select className="modal-select" name="screenSizeId" value={formData.screenSizeId} onChange={handleInputChange} required > <option value="">-- Chọn --</option> {screenSizes.map((s) => (<option key={s.id} value={s.id}>{s.value} inch</option>))} </select> </div>

//                 <div className="form-group form-full">
//                   <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px'}}>
//                       <label>Link hình ảnh (Mỗi link một dòng)</label>
//                       {/* 👇 NÚT BẤM TẢI ẢNH */}
//                       <button 
//                         type="button" 
//                         onClick={handleAutoUploadImages}
//                         disabled={isUploading}
//                         style={{
//                             fontSize: '12px', 
//                             padding: '4px 12px', 
//                             cursor: 'pointer',
//                             backgroundColor: isUploading ? '#9ca3af' : '#2563eb',
//                             color: 'white',
//                             border: 'none',
//                             borderRadius: '4px',
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: '6px',
//                             transition: 'background-color 0.2s'
//                         }}
//                       >
//                         <UploadCloud size={16}/>
//                         {isUploading ? "Đang tải..." : "Tải ảnh online về Server"}
//                       </button>
//                   </div>
//                   <textarea className="modal-textarea" name="imageUrls" value={formData.imageUrls} onChange={handleInputChange} rows={4} placeholder="https://cdn.cellphones.com.vn/..." />
                  
//                   {formData.imageUrls && (
//                     <div className="image-preview" style={{ marginTop: "10px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
//                       {formData.imageUrls.split('\n').slice(0, 5).map((url, idx) => {
//                           if(!url.trim()) return null;
//                           const fullUrl = url.trim().startsWith("http") ? url.trim() : `http://localhost:8080${url.trim()}`;
//                           return <img key={idx} src={fullUrl} alt="Preview" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4, border: "1px solid #ddd" }} onError={(e) => e.target.style.display = "none"} />
//                       })}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="modal-actions"> <button type="button" className="btn-cancel" onClick={handleCloseModal}>Hủy</button> <button type="submit" className="btn-submit">Lưu</button> </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
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
const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingStatus, setEditingStatus] = useState(""); 

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  const formatOrderId = (id) => {
    if (!id) return '#N/A';
    return `#ORD${String(id).padStart(3, '0')}`;
  };

  const translateStatus = (status) => {
    if (!status) return 'Không rõ';
    const map = {
      'PENDING': 'Chờ xác nhận',
      'PROCESSING': 'Đang xử lý',
      'SHIPPING': 'Đang giao',
      'COMPLETED': 'Đã giao',
      'CANCELLED': 'Đã hủy',
      'CONFIRMED': 'Đã xác nhận',
    };
    return map[status.toUpperCase()] || status;
  };

  const getStatusClass = (status) => {
    if (!status) return 'secondary';
    const statusUpper = status.toUpperCase();
    const statusMap = {
      'COMPLETED': 'success', 'SHIPPING': 'info', 'PROCESSING': 'primary',
      'PENDING': 'warning', 'CANCELLED': 'danger',
    };
    return `badge--${statusMap[statusUpper] || 'secondary'}`;
  };

  useEffect(() => {
    fetchOrders();
    setCurrentPage(1); 
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = `/orders/admin?status=${statusFilter}`; 
      const res = await apiClient.get(url);

      if (Array.isArray(res.data)) {
        const sortedOrders = res.data.sort((a, b) => b.id - a.id);
        setOrders(sortedOrders);
      } else {
        setOrders([]);
        setError('Dữ liệu không hợp lệ');
      }
    } catch (error) {
      console.error('Lỗi tải đơn hàng:', error);
      setError('Không thể tải đơn hàng');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrderDetail = async (orderId) => {
    try {
      const res = await apiClient.get(`/orders/${orderId}`);
      setSelectedOrder(res.data);
      setEditingStatus(res.data.status); 
      setShowDetailModal(true);
    } catch (err) {
      alert("Lỗi tải chi tiết đơn hàng");
    }
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  };
  
  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    
    try {
      await apiClient.put(`/orders/${selectedOrder.id}/status`, null, {
        params: { status: editingStatus }
      });
      
      alert("Cập nhật trạng thái thành công!");
      fetchOrders(); 
      handleCloseDetailModal();
      
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại!");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  if (loading && !showDetailModal) return <div className="loading" style={{padding: '20px', textAlign: 'center'}}>Đang tải...</div>;
  if (error) return <div className="error" style={{padding: '20px', color: 'red'}}>Lỗi: {error}</div>;

  return (
    <div className="page-card">
      <div className="page-card__header">
        <h3 className="page-card__title">Danh sách đơn hàng</h3>
        <select className="select-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ xác nhận</option>
          <option value="processing">Đang xử lý</option>
          <option value="shipping">Đang giao</option>
          <option value="completed">Đã giao</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      <div className="table-container">
        {orders.length === 0 ? (
             <div className="no-data" style={{padding: '20px', textAlign: 'center'}}>Chưa có đơn hàng nào.</div>
        ) : (
            <>
                {/* 👇 1. THÊM table-layout: fixed ĐỂ CỐ ĐỊNH CỘT */}
                <table className="data-table" style={{width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed'}}>
                  <thead>
                    <tr style={{background: '#f4f4f4', height: '50px', textAlign: 'left'}}>
                      <th style={{width: '100px', padding: '10px'}}>Mã đơn</th>
                      {/* 👇 2. SỬA Ở ĐÂY: Đổi minWidth thành width cố định (160px) */}
                      <th style={{width: '160px', padding: '10px'}}>Khách hàng</th>
                      <th style={{width: '120px', padding: '10px'}}>Ngày tạo</th>
                      <th style={{width: '120px', padding: '10px'}}>Tổng tiền</th>
                      <th style={{width: '130px', padding: '10px'}}>Trạng thái</th>
                      <th style={{width: '100px', padding: '10px'}}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrders.map((order) => (
                      <tr key={order.id} style={{height: '60px', borderBottom: '1px solid #eee'}}>
                        <td className="font-medium" style={{padding: '10px'}}>{formatOrderId(order.id)}</td>
                        
                        {/* 👇 3. Cắt ngắn tên khách hàng nếu quá dài */}
                        <td style={{padding: '10px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>
                          <div style={{fontWeight: 500}}>{order.customerName}</div>
                          <small className="text-muted" style={{color: '#666'}}>{order.phone}</small>
                        </td>
                        <td style={{padding: '10px'}}>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : '-'}</td>
                        <td style={{padding: '10px', fontWeight: 'bold', color: '#d70018'}}>{order.totalAmount?.toLocaleString('vi-VN')}đ</td>
                        <td style={{padding: '10px'}}>
                          <span className={`badge ${getStatusClass(order.status)}`}>
                            {translateStatus(order.status)}
                          </span>
                        </td>
                        <td style={{padding: '10px'}}>
                          <button className="link-btn" onClick={() => handleViewOrderDetail(order.id)}>
                            Chi tiết
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {totalPages > 1 && (
                    <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', padding: '20px' }}>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            style={{ 
                                padding: '5px 10px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', 
                                opacity: currentPage === 1 ? 0.5 : 1, border: '1px solid #ddd', borderRadius: '4px', background: '#fff' 
                            }}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>Trang {currentPage} / {totalPages}</span>

                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            style={{ 
                                padding: '5px 10px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', 
                                opacity: currentPage === totalPages ? 0.5 : 1, border: '1px solid #ddd', borderRadius: '4px', background: '#fff'
                            }}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </>
        )}
      </div>

      {showDetailModal && selectedOrder && (
        <div className="modal-overlay" onClick={handleCloseDetailModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{maxWidth: '800px', width: '90%'}}>
            
            <div className="modal-header" style={{borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px'}}>
              <h2 style={{margin: 0}}>Chi tiết đơn hàng {formatOrderId(selectedOrder.id)}</h2>
              <button className="close-btn" onClick={handleCloseDetailModal} style={{background: 'none', border: 'none', cursor: 'pointer'}}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body" style={{maxHeight: '70vh', overflowY: 'auto'}}>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px'}}>
                
                <div style={{flex: 1, minWidth: '300px'}}>
                  <h4 style={{marginBottom: '10px', color: '#555'}}>Thông tin giao hàng</h4>
                  <p style={{marginBottom: '5px'}}><strong>Người nhận:</strong> {selectedOrder.customerName}</p>
                  <p style={{marginBottom: '5px'}}><strong>SĐT:</strong> {selectedOrder.phone}</p>
                  <p style={{marginBottom: '5px'}}><strong>Địa chỉ:</strong> {selectedOrder.shippingAddress}</p>
                  {selectedOrder.note && <p style={{marginBottom: '5px'}}><strong>Ghi chú:</strong> {selectedOrder.note}</p>}
                </div>

                <div className="status-update-box">
                  <h4>Cập nhật trạng thái</h4>
                  
                  <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                    <select 
                      className="modal-select" 
                      value={editingStatus}
                      onChange={(e) => setEditingStatus(e.target.value)}
                      style={{flex: 1}}
                    >
                      <option value="PENDING">Chờ xác nhận</option>
                      <option value="PROCESSING">Đang xử lý</option>
                      <option value="SHIPPING">Đang giao</option>
                      <option value="COMPLETED">Đã giao</option>
                      <option value="CANCELLED">Đã hủy</option>
                    </select>
                    
                    <button 
                      className="btn btn--primary" 
                      onClick={handleUpdateStatus}
                      style={{whiteSpace: 'nowrap'}}
                    >
                      <Save size={16}/> Lưu
                    </button>
                  </div>

                  <p style={{marginTop: '15px', fontSize: '0.9em', color: '#666'}}>
                    <strong>Ngày đặt:</strong> {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>

              <h4 style={{marginBottom: '10px', color: '#555'}}>Sản phẩm</h4>
              <table className="data-table" style={{width: '100%', border: '1px solid #eee', tableLayout: 'fixed'}}>
                <thead style={{background: '#f3f4f6'}}>
                  <tr>
                    <th style={{padding: '10px'}}>Sản phẩm</th>
                    <th style={{padding: '10px', width: '120px'}}>Đơn giá</th>
                    <th style={{padding: '10px', width: '60px'}}>SL</th>
                    <th style={{padding: '10px', width: '120px', textAlign: 'right'}}>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item, index) => (
                    <tr key={index} style={{borderBottom: '1px solid #eee', height: '60px'}}>
                      <td style={{padding: '10px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <div style={{width: '40px', height: '40px', flexShrink: 0}}>
                            <img 
                                src={item.imageUrl ? (item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:8080${item.imageUrl}`) : 'https://via.placeholder.com/50'} 
                                alt="" 
                                style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd'}}
                            />
                        </div>
                        <span style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} title={item.productName}>{item.productName}</span>
                      </td>
                      <td style={{padding: '10px'}}>{item.price?.toLocaleString('vi-VN')}đ</td>
                      <td style={{padding: '10px'}}>x{item.quantity}</td>
                      <td style={{padding: '10px', textAlign: 'right', fontWeight: 'bold'}}>{(item.price * item.quantity).toLocaleString('vi-VN')}đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{marginTop: '20px', textAlign: 'right', fontSize: '1.2rem'}}>
                 Tổng cộng: <span style={{color: '#d32f2f', fontWeight: 'bold'}}>{selectedOrder.totalAmount?.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            <div className="modal-actions" style={{marginTop: '20px', display: 'flex', justifyContent: 'flex-end'}}>
              <button className="btn-cancel" onClick={handleCloseDetailModal}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// // Accounts Page
// const AccountsPage = () => {
//   const [accounts, setAccounts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchAccounts();
//   }, []);

//   const fetchAccounts = async () => {
//     try {
//       setLoading(true);
//       // TODO: Gọi API lấy danh sách tài khoản
//       // const response = await fetch('/api/accounts');
//       // const data = await response.json();
//       // setAccounts(data);

//       // Mock data
//       setAccounts([
//         {
//           id: 1,
//           name: "Nguyễn Văn A",
//           email: "nguyenvana@email.com",
//           role: "Khách hàng",
//           status: "Hoạt động",
//         },
//         {
//           id: 2,
//           name: "Trần Thị B",
//           email: "tranthib@email.com",
//           role: "Khách hàng",
//           status: "Hoạt động",
//         },
//         {
//           id: 3,
//           name: "Admin User",
//           email: "admin@email.com",
//           role: "Admin",
//           status: "Hoạt động",
//         },
//       ]);
//     } catch (error) {
//       console.error("Error fetching accounts:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddAccount = () => {
//     // TODO: Mở modal thêm tài khoản
//     console.log("Add account");
//   };

//   const handleEditAccount = (accountId) => {
//     // TODO: Mở modal sửa tài khoản
//     console.log("Edit account:", accountId);
//   };

//   const handleDeleteAccount = async (accountId) => {
//     if (window.confirm("Bạn có chắc muốn xóa tài khoản này?")) {
//       try {
//         // TODO: Gọi API xóa tài khoản
//         // await fetch(`/api/accounts/${accountId}`, { method: 'DELETE' });

//         setAccounts(accounts.filter((a) => a.id !== accountId));
//         alert("Xóa tài khoản thành công!");
//       } catch (error) {
//         console.error("Error deleting account:", error);
//         alert("Xóa tài khoản thất bại!");
//       }
//     }
//   };

//   if (loading) {
//     return <div className="loading">Đang tải dữ liệu...</div>;
//   }

//   return (
//     <div className="page-card">
//       <div className="page-card__header">
//         <h3 className="page-card__title">Quản lý tài khoản</h3>
//         <button className="btn btn--primary" onClick={handleAddAccount}>
//           <Plus size={20} />
//           Thêm tài khoản
//         </button>
//       </div>

//       <div className="table-container">
//         <table className="data-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Tên</th>
//               <th>Email</th>
//               <th>Vai trò</th>
//               <th>Trạng thái</th>
//               <th>Hành động</th>
//             </tr>
//           </thead>
//           <tbody>
//             {accounts.map((account) => (
//               <tr key={account.id}>
//                 <td>{account.id}</td>
//                 <td className="font-medium">{account.name}</td>
//                 <td>{account.email}</td>
//                 <td>
//                   <span
//                     className={`badge ${
//                       account.role === "Admin" ? "badge--purple" : "badge--info"
//                     }`}
//                   >
//                     {account.role}
//                   </span>
//                 </td>
//                 <td>
//                   <span className="badge badge--success">{account.status}</span>
//                 </td>
//                 <td>
//                   <div className="action-buttons">
//                     <button
//                       className="action-btn action-btn--edit"
//                       onClick={() => handleEditAccount(account.id)}
//                     >
//                       <Edit size={18} />
//                     </button>
//                     <button
//                       className="action-btn action-btn--delete"
//                       onClick={() => handleDeleteAccount(account.id)}
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };
const API_BASE = 'http://localhost:8080/api/users';

const AccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAccount, setEditingAccount] = useState(null);
  const [newAccount, setNewAccount] = useState({
    username: '',
    email: '',
    role: 'Khách hàng',
    status: 'Hoạt động',
  });

  // 👇 2. STATE PHÂN TRANG
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Số tài khoản mỗi trang

  const formRef = useRef(null);
  const API_BASE = "http://localhost:8080/api/users"; // Đảm bảo đường dẫn API đúng

  // ================== LẤY DANH SÁCH TÀI KHOẢN ==================
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE);
      const data = await response.json();

      // Map dữ liệu từ backend
      const mappedData = data.map((acc) => ({
        id: acc.id,
        username: acc.username,
        email: acc.email,
        role: acc.role === 'ADMIN' ? 'Admin' : 'Khách hàng',
        status: acc.active ? 'Hoạt động' : 'Khóa',
      }));

      setAccounts(mappedData);
    } catch (error) {
      console.error('Lỗi tải tài khoản:', error);
    } finally {
      setLoading(false);
    }
  };

  // ================== XỬ LÝ THÊM TÀI KHOẢN ==================
  const handleAddAccount = async () => {
    const userPayload = {
      username: newAccount.username,
      email: newAccount.email,
      password: '123456',
      role: newAccount.role === 'Admin' ? 'ADMIN' : 'CUSTOMER',
      active: newAccount.status === 'Hoạt động',
    };

    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload),
      });

      if (response.ok) {
        await fetchAccounts();
        setNewAccount({
          username: '',
          email: '',
          role: 'Khách hàng',
          status: 'Hoạt động',
        });
        alert('Thêm tài khoản thành công!');
      } else {
        alert('Lỗi khi thêm tài khoản!');
      }
    } catch (error) {
      console.error('Error adding account:', error);
    }
  };

  // ================== XỬ LÝ SỬA TÀI KHOẢN ==================
  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setNewAccount({ ...account });
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUpdateAccount = async () => {
    const userPayload = {
      username: newAccount.username,
      email: newAccount.email,
      role: newAccount.role === 'Admin' ? 'ADMIN' : 'CUSTOMER',
      active: newAccount.status === 'Hoạt động',
    };

    try {
      const response = await fetch(`${API_BASE}/${editingAccount.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload),
      });

      if (response.ok) {
        await fetchAccounts();
        setEditingAccount(null);
        setNewAccount({
          username: '',
          email: '',
          role: 'Khách hàng',
          status: 'Hoạt động',
        });
        alert('Cập nhật tài khoản thành công!');
      } else {
        alert('Lỗi khi cập nhật tài khoản!');
      }
    } catch (error) {
      console.error('Error updating account:', error);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 👇 3. LOGIC TÍNH TOÁN PHÂN TRANG
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAccounts = accounts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(accounts.length / itemsPerPage);

  // if (loading) return <div className="loading">Đang tải dữ liệu...</div>;

  return (
    <div className="page-card">
      {/* ======= HEADER ======= */}
      <div className="page-card__header">
        <h3 className="page-card__title">Quản lý tài khoản</h3>
        <button className="btn btn-primary" onClick={scrollToForm}>
          Thêm tài khoản
        </button>
      </div>

      {/* ======= BẢNG DỮ LIỆU ======= */}
      <div className="table-container">
        <table className="data-table" style={{width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed'}}>
          <thead>
            <tr style={{background: '#f4f4f4', height: '50px', textAlign: 'left'}}>
              <th style={{width: '50px', padding: '10px'}}>ID</th>
              <th style={{padding: '10px'}}>Tên</th>
              <th style={{padding: '10px'}}>Email</th>
              <th style={{width: '120px', padding: '10px'}}>Vai trò</th>
              <th style={{width: '120px', padding: '10px'}}>Trạng thái</th>
              <th style={{width: '100px', padding: '10px'}}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {/* 👇 Render currentAccounts thay vì accounts */}
            {currentAccounts.map((account) => (
              <tr key={account.id} style={{height: '60px', borderBottom: '1px solid #eee'}}>
                <td style={{padding: '10px'}}>{account.id}</td>
                <td className="font-medium" style={{padding: '10px'}}>{account.username}</td>
                <td style={{padding: '10px'}}>{account.email}</td>
                <td style={{padding: '10px'}}>
                  <span
                    className={`badge ${
                      account.role === 'Admin'
                        ? 'badge--purple text-dark'
                        : 'badge--info text-dark'
                    }`}
                  >
                    {account.role}
                  </span>
                </td>
                <td style={{padding: '10px'}}>
                  <span
                    className={`badge ${
                      account.status === 'Hoạt động'
                        ? 'badge--success text-dark'
                        : 'badge--danger text-dark'
                    }`}
                  >
                    {account.status}
                  </span>
                </td>
                <td style={{padding: '10px'}}>
                  <div className="action-buttons text-center">
                    <button
                      className="action-btn action-btn--edit"
                      onClick={() => handleEditAccount(account)}
                    >
                      <Edit size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* 👇 4. UI PHÂN TRANG */}
        {totalPages > 1 && (
            <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', padding: '20px' }}>
                <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    style={{ padding: '5px 10px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1, border: '1px solid #ddd', borderRadius: '4px', background: '#fff' }}
                >
                    <ChevronLeft size={20} />
                </button>
                
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Trang {currentPage} / {totalPages}</span>

                <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    style={{ padding: '5px 10px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1, border: '1px solid #ddd', borderRadius: '4px', background: '#fff' }}
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        )}
      </div>

      {/* ======= FORM THÊM / SỬA ======= */}
      <div ref={formRef} className="container mt-4">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-primary text-white d-flex align-items-center justify-content-between">
            <h5 className="mb-0">
              {editingAccount ? ' Chỉnh sửa tài khoản' : ' Thêm tài khoản mới'}
            </h5>
            {editingAccount && (
              <button
                className="btn btn-light btn-sm"
                onClick={() => {
                  setEditingAccount(null);
                  setNewAccount({
                    username: '',
                    email: '',
                    role: 'Khách hàng',
                    status: 'Hoạt động',
                  });
                }}
              >
                Hủy
              </button>
            )}
          </div>

          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Tên người dùng</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập tên người dùng"
                  value={newAccount.username}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, username: e.target.value })
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Nhập email"
                  value={newAccount.email}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, email: e.target.value })
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Vai trò</label>
                <select
                  className="form-select"
                  value={newAccount.role}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, role: e.target.value })
                  }
                >
                  <option value="Khách hàng">Khách hàng</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Trạng thái</label>
                <select
                  className="form-select"
                  value={newAccount.status}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, status: e.target.value })
                  }
                >
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Khóa">Khóa</option>
                </select>
              </div>
            </div>

            <div className="text-center mt-4">
              {editingAccount ? (
                <button
                  className="btn btn-primary px-4 me-2"
                  onClick={handleUpdateAccount}
                >
                  <i className="bi bi-save"></i> Lưu thay đổi
                </button>
              ) : (
                <button
                  className="btn btn-primary px-4"
                  onClick={handleAddAccount}
                >
                  <i className="bi bi-person-plus"></i> Thêm tài khoản
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// Brands Page

// const BrandsPage = () => {
//  // 👈 SỬ DỤNG HOOK CHUNG VÀ ĐỔI TÊN HÀM CHO DỄ ĐỌC
//   const {
//     data: brands, // Đổi tên 'data' thành 'brands'
//     loading,
//     error,
//     addItem: addBrand, // Đổi tên 'addItem' thành 'addBrand'
//     deleteItem: deleteBrand, // Đổi tên 'deleteItem' thành 'deleteBrand'
//     updateItem: updateBrand, // Đổi tên 'updateItem' thành 'updateBrand'
//   } = useGenericApi('brands'); // 👈 Truyền tên resource 'brands'

//   // ** LƯU Ý: Phần quản lý Modal (isModalOpen, itemToEdit) bị thiếu trong code hiện tại **
//   // Tôi sẽ giữ nguyên logic xử lý sự kiện, nhưng bạn cần đảm bảo biến 'brand'
//   // trong hàm updateItem (đã được đổi tên thành updateBrand) nhận đủ ID.

//   const handleAddBrand = async () => {
//     // TODO: Thực tế, dữ liệu này sẽ lấy từ Modal/Form
//     const brandData = {
//       name: `New Brand ${Date.now()}`,
//       logoUrl: "new_logo.png",
//     };
//     const result = await addBrand(brandData); // Gọi hàm chung đã đổi tên
//     if (result.success) {
//       alert(`Thêm thương hiệu "${result.item.name}" thành công!`); // Đổi result.brand thành result.item
//     } else {
//       alert(`Thêm thương hiệu thất bại: ${result.error}`);
//     }
//   };

//   const handleEditBrand = (brandId) => {
//     // Logic này sẽ cần mở Modal và truyền Brand object
//     console.log("Open Edit Modal for brand:", brandId);
//     // VÍ DỤ: openModal(brands.find(b => b.id === brandId));
//   };

//   const handleDeleteBrand = async (brandId) => {
//     if (
//       window.confirm(
//         "Bạn có chắc muốn xóa thương hiệu này? Thao tác này KHÔNG thể hoàn tác."
//       )
//     ) {
//       const result = await deleteBrand(brandId); // Gọi hàm chung đã đổi tên
//       if (result.success) {
//         alert("Xóa thương hiệu thành công!");
//       } else {
//         alert(`Xóa thương hiệu thất bại: ${result.error}`);
//       }
//     }
//   };

//   if (loading) {
//     return <div className="loading">Đang tải dữ liệu...</div>;
//   }
//   if (error) {
//     return <div className="error">Lỗi: {error}</div>;
//   }

//   return (
//     <div className="page-card">
//       {/* ... Phần Header và Button (giữ nguyên) ... */}
//       <div className="page-card__header">
//         <h3 className="page-card__title">Quản lý thương hiệu</h3>
//         <button
//           className="btn btn--primary"
//           onClick={handleAddBrand}
//         >
//           <Plus size={20} />
//           Thêm thương hiệu
//         </button>
//       </div>

//       <div className="table-container">
//         <table className="data-table">
//           <thead>
//             {/* ... (Giữ nguyên Thead) ... */}
//             <tr>
//               <th>ID</th>
//               <th>Tên thương hiệu</th>
//               <th>Logo</th>
//               <th>Số sản phẩm</th>
//               <th>Hành động</th>
//             </tr>
//           </thead>
//           <tbody>
//             {brands.map((brand) => (
//               <tr key={brand.id}>
//                 <td className="font-medium">{brand.id}</td>
//                 <td>{brand.name}</td>
//                 <td>
//                   <img
//                     src={brand.logoUrl}
//                     alt={brand.name}
//                     className="brand-logo-thumbnail"
//                     style={{ width: '40px', height: '40px', objectFit: 'contain', border: '1px solid #eee' }}
//                   />
//                 </td>
//                 <td>{brand.productCount}</td> {/* Lấy từ processedData trong hook */}
//                 <td>
//                   <div className="action-buttons">
//                     <button
//                       className="action-btn action-btn--edit"
//                       onClick={() => handleEditBrand(brand.id)}
//                     >
//                       <Edit size={18} />
//                     </button>
//                     <button
//                       className="action-btn action-btn--delete"
//                       onClick={() => handleDeleteBrand(brand.id)}
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {brands.length === 0 && !loading && (
//           <p className="empty-message">Chưa có thương hiệu nào được thêm.</p>
//         )}
//       </div>

//       {/* TODO: Cần tích hợp GenericFormModal ở đây để Thêm/Sửa */}
//     </div>
//   );
// };

const BrandsPage = () => {
  const {
    data: brands,
    loading,
    error,
    addItem: addBrand,
    deleteItem: deleteBrand,
    updateItem: updateBrand,
  } = useGenericApi('brands');

  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const formRef = useRef(null);

  // Reset form
  const resetForm = () => {
    setFormData({ name: '', logoUrl: '' });
    setEditingId(null);
  };

  // Xử lý thêm/sửa thương hiệu
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên thương hiệu!');
      return;
    }

    if (editingId) {
      // Cập nhật
      // BrandsPage: Gộp ID và FormData thành một object
      const payload = { id: editingId, ...formData };
      const result = await updateBrand(payload);
      if (result.success) {
        alert('Cập nhật thương hiệu thành công!');
        resetForm();
      } else {
        alert(`Cập nhật thất bại: ${result.error}`);
      }
    } else {
      // Thêm mới
      const result = await addBrand(formData);
      if (result.success) {
        alert('Thêm thương hiệu thành công!');
        resetForm();
      } else {
        alert(`Thêm thất bại: ${result.error}`);
      }
    }
  };

  // Xử lý sửa - đổ dữ liệu lên form
  const handleEditBrand = (brand) => {
    setFormData({ name: brand.name, logoUrl: brand.logoUrl });
    setEditingId(brand.id);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Xử lý xóa một thương hiệu
  const handleDeleteBrand = async (brandId) => {
    if (window.confirm('Bạn có chắc muốn xóa thương hiệu này?')) {
      const result = await deleteBrand(brandId);
      if (result.success) {
        alert('Xóa thương hiệu thành công!');
        setSelectedBrands(selectedBrands.filter((id) => id !== brandId));
      } else {
        alert(`Xóa thất bại: ${result.error}`);
      }
    }
  };

  // Xử lý xóa nhiều thương hiệu
  const handleDeleteSelected = async () => {
    if (selectedBrands.length === 0) {
      alert('Vui lòng chọn ít nhất một thương hiệu để xóa!');
      return;
    }

    if (
      window.confirm(
        `Bạn có chắc muốn xóa ${selectedBrands.length} thương hiệu đã chọn?`
      )
    ) {
      for (const brandId of selectedBrands) {
        await deleteBrand(brandId);
      }
      alert('Xóa các thương hiệu thành công!');
      setSelectedBrands([]);
    }
  };

  // Toggle chọn một thương hiệu
  const toggleSelectBrand = (brandId) => {
    if (selectedBrands.includes(brandId)) {
      setSelectedBrands(selectedBrands.filter((id) => id !== brandId));
    } else {
      setSelectedBrands([...selectedBrands, brandId]);
    }
  };

  // Toggle chọn tất cả
  const toggleSelectAll = () => {
    if (selectedBrands.length === brands.length) {
      setSelectedBrands([]);
    } else {
      setSelectedBrands(brands.map((b) => b.id));
    }
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }
  if (error) {
    return <div className="error">Lỗi: {error}</div>;
  }

  return (
    <div className="page-card">
      {/* FORM THÊM/SỬA */}
      <div ref={formRef} className="container mt-4 mb-4">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-primary text-white d-flex align-items-center justify-content-between">
            <h5 className="mb-0">
              {editingId
                ? '✏️ Chỉnh sửa thương hiệu'
                : '➕ Thêm thương hiệu mới'}
            </h5>
            {editingId && (
              <button className="btn btn-light btn-sm" onClick={resetForm}>
                Hủy
              </button>
            )}
          </div>

          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Tên thương hiệu
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập tên thương hiệu"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">URL Logo</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập URL logo"
                  value={formData.logoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, logoUrl: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="text-center mt-4">
              <button className="btn btn-primary px-4" onClick={handleSubmit}>
                {editingId ? '💾 Lưu thay đổi' : '➕ Thêm thương hiệu'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DANH SÁCH THƯƠNG HIỆU */}
      <div className="page-card__header">
        <h3 className="page-card__title">Danh sách thương hiệu</h3>
        {selectedBrands.length > 0 && (
          <button className="btn btn-danger" onClick={handleDeleteSelected}>
            <Trash2 size={20} />
            Xóa đã chọn ({selectedBrands.length})
          </button>
        )}
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}>
                <input
                  type="checkbox"
                  checked={
                    brands.length > 0 && selectedBrands.length === brands.length
                  }
                  onChange={toggleSelectAll}
                  style={{ cursor: 'pointer' }}
                />
              </th>
              <th>ID</th>
              <th>Tên thương hiệu</th>
              <th>Logo</th>
              <th>Số sản phẩm</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand.id)}
                    onChange={() => toggleSelectBrand(brand.id)}
                    style={{ cursor: 'pointer' }}
                  />
                </td>
                <td className="font-medium">{brand.id}</td>
                <td>{brand.name}</td>
                <td>
                  <img
                    src={
                      brand.logoUrl
                        ? brand.logoUrl.startsWith("http")
                          ? brand.logoUrl
                          : `http://localhost:8080${brand.logoUrl}`
                        : "https://via.placeholder.com/40" // Ảnh mặc định nếu không có logo
                    }
                    alt={brand.name}
                    className="brand-logo-thumbnail"
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'contain',
                      border: '1px solid #eee',
                    }}
                    // Thêm xử lý lỗi ảnh nếu link chết
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/40?text=Error";
                    }}
                  />
                </td>
                <td>{brand.productCount}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn action-btn--edit"
                      onClick={() => handleEditBrand(brand)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="action-btn action-btn--delete"
                      onClick={() => handleDeleteBrand(brand.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {brands.length === 0 && !loading && (
          <p className="empty-message">Chưa có thương hiệu nào được thêm.</p>
        )}
      </div>
    </div>
  );
};

// Usage Purpose Page
// const UsagePurposePage = () => {
//   const [purposes, setPurposes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchUsagePurposes();
//   }, []);

//   const fetchUsagePurposes = async () => {
//     try {
//       setLoading(true);
//       // TODO: Gọi API lấy danh sách nhu cầu sử dụng
//       // const response = await fetch('/api/usage-purposes');
//       // const data = await response.json();
//       // setPurposes(data);

//       // Mock data
//       setPurposes([
//         { id: 1, name: "Gaming", productCount: 35 },
//         { id: 2, name: "Văn phòng", productCount: 68 },
//         { id: 3, name: "Thiết kế - Kĩ thuật", productCount: 42 },
//         { id: 4, name: "Học tập", productCount: 56 },
//       ]);
//     } catch (error) {
//       console.error("Error fetching usage purposes:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddPurpose = () => {
//     console.log("Add purpose");
//   };

//   const handleEditPurpose = (purposeId) => {
//     console.log("Edit purpose:", purposeId);
//   };

//   const handleDeletePurpose = async (purposeId) => {
//     if (window.confirm("Bạn có chắc muốn xóa nhu cầu này?")) {
//       try {
//         setPurposes(purposes.filter((p) => p.id !== purposeId));
//         alert("Xóa nhu cầu sử dụng thành công!");
//       } catch (error) {
//         console.error("Error deleting purpose:", error);
//         alert("Xóa nhu cầu sử dụng thất bại!");
//       }
//     }
//   };

//   if (loading) {
//     return <div className="loading">Đang tải dữ liệu...</div>;
//   }

//   return (
//     <div className="page-card">
//       <div className="page-card__header">
//         <h3 className="page-card__title">Quản lý nhu cầu sử dụng</h3>
//         <button className="btn btn--primary" onClick={handleAddPurpose}>
//           <Plus size={20} />
//           Thêm nhu cầu
//         </button>
//       </div>

//       <div className="category-grid">
//         {purposes.map((purpose) => (
//           <div key={purpose.id} className="category-card">
//             <div className="category-card__header">
//               <h4 className="category-card__title">{purpose.name}</h4>
//               <div className="action-buttons">
//                 <button
//                   className="action-btn action-btn--edit action-btn--sm"
//                   onClick={() => handleEditPurpose(purpose.id)}
//                 >
//                   <Edit size={16} />
//                 </button>
//                 <button
//                   className="action-btn action-btn--delete action-btn--sm"
//                   onClick={() => handleDeletePurpose(purpose.id)}
//                 >
//                   <Trash2 size={16} />
//                 </button>
//               </div>
//             </div>
//             <p className="category-card__count">
//               {purpose.productCount} sản phẩm
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
const UsagePurposePage = () => {
  const {
    data: purposes,
    loading,
    error,
    addItem: addPurpose,
    deleteItem: deletePurpose,
    updateItem: updatePurpose,
  } = useGenericApi('usage-purposes'); // endpoint: /api/usage-purposes

  const [formData, setFormData] = useState({ name: '' });
  const [editingId, setEditingId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const formRef = useRef(null);

  const resetForm = () => {
    setFormData({ name: '' });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên nhu cầu sử dụng!');
      return;
    }
    // UsagePurposePage: Gộp ID và FormData thành một object
    const payload = { id: editingId, ...formData };
    const fn = editingId ? updatePurpose(payload) : addPurpose(formData);

    const result = await fn;
    if (result.success) {
      alert(
        editingId
          ? 'Cập nhật nhu cầu sử dụng thành công!'
          : 'Thêm nhu cầu sử dụng thành công!'
      );
      resetForm();
    } else {
      alert(`${editingId ? 'Cập nhật' : 'Thêm'} thất bại: ${result.error}`);
    }
  };

  const handleEdit = (item) => {
    setFormData({ name: item.name });
    setEditingId(item.id);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa nhu cầu này?')) return;
    const result = await deletePurpose(id);
    if (result.success) {
      alert('Xóa thành công!');
      setSelectedIds((prev) => prev.filter((x) => x !== id));
    } else {
      alert(`Xóa thất bại: ${result.error}`);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert('Vui lòng chọn ít nhất một nhu cầu để xóa!');
      return;
    }
    if (
      !window.confirm(
        `Bạn có chắc muốn xóa ${selectedIds.length} nhu cầu đã chọn?`
      )
    )
      return;
    for (const id of selectedIds) await deletePurpose(id);
    alert('Xóa các nhu cầu thành công!');
    setSelectedIds([]);
  };

  const toggleSelect = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleSelectAll = () =>
    setSelectedIds((prev) =>
      purposes.length > 0 && prev.length === purposes.length
        ? []
        : purposes.map((x) => x.id)
    );

  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;

  return (
    <div className="page-card">
      {/* FORM THÊM/SỬA */}
      <div ref={formRef} className="container mt-4 mb-4">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-primary text-white d-flex align-items-center justify-content-between">
            <h5 className="mb-0">
              {editingId
                ? '✏️ Chỉnh sửa nhu cầu sử dụng'
                : '➕ Thêm nhu cầu sử dụng mới'}
            </h5>
            {editingId && (
              <button className="btn btn-light btn-sm" onClick={resetForm}>
                Hủy
              </button>
            )}
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-12">
                <label className="form-label fw-semibold">Tên nhu cầu</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="VD: Gaming, Văn phòng, Học tập..."
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="text-center mt-4">
              <button className="btn btn-primary px-4" onClick={handleSubmit}>
                {editingId ? '💾 Lưu thay đổi' : '➕ Thêm nhu cầu'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DANH SÁCH */}
      <div className="page-card__header">
        <h3 className="page-card__title">Danh sách nhu cầu sử dụng</h3>
        {selectedIds.length > 0 && (
          <button className="btn btn-danger" onClick={handleDeleteSelected}>
            <Trash2 size={20} /> Xóa đã chọn ({selectedIds.length})
          </button>
        )}
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}>
                <input
                  type="checkbox"
                  checked={
                    purposes.length > 0 &&
                    selectedIds.length === purposes.length
                  }
                  onChange={toggleSelectAll}
                  style={{ cursor: 'pointer' }}
                />
              </th>
              <th>ID</th>
              <th>Tên nhu cầu</th>
              <th>Số sản phẩm</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {purposes.map((p) => (
              <tr key={p.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(p.id)}
                    onChange={() => toggleSelect(p.id)}
                    style={{ cursor: 'pointer' }}
                  />
                </td>
                <td className="font-medium">{p.id}</td>
                <td>{p.name}</td>
                <td>{p.productCount}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn action-btn--edit"
                      onClick={() => handleEdit(p)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="action-btn action-btn--delete"
                      onClick={() => handleDelete(p.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {purposes.length === 0 && (
          <p className="empty-message">Chưa có nhu cầu nào được thêm.</p>
        )}
      </div>
    </div>
  );
};

// Screen Size Page
// const ScreenSizePage = () => {
//   const [sizes, setSizes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchScreenSizes();
//   }, []);

//   const fetchScreenSizes = async () => {
//     try {
//       setLoading(true);
//       // TODO: Gọi API lấy danh sách kích thước màn hình
//       // const response = await fetch('/api/screen-sizes');
//       // const data = await response.json();
//       // setSizes(data);

//       // Mock data
//       setSizes([
//         { id: 1, name: "13-14 inch", productCount: 52 },
//         { id: 2, name: "15-16 inch", productCount: 89 },
//         { id: 3, name: "17 inch trở lên", productCount: 35 },
//       ]);
//     } catch (error) {
//       console.error("Error fetching screen sizes:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddSize = () => {
//     console.log("Add size");
//   };

//   const handleEditSize = (sizeId) => {
//     console.log("Edit size:", sizeId);
//   };

//   const handleDeleteSize = async (sizeId) => {
//     if (window.confirm("Bạn có chắc muốn xóa kích thước này?")) {
//       try {
//         setSizes(sizes.filter((s) => s.id !== sizeId));
//         alert("Xóa kích thước thành công!");
//       } catch (error) {
//         console.error("Error deleting size:", error);
//         alert("Xóa kích thước thất bại!");
//       }
//     }
//   };

//   if (loading) {
//     return <div className="loading">Đang tải dữ liệu...</div>;
//   }

//   return (
//     <div className="page-card">
//       <div className="page-card__header">
//         <h3 className="page-card__title">Quản lý kích thước màn hình</h3>
//         <button className="btn btn--primary" onClick={handleAddSize}>
//           <Plus size={20} />
//           Thêm kích thước
//         </button>
//       </div>

//       <div className="category-grid category-grid--3col">
//         {sizes.map((size) => (
//           <div key={size.id} className="category-card">
//             <div className="category-card__header">
//               <h4 className="category-card__title">{size.name}</h4>
//               <div className="action-buttons">
//                 <button
//                   className="action-btn action-btn--edit action-btn--sm"
//                   onClick={() => handleEditSize(size.id)}
//                 >
//                   <Edit size={16} />
//                 </button>
//                 <button
//                   className="action-btn action-btn--delete action-btn--sm"
//                   onClick={() => handleDeleteSize(size.id)}
//                 >
//                   <Trash2 size={16} />
//                 </button>
//               </div>
//             </div>
//             <p className="category-card__count">{size.productCount} sản phẩm</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
const ScreenSizePage = () => {
  // 👈 Sử dụng useGenericApi với resource name là 'screen-sizes'
  const {
    data: sizes, // Đổi tên 'data' thành 'sizes'
    loading,
    error,
    addItem: addSize,
    deleteItem: deleteSize,
    updateItem: updateSize,
  } = useGenericApi('screen-sizes'); // endpoint: /api/screen-sizes

  const [formData, setFormData] = useState({ value: '' }); // Thay 'name' bằng 'value'
  const [editingId, setEditingId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const formRef = useRef(null);

  const resetForm = () => {
    setFormData({ value: '' });
    setEditingId(null);
  };

  // Xử lý thêm/sửa kích thước
  const handleSubmit = async () => {
    const valueAsDouble = parseFloat(formData.value); // Chuyển đổi sang số thực

    if (isNaN(valueAsDouble) || valueAsDouble <= 0) {
      alert('Vui lòng nhập kích thước màn hình hợp lệ (là số dương)!');
      return;
    }

    const payload = {
      id: editingId, // Chỉ cần cho PUT
      value: valueAsDouble,
    };

    const fn = editingId ? updateSize(payload) : addSize(payload); // Truyền payload
    const result = await fn;

    if (result.success) {
      alert(
        editingId
          ? 'Cập nhật kích thước thành công!'
          : 'Thêm kích thước thành công!'
      );
      resetForm();
    } else {
      alert(`${editingId ? 'Cập nhật' : 'Thêm'} thất bại: ${result.error}`);
    }
  };

  // Xử lý sửa - đổ dữ liệu lên form
  const handleEdit = (item) => {
    setFormData({ value: item.value.toString() }); // Chuyển Double về String cho input
    setEditingId(item.id);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Xử lý xóa một kích thước
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa kích thước này?')) return;
    const result = await deleteSize(id);
    if (result.success) {
      alert('Xóa thành công!');
      setSelectedIds((prev) => prev.filter((x) => x !== id));
    } else {
      alert(`Xóa thất bại: ${result.error}`);
    }
  };

  // Xử lý xóa nhiều kích thước
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert('Vui lòng chọn ít nhất một mục để xóa!');
      return;
    }

    if (
      !window.confirm(`Bạn có chắc muốn xóa ${selectedIds.length} mục đã chọn?`)
    )
      return;

    // Xóa từng mục một
    for (const id of selectedIds) {
      await deleteSize(id);
    }

    alert('Xóa các kích thước thành công!');
    setSelectedIds([]);
  };

  // Toggle chọn một kích thước
  const toggleSelect = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  // Toggle chọn tất cả
  const toggleSelectAll = () =>
    setSelectedIds((prev) =>
      sizes.length > 0 && prev.length === sizes.length
        ? []
        : sizes.map((x) => x.id)
    );

  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;

  // Hàm hiển thị tên kích thước (kết hợp với 'inch')
  const formatSizeName = (value) => {
    return `${value} inch`;
  };

  return (
    <div className="page-card">
      {/* FORM THÊM/SỬA */}
      <div ref={formRef} className="container mt-4 mb-4">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-primary text-white d-flex align-items-center justify-content-between">
            <h5 className="mb-0">
              {editingId
                ? '✏️ Chỉnh sửa kích thước màn hình'
                : '➕ Thêm kích thước màn hình mới'}
            </h5>
            {editingId && (
              <button className="btn btn-light btn-sm" onClick={resetForm}>
                Hủy
              </button>
            )}
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-12">
                <label className="form-label fw-semibold">Giá trị (inch)</label>
                <input
                  type="number" // Đổi sang type number
                  step="0.1"
                  className="form-control"
                  placeholder="VD: 13.3, 15.6, 17.0..."
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="text-center mt-4">
              <button className="btn btn-primary px-4" onClick={handleSubmit}>
                {editingId ? '💾 Lưu thay đổi' : '➕ Thêm kích thước'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DANH SÁCH */}
      <div className="page-card__header">
        <h3 className="page-card__title">Danh sách kích thước màn hình</h3>
        {selectedIds.length > 0 && (
          <button className="btn btn-danger" onClick={handleDeleteSelected}>
            <Trash2 size={20} /> Xóa đã chọn ({selectedIds.length})
          </button>
        )}
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}>
                <input
                  type="checkbox"
                  checked={
                    sizes.length > 0 && selectedIds.length === sizes.length
                  }
                  onChange={toggleSelectAll}
                  style={{ cursor: 'pointer' }}
                />
              </th>
              <th>ID</th>
              <th>Kích thước</th>
              <th>Số sản phẩm</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((s) => (
              <tr key={s.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(s.id)}
                    onChange={() => toggleSelect(s.id)}
                    style={{ cursor: 'pointer' }}
                  />
                </td>
                <td className="font-medium">{s.id}</td>
                <td>{formatSizeName(s.value)}</td> {/* Hiển thị giá trị */}
                <td>{s.productCount}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn action-btn--edit"
                      onClick={() => handleEdit(s)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="action-btn action-btn--delete"
                      onClick={() => handleDelete(s.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sizes.length === 0 && (
          <p className="empty-message">Chưa có kích thước nào được thêm.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
