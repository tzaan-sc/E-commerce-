import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Custom hook

const AdminRoute = () => {
    const { user } = useAuth(); // Lấy thông tin user từ context

    // Nếu user tồn tại và có vai trò là 'admin' thì cho phép truy cập
    if (user && user.role === 'admin') {
        return <Outlet />; // Render component con (trang admin)
    }

    // Nếu không, chuyển hướng về trang đăng nhập hoặc trang không có quyền
    return <Navigate to="/login" />;
};

export default AdminRoute;