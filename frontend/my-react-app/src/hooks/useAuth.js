import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Custom hook để truy cập thông tin xác thực một cách tiện lợi.
 * @returns {object} - Trả về object chứa thông tin user, trạng thái đăng nhập, và các hàm login/logout.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};