import React, { useState, useEffect } from "react";
import apiClient from "../../../api/axiosConfig";
import {
  LayoutDashboard,
  ShoppingCart,
  Star,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import ReviewManagement from "../../../components/admin/reviewPage";
import "../../admin/dashboardPage/style.scss";
import OrdersPage from "../../admin/orderPage";

const StaffDashboard = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "orders", name: "Đơn hàng", icon: ShoppingCart },
    { id: "reviews", name: "Đánh giá", icon: Star },
  ];

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/dang-nhap";
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardOverview setCurrentPage={setCurrentPage} />;
      case "orders":
        return <OrdersPage />;
      case "reviews":
        return <ReviewManagement />;
      default:
        return <DashboardOverview setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside
        className={`sidebar ${sidebarOpen ? "sidebar--open" : "sidebar--closed"}`}
      >
        <div className="sidebar__header">
          {sidebarOpen && (
            <h1 className="sidebar__title">Staff Panel</h1>
          )}
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
                onClick={() => setCurrentPage(item.id)}
                className={`sidebar__menu-item ${
                  currentPage === item.id ? "sidebar__menu-item--active" : ""
                }`}
              >
                <item.icon size={20} />
                {sidebarOpen && (
                  <span className="sidebar__menu-text">{item.name}</span>
                )}
              </button>
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
            {menuItems.find((m) => m.id === currentPage)?.name || "Dashboard"}
          </h2>
        </div>
        <div className="main-content__body">{renderPage()}</div>
      </main>
    </div>
  );
};

// ---- Dashboard Overview (thống kê chỉ về đơn hàng & đánh giá) ----
const DashboardOverview = ({ setCurrentPage }) => {
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getBadgeClass = (status) => {
    if (!status) return "secondary";
    const map = {
      COMPLETED: "success",
      SHIPPING: "info",
      PROCESSING: "primary",
      PENDING: "warning",
      CANCELLED: "danger",
    };
    return map[status.toUpperCase()] || "secondary";
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const ordersRes = await apiClient.get("/orders/admin?status=all");
      const allOrders = ordersRes.data || [];

      const pendingOrders = allOrders.filter((o) => o.status === "PENDING");
      const completedOrders = allOrders.filter((o) => o.status === "COMPLETED");

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
          label: "Đơn hoàn thành",
          value: completedOrders.length.toLocaleString("vi-VN"),
          icon: ShoppingCart,
          color: "orange",
        },
      ]);

      setRecentOrders(
        allOrders.slice(0, 5).map((order) => ({
          id: `#ORD${String(order.id).padStart(3, "0")}`,
          customer: order.customerName,
          product: order.items?.[0]?.productName || "Nhiều SP",
          total: (order.totalAmount || 0).toLocaleString("vi-VN") + "đ",
          status: order.status,
        }))
      );
    } catch (error) {
      console.error("Error fetching staff dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading" style={{ padding: "20px", textAlign: "center" }}>
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="stat-card"
            onClick={() =>
              stat.label.includes("đơn") ? setCurrentPage("orders") : null
            }
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

      {/* Bảng đơn hàng gần đây */}
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
                <tr key={index}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.product}</td>
                  <td>{order.total}</td>
                  <td>
                    <span className={`badge badge--${getBadgeClass(order.status)}`}>
                      {translateStatus(order.status)}
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    Chưa có đơn hàng nào.
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

export default StaffDashboard;
