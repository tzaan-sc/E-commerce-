// hooks/useGenericApi.js

import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/';

const useGenericApi = (resourceName) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const endpoint = `${API_BASE_URL}${resourceName}`;

    // --- Helper để lấy tin nhắn lỗi chuẩn xác từ Backend ---
    const getErrorMessage = (err) => {
        if (err.response && err.response.data) {
            // Trường hợp 1: Backend trả về JSON chuẩn Spring (có field 'message')
            if (err.response.data.message) {
                return err.response.data.message;
            }
            // Trường hợp 2: Backend trả về String thô (ví dụ: ResponseEntity.badRequest().body("Lỗi rồi"))
            if (typeof err.response.data === 'string') {
                return err.response.data;
            }
        }
        // Trường hợp 3: Lỗi mạng hoặc lỗi không xác định
        return err.message || 'Có lỗi xảy ra, vui lòng thử lại.';
    };

    // ---------------------- READ ALL ----------------------
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(endpoint);
            
            // Mock productCount (Bạn nhớ cập nhật Backend sau này để trả về số thật nhé)
            const processedData = response.data.map(item => ({
                ...item,
                productCount: item.productCount || 0 
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
            // Khi thêm mới, mặc định số lượng liên quan là 0
            setData(prevData => [...prevData, { ...newItem, productCount: 0 }]);
            return { success: true, item: newItem };
        } catch (err) {
            return { success: false, error: getErrorMessage(err) };
        }
    };

    // ---------------------- UPDATE ----------------------
    const updateItem = async (itemData) => {
        try {
            const itemId = itemData.id; 
            const urlWithId = `${endpoint}/${itemId}`; 
            
            const response = await axios.put(urlWithId, itemData); 
            const updatedItem = response.data;
            
            // Cập nhật lại item trong danh sách mà không cần load lại trang
            setData(prevData => 
                prevData.map(item => (item.id === updatedItem.id ? { ...item, ...updatedItem } : item))
            );
            return { success: true, item: updatedItem };
        } catch (err) {
            return { success: false, error: getErrorMessage(err) };
        }
    };

    // ---------------------- DELETE ----------------------
    const deleteItem = async (itemId) => {
        try {
            await axios.delete(`${endpoint}/${itemId}`);
            
            // Xóa thành công thì loại bỏ khỏi state ngay lập tức
            setData(prevData => prevData.filter(item => item.id !== itemId));
            return { success: true };
        } catch (err) {
            // 👇 Quan trọng: Trả về error text để Frontend hiển thị alert
            return { success: false, error: getErrorMessage(err) };
        }
    };

    useEffect(() => {
        fetchData();
    }, [resourceName]);

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