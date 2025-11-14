// hooks/useGenericApi.js

import { useState, useEffect } from 'react';
import axios from 'axios';

// Base URL cho tất cả các API (ví dụ: http://localhost:8080/api/brands)
const API_BASE_URL = 'http://localhost:8080/api/';

const useGenericApi = (resourceName) => { // resourceName là 'brands', 'categories', 'screensize'...
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const endpoint = `${API_BASE_URL}${resourceName}`;

    // ---------------------- READ ALL ----------------------
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(endpoint);
            
            // Tạm thời mock relatedCount (ví dụ: productCount) nếu backend chưa cung cấp
            const processedData = response.data.map(item => ({
                ...item,
                // Giả định trường này là 'productCount' cho Brand, 'relatedCount' cho cái khác
                productCount: item.productCount || Math.floor(Math.random() * 60) + 10 
            }));
            
            setData(processedData);
        } catch (err) {
            console.error(`Error fetching ${resourceName}:`, err);
            setError(`Không thể tải danh sách ${resourceName}.`);
        } finally {
            setLoading(false);
        }
    };

    // ---------------------- CREATE ----------------------
    const addItem = async (itemData) => {
        try {
            const response = await axios.post(endpoint, itemData);
            const newItem = response.data;
            // Thêm item mới vào state (với productCount mặc định)
            setData(prevData => [...prevData, { ...newItem, productCount: 0 }]);
            return { success: true, item: newItem };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Lỗi không xác định khi thêm.';
            return { success: false, error: errorMessage };
        }
    };

    // // ---------------------- UPDATE ----------------------
    // const updateItem = async (itemData) => {
    //     try {
    //         const response = await axios.put(endpoint, itemData);
    //         const updatedItem = response.data;
            
    //         // Cập nhật item trong state
    //         setData(prevData => 
    //             prevData.map(item => (item.id === updatedItem.id ? { ...item, ...updatedItem } : item))
    //         );
    //         return { success: true, item: updatedItem };
    //     } catch (err) {
    //         const errorMessage = err.response?.data?.message || 'Lỗi không xác định khi cập nhật.';
    //         return { success: false, error: errorMessage };
    //     }
    // };

    // Thay thế hàm UPDATE trong hooks/useGenericApi.js
// ---------------------- UPDATE ----------------------
const updateItem = async (itemData) => {
    try {
        // Lấy ID. Chúng ta giả định itemData luôn chứa ID.
        const itemId = itemData.id; 
        
        // 💡 Quyết định URL: Dùng ID trong URL cho các Controller /resource/{id}
        // URL sẽ là: /api/brands/1, /api/usage-purposes/2, ...
        const urlWithId = `${endpoint}/${itemId}`; 
        
        // Backend UsagePurposeController/BrandController vẫn cần ID trong body để validation, nên gửi toàn bộ itemData
        const response = await axios.put(urlWithId, itemData); 
        const updatedItem = response.data;
        
        // Cập nhật item trong state
        setData(prevData => 
            prevData.map(item => (item.id === updatedItem.id ? { ...item, ...updatedItem } : item))
        );
        return { success: true, item: updatedItem };
    } catch (err) {
        // Cải thiện việc báo lỗi từ backend
        const errorMessage = err.response?.data?.message || 'Lỗi không xác định khi cập nhật.';
        return { success: false, error: errorMessage };
    }
};
// ----------------------------------------------------

    // ---------------------- DELETE ----------------------
    const deleteItem = async (itemId) => {
        try {
            await axios.delete(`${endpoint}/${itemId}`);
            // Xóa item khỏi state
            setData(prevData => prevData.filter(item => item.id !== itemId));
            return { success: true };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Lỗi không xác định khi xóa.';
            return { success: false, error: errorMessage };
        }
    };

    // Tự động gọi API khi hook được mount
    useEffect(() => {
        fetchData();
    }, [resourceName]); // Chạy lại khi tên resource thay đổi

    return { 
        data, 
        loading, 
        error, 
        fetchData, 
        addItem, 
        updateItem, 
        deleteItem 
    };
};

export default useGenericApi;