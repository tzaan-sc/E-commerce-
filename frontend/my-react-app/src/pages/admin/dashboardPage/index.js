import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
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
  Search
} from 'lucide-react';
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
        { id: 'screensize', name: 'Kích thước màn hình', icon: Monitor }
      ]
    },
  ];

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <DashboardPage />;
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
      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : 'sidebar--closed'}`}>
        <div className="sidebar__header">
          {sidebarOpen && <h1 className="sidebar__title">Admin Panel</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="sidebar__toggle">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar__nav">
          {menuItems.map((item) => (
            <div key={item.id} className="sidebar__menu-group">
              <button
                onClick={() => !item.submenu && setCurrentPage(item.id)}
                className={`sidebar__menu-item ${currentPage === item.id ? 'sidebar__menu-item--active' : ''}`}
              >
                <item.icon size={20} />
                {sidebarOpen && <span className="sidebar__menu-text">{item.name}</span>}
              </button>
              
              {item.submenu && sidebarOpen && (
                <div className="sidebar__submenu">
                  {item.submenu.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => setCurrentPage(subItem.id)}
                      className={`sidebar__submenu-item ${currentPage === subItem.id ? 'sidebar__submenu-item--active' : ''}`}
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
          <button className="sidebar__logout">
            <LogOut size={20} />
            {sidebarOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="main-content__header">
          <h2 className="main-content__title">
            {menuItems.find(m => m.id === currentPage)?.name || 
             menuItems.flatMap(m => m.submenu || []).find(s => s.id === currentPage)?.name}
          </h2>
        </div>
        <div className="main-content__body">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

// Dashboard Page
const DashboardPage = () => {
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // TODO: Gọi API lấy dữ liệu thống kê
      // const response = await fetch('/api/dashboard/stats');
      // const data = await response.json();
      
      // Mock data
      setStats([
        { label: 'Tổng sản phẩm', value: '248', icon: Laptop, color: 'blue' },
        { label: 'Đơn hàng mới', value: '52', icon: ShoppingCart, color: 'green' },
        { label: 'Tài khoản', value: '1,234', icon: Users, color: 'purple' },
        { label: 'Doanh thu', value: '524M', icon: Tag, color: 'orange' },
      ]);

      // TODO: Gọi API lấy đơn hàng gần đây
      // const ordersResponse = await fetch('/api/orders/recent');
      // const ordersData = await ordersResponse.json();
      
      setRecentOrders([
        { id: '#ORD001', customer: 'Nguyễn Văn A', product: 'Dell XPS 15', total: '35,000,000đ', status: 'Đã giao' },
        { id: '#ORD002', customer: 'Trần Thị B', product: 'HP Pavilion 14', total: '18,500,000đ', status: 'Đang xử lý' },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="dashboard">
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
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
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.product}</td>
                  <td>{order.total}</td>
                  <td>
                    <span className={`badge ${order.status === 'Đã giao' ? 'badge--success' : 'badge--warning'}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Products Page
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // TODO: Gọi API lấy danh sách sản phẩm
      // const response = await fetch('/api/products');
      // const data = await response.json();
      // setProducts(data);
      
      // Mock data
      setProducts([
        { id: 1, name: 'Dell XPS 15', brand: 'Dell', price: '35,000,000đ', stock: 15, status: 'Còn hàng' },
        { id: 2, name: 'HP Pavilion 14', brand: 'HP', price: '18,500,000đ', stock: 8, status: 'Còn hàng' },
        { id: 3, name: 'Asus ROG Strix G15', brand: 'Asus', price: '42,000,000đ', stock: 3, status: 'Sắp hết' },
        { id: 4, name: 'Lenovo ThinkPad X1', brand: 'Lenovo', price: '38,500,000đ', stock: 12, status: 'Còn hàng' },
      ]);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    // TODO: Mở modal hoặc chuyển trang thêm sản phẩm
    console.log('Add product');
  };

  const handleEditProduct = (productId) => {
    // TODO: Mở modal hoặc chuyển trang sửa sản phẩm
    console.log('Edit product:', productId);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        // TODO: Gọi API xóa sản phẩm
        // await fetch(`/api/products/${productId}`, { method: 'DELETE' });
        
        setProducts(products.filter(p => p.id !== productId));
        alert('Xóa sản phẩm thành công!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Xóa sản phẩm thất bại!');
      }
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

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
        <button className="btn btn--primary" onClick={handleAddProduct}>
          <Plus size={20} />
          Thêm sản phẩm
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên sản phẩm</th>
              <th>Thương hiệu</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td className="font-medium">{product.name}</td>
                <td>{product.brand}</td>
                <td>{product.price}</td>
                <td>{product.stock}</td>
                <td>
                  <span className={`badge ${product.status === 'Còn hàng' ? 'badge--success' : 'badge--danger'}`}>
                    {product.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn action-btn--edit" onClick={() => handleEditProduct(product.id)}>
                      <Edit size={18} />
                    </button>
                    <button className="action-btn action-btn--delete" onClick={() => handleDeleteProduct(product.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // ✅ Thêm error state

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null); // Reset error

      const url =
        statusFilter === "all"
          ? "http://localhost:8080/api/orders"
          : `http://localhost:8080/api/orders?status=${statusFilter}`;

      const res = await axios.get(url);
      
      // ✅ Kiểm tra response data
      console.log("API Response:", res.data); // Debug
      
      // ✅ Đảm bảo data là array
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else {
        console.error("API không trả về array:", res.data);
        setOrders([]); // Set empty array nếu không phải array
        setError("Dữ liệu không hợp lệ");
      }
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
      setError(error.message || "Không thể tải đơn hàng");
      setOrders([]); // ✅ Đảm bảo orders luôn là array
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrderDetail = (orderId) => {
    console.log("Xem chi tiết đơn:", orderId);
  };

  const getStatusClass = (status) => {
    const statusMap = {
      "Đã giao": "success",
      "Đang giao": "info",
      "Đang xử lý": "warning",
      "Chờ xác nhận": "secondary",
      "completed": "success",
      "shipping": "info",
      "processing": "warning",
      "pending": "secondary",
    };
    return `badge--${statusMap[status] || "secondary"}`;
  };

  // ✅ Hiển thị error nếu có
  if (error) {
    return (
      <div className="page-card">
        <div className="error-message" style={{ color: 'red', padding: '20px' }}>
          Lỗi: {error}
        </div>
        <button onClick={fetchOrders} className="btn btn--primary">
          Thử lại
        </button>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="page-card">
      <div className="page-card__header">
        <h3 className="page-card__title">Danh sách đơn hàng</h3>
        <select
          className="select-input"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ xác nhận</option>
          <option value="processing">Đang xử lý</option>
          <option value="shipping">Đang giao</option>
          <option value="completed">Đã giao</option>
        </select>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="font-medium">#{order.orderCode}</td>
                <td>{order.customerName}</td>
                <td>{order.totalAmount?.toLocaleString('vi-VN')}đ</td>
                <td>
                  <span className={`badge ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <button
                    className="link-btn"
                    onClick={() => handleViewOrderDetail(order.id)}
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && !loading && (
          <div className="no-data">Không có đơn hàng nào.</div>
        )}
      </div>
    </div>
  );
};


// Accounts Page
const AccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      // TODO: Gọi API lấy danh sách tài khoản
      // const response = await fetch('/api/accounts');
      // const data = await response.json();
      // setAccounts(data);
      
      // Mock data
      setAccounts([
        { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', role: 'Khách hàng', status: 'Hoạt động' },
        { id: 2, name: 'Trần Thị B', email: 'tranthib@email.com', role: 'Khách hàng', status: 'Hoạt động' },
        { id: 3, name: 'Admin User', email: 'admin@email.com', role: 'Admin', status: 'Hoạt động' },
      ]);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = () => {
    // TODO: Mở modal thêm tài khoản
    console.log('Add account');
  };

  const handleEditAccount = (accountId) => {
    // TODO: Mở modal sửa tài khoản
    console.log('Edit account:', accountId);
  };

  const handleDeleteAccount = async (accountId) => {
    if (window.confirm('Bạn có chắc muốn xóa tài khoản này?')) {
      try {
        // TODO: Gọi API xóa tài khoản
        // await fetch(`/api/accounts/${accountId}`, { method: 'DELETE' });
        
        setAccounts(accounts.filter(a => a.id !== accountId));
        alert('Xóa tài khoản thành công!');
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Xóa tài khoản thất bại!');
      }
    }
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="page-card">
      <div className="page-card__header">
        <h3 className="page-card__title">Quản lý tài khoản</h3>
        <button className="btn btn--primary" onClick={handleAddAccount}>
          <Plus size={20} />
          Thêm tài khoản
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <td>{account.id}</td>
                <td className="font-medium">{account.name}</td>
                <td>{account.email}</td>
                <td>
                  <span className={`badge ${account.role === 'Admin' ? 'badge--purple' : 'badge--info'}`}>
                    {account.role}
                  </span>
                </td>
                <td>
                  <span className="badge badge--success">{account.status}</span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn action-btn--edit" onClick={() => handleEditAccount(account.id)}>
                      <Edit size={18} />
                    </button>
                    <button className="action-btn action-btn--delete" onClick={() => handleDeleteAccount(account.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Brands Page
const BrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      // TODO: Gọi API lấy danh sách thương hiệu
      // const response = await fetch('/api/brands');
      // const data = await response.json();
      // setBrands(data);
      
      // Mock data
      setBrands([
        { id: 1, name: 'Dell', productCount: 45 },
        { id: 2, name: 'HP', productCount: 38 },
        { id: 3, name: 'Asus', productCount: 52 },
        { id: 4, name: 'Lenovo', productCount: 41 },
      ]);
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBrand = () => {
    // TODO: Mở modal thêm thương hiệu
    console.log('Add brand');
  };

  const handleEditBrand = (brandId) => {
    // TODO: Mở modal sửa thương hiệu
    console.log('Edit brand:', brandId);
  };

  const handleDeleteBrand = async (brandId) => {
    if (window.confirm('Bạn có chắc muốn xóa thương hiệu này?')) {
      try {
        // TODO: Gọi API xóa thương hiệu
        // await fetch(`/api/brands/${brandId}`, { method: 'DELETE' });
        
        setBrands(brands.filter(b => b.id !== brandId));
        alert('Xóa thương hiệu thành công!');
      } catch (error) {
        console.error('Error deleting brand:', error);
        alert('Xóa thương hiệu thất bại!');
      }
    }
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="page-card">
      <div className="page-card__header">
        <h3 className="page-card__title">Quản lý thương hiệu</h3>
        <button className="btn btn--primary" onClick={handleAddBrand}>
          <Plus size={20} />
          Thêm thương hiệu
        </button>
      </div>

      <div className="category-grid">
        {brands.map((brand) => (
          <div key={brand.id} className="category-card">
            <div className="category-card__header">
              <h4 className="category-card__title">{brand.name}</h4>
              <div className="action-buttons">
                <button className="action-btn action-btn--edit action-btn--sm" onClick={() => handleEditBrand(brand.id)}>
                  <Edit size={16} />
                </button>
                <button className="action-btn action-btn--delete action-btn--sm" onClick={() => handleDeleteBrand(brand.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="category-card__count">{brand.productCount} sản phẩm</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Usage Purpose Page
const UsagePurposePage = () => {
  const [purposes, setPurposes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsagePurposes();
  }, []);

  const fetchUsagePurposes = async () => {
    try {
      setLoading(true);
      // TODO: Gọi API lấy danh sách nhu cầu sử dụng
      // const response = await fetch('/api/usage-purposes');
      // const data = await response.json();
      // setPurposes(data);
      
      // Mock data
      setPurposes([
        { id: 1, name: 'Gaming', productCount: 35 },
        { id: 2, name: 'Văn phòng', productCount: 68 },
        { id: 3, name: 'Thiết kế - Kĩ thuật', productCount: 42 },
        { id: 4, name: 'Học tập', productCount: 56 },
      ]);
    } catch (error) {
      console.error('Error fetching usage purposes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPurpose = () => {
    console.log('Add purpose');
  };

  const handleEditPurpose = (purposeId) => {
    console.log('Edit purpose:', purposeId);
  };

  const handleDeletePurpose = async (purposeId) => {
    if (window.confirm('Bạn có chắc muốn xóa nhu cầu này?')) {
      try {
        setPurposes(purposes.filter(p => p.id !== purposeId));
        alert('Xóa nhu cầu sử dụng thành công!');
      } catch (error) {
        console.error('Error deleting purpose:', error);
        alert('Xóa nhu cầu sử dụng thất bại!');
      }
    }
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="page-card">
      <div className="page-card__header">
        <h3 className="page-card__title">Quản lý nhu cầu sử dụng</h3>
        <button className="btn btn--primary" onClick={handleAddPurpose}>
          <Plus size={20} />
          Thêm nhu cầu
        </button>
      </div>

      <div className="category-grid">
        {purposes.map((purpose) => (
          <div key={purpose.id} className="category-card">
            <div className="category-card__header">
              <h4 className="category-card__title">{purpose.name}</h4>
              <div className="action-buttons">
                <button className="action-btn action-btn--edit action-btn--sm" onClick={() => handleEditPurpose(purpose.id)}>
                  <Edit size={16} />
                </button>
                <button className="action-btn action-btn--delete action-btn--sm" onClick={() => handleDeletePurpose(purpose.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="category-card__count">{purpose.productCount} sản phẩm</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Screen Size Page
const ScreenSizePage = () => {
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScreenSizes();
  }, []);

  const fetchScreenSizes = async () => {
    try {
      setLoading(true);
      // TODO: Gọi API lấy danh sách kích thước màn hình
      // const response = await fetch('/api/screen-sizes');
      // const data = await response.json();
      // setSizes(data);
      
      // Mock data
      setSizes([
        { id: 1, name: '13-14 inch', productCount: 52 },
        { id: 2, name: '15-16 inch', productCount: 89 },
        { id: 3, name: '17 inch trở lên', productCount: 35 },
      ]);
    } catch (error) {
      console.error('Error fetching screen sizes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSize = () => {
    console.log('Add size');
  };

  const handleEditSize = (sizeId) => {
    console.log('Edit size:', sizeId);
  };

  const handleDeleteSize = async (sizeId) => {
    if (window.confirm('Bạn có chắc muốn xóa kích thước này?')) {
      try {
        setSizes(sizes.filter(s => s.id !== sizeId));
        alert('Xóa kích thước thành công!');
      } catch (error) {
        console.error('Error deleting size:', error);
        alert('Xóa kích thước thất bại!');
      }
    }
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="page-card">
      <div className="page-card__header">
        <h3 className="page-card__title">Quản lý kích thước màn hình</h3>
        <button className="btn btn--primary" onClick={handleAddSize}>
          <Plus size={20} />
          Thêm kích thước
        </button>
      </div>

      <div className="category-grid category-grid--3col">
        {sizes.map((size) => (
          <div key={size.id} className="category-card">
            <div className="category-card__header">
              <h4 className="category-card__title">{size.name}</h4>
              <div className="action-buttons">
                <button className="action-btn action-btn--edit action-btn--sm" onClick={() => handleEditSize(size.id)}>
                  <Edit size={16} />
                </button>
                <button className="action-btn action-btn--delete action-btn--sm" onClick={() => handleDeleteSize(size.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="category-card__count">{size.productCount} sản phẩm</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;