import React, { useState, useEffect, useRef,useMemo } from 'react';
// import axios from 'axios'; // You can remove axios if you use apiClient
import apiClient from "../../../api/axiosConfig"; // 👈 FIXED IMPORT PATH
import ImportProductModal from '../../../components/page/ImportProductModal';
import ProductsPage from '../ProductsPage';
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
export default DashboardPage;