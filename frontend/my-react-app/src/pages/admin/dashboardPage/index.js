import React, { useState, useEffect } from "react";
import apiClient from "../../../api/axiosConfig";
import { Save, Upload } from "lucide-react";
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
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  User,
  Mail,
  Shield,
  Activity,
  Package, // 👇 ADDED: Icon for Inventory
} from "lucide-react";
import useGenericApi from "hooks/useGenericApi";
import "./style.scss";
import ProductsPage from "../productPage";
import OrdersPage from "../orderPage";
import AccountsPage from "../accountPage";
import BrandsPage from "../brandPage";
import UsagePurposePage from "../usagepurposePage";
import ScreenSizePage from "../screensizePage";
import PromotionPage from "../promotionPage";
// import InventoryPage from "../inventory/InventoryPage"; // 👇 ADDED: Import InventoryPage

// Router simulation
const AdminDashboard = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "products", name: "Sản phẩm", icon: Laptop },
    // { id: "inventory", name: "Kho hàng", icon: Package }, // 👇 ADDED: Inventory Menu Item
    
    { id: "promotions", name: "Khuyến mãi", icon: Tag },
    { id: "orders", name: "Đơn hàng", icon: ShoppingCart },
    { id: "accounts", name: "Tài khoản", icon: Users },
    {
      id: "categories",
      name: "Danh mục",
      icon: Tag,
      submenu: [
        { id: "brands", name: "Thương hiệu", icon: Tag },
        { id: "usage", name: "Nhu cầu sử dụng", icon: Target },
        { id: "screensize", name: "Kích thước màn hình", icon: Monitor },
      ],
    },
  ];

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
      // Xóa token khỏi localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect về trang đăng nhập
      window.location.href = "/dang-nhap";
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage setCurrentPage={setCurrentPage} />;
      case "products":
        return <ProductsPage />;
      // case "inventory": // 👇 ADDED: Render InventoryPage
      //   return <InventoryPage />;
      case "promotions":
        return <PromotionPage />;
      case "orders":
        return <OrdersPage />;
      case "accounts":
        return <AccountsPage />;
      case "brands":
        return <BrandsPage />;
      case "usage":
        return <UsagePurposePage />;
      case "screensize":
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
          sidebarOpen ? "sidebar--open" : "sidebar--closed"
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
                  currentPage === item.id ? "sidebar__menu-item--active" : ""
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
                          ? "sidebar__submenu-item--active"
                          : ""
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

const DashboardPage = ({ setCurrentPage }) => {
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const getTargetPage = (label) => {
    if (label.includes("Tài khoản")) return "accounts"; // Chuyển sang trang accounts
    if (label.includes("Đơn hàng") || label.includes("Doanh thu"))
      return "orders"; // Chuyển sang trang orders
    return "dashboard";
  };
  // --- HELPER FUNCTIONS (Cần thống nhất giữa các component) ---
  const translateStatus = (status) => {
    if (!status) return "Không rõ";
    const map = {
      PENDING: "Chờ xác nhận",
      PROCESSING: "Đang xử lý",
      SHIPPING: "Đang giao",
      COMPLETED: "Đã giao",
      CANCELLED: "Đã hủy",
    };
    return map[status.toUpperCase()] || status;
  };

  // Hàm này trả về TÊN MÀU (blue, green, purple, orange) để khớp với SCSS stat-card__icon--<color>
  const getStatColorForStatus = (status) => {
    if (!status) return "secondary";
    const statusUpper = status.toUpperCase();
    const statusMap = {
      COMPLETED: "orange", // Đơn hoàn tất (Dùng màu cam cho STATS)
      PENDING: "green", // Đơn mới (Dùng màu xanh lá cho STATS)
    };
    return statusMap[statusUpper] || "blue";
  };

  // Hàm này trả về tên class badge--<color> để khớp với bảng
  const getBadgeClass = (status) => {
    if (!status) return "secondary";
    const statusUpper = status.toUpperCase();
    const statusMap = {
      COMPLETED: "success",
      SHIPPING: "info",
      PROCESSING: "primary",
      PENDING: "warning",
      CANCELLED: "danger",
    };
    return statusMap[statusUpper] || "secondary";
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const ordersRes = await apiClient.get("/orders/admin?status=all");
      const usersCountRes = await apiClient.get("/users/count");

      const allOrders = ordersRes.data || [];
      const totalUsers = usersCountRes.data;

      // Lọc dữ liệu
      const pendingOrders = allOrders.filter((o) => o.status === "PENDING");
      const completedOrders = allOrders.filter((o) => o.status === "COMPLETED");
      const totalRevenue = completedOrders.reduce(
        (sum, o) => sum + (o.totalAmount || 0),
        0
      );
      const revenueDisplay =
        (totalRevenue / 1000000).toLocaleString("vi-VN", {
          maximumFractionDigits: 1,
        }) + " Tr";

      // Cập nhật stats
      setStats([
        {
          label: "Tổng đơn hàng",
          value: allOrders.length.toLocaleString("vi-VN"),
          icon: ShoppingCart,
          color: "blue",
        },
        {
          label: "Đơn hàng mới",
          value: pendingOrders.length.toLocaleString("vi-VN"),
          icon: ShoppingCart,
          color: "green",
        },
        {
          label: "Tài khoản",
          value: totalUsers.toLocaleString("vi-VN"),
          icon: Users,
          color: "purple",
        },
        {
          label: "Doanh thu",
          value: revenueDisplay,
          icon: Tag,
          color: "orange",
        },
      ]);

      // Cập nhật đơn hàng gần đây
      const recentData = allOrders.slice(0, 5).map((order) => ({
        id: `#ORD${String(order.id).padStart(3, "0")}`,
        customer: order.customerName,
        product: order.items[0]?.productName || "Nhiều SP",
        total: (order.totalAmount || 0).toLocaleString("vi-VN") + "đ",
        status: order.status,
      }));

      setRecentOrders(recentData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setStats([
        { label: "Dữ liệu", value: "Lỗi API", icon: Tag, color: "danger" },
      ]);
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
            style={{ cursor: "pointer" }}
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
                    <span
                      className={`badge badge--${getBadgeClass(order.status)}`}
                    >
                      {translateStatus(order.status)}
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    Chưa có đơn hàng nào được đặt.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const API_BASE = "http://localhost:8080/api/users";
export default AdminDashboard;