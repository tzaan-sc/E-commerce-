import { useState, useEffect } from 'react';
import axios from 'axios';

const BRAND_API_BASE_URL = 'http://localhost:8080/api/brands';

const useBrands = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // LẤY DANH SÁCH THƯƠNG HIỆU (READ ALL)
    const fetchBrands = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(BRAND_API_BASE_URL);

            // Giả định: thêm mock productCount nếu cần
            const dataWithCount = response.data.map(brand => ({
                ...brand,
                productCount: brand.productCount || Math.floor(Math.random() * 60) + 10
            }));

            setBrands(dataWithCount);
        } catch (err) {
            console.error('Error fetching brands:', err);
            setError('Không thể tải danh sách thương hiệu.');
        } finally {
            setLoading(false);
        }
    };

    // THÊM THƯƠNG HIỆU (CREATE)
    const addBrand = async (newBrandData) => {
        try {
            const response = await axios.post(BRAND_API_BASE_URL, newBrandData);
            const newBrand = response.data;
            
            setBrands(prevBrands => [...prevBrands, { 
                ...newBrand, 
                productCount: 0 
            }]);
            return { success: true, brand: newBrand };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Lỗi không xác định khi thêm.';
            return { success: false, error: errorMessage };
        }
    };

    // XÓA THƯƠNG HIỆU (DELETE)
    const deleteBrand = async (brandId) => {
        try {
            await axios.delete(`${BRAND_API_BASE_URL}/${brandId}`);
            setBrands(prevBrands => prevBrands.filter(b => b.id !== brandId));
            return { success: true };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Lỗi không xác định khi xóa.';
            return { success: false, error: errorMessage };
        }
    };
    
    // CẬP NHẬT THƯƠNG HIỆU (UPDATE)
    const updateBrand = async (updatedBrandData) => {
        try {
            const response = await axios.put(BRAND_API_BASE_URL, updatedBrandData);
            const updatedBrand = response.data;
            
            setBrands(prevBrands => 
                prevBrands.map(b => (b.id === updatedBrand.id ? { ...b, name: updatedBrand.name, logoUrl: updatedBrand.logoUrl } : b))
            );
            return { success: true, brand: updatedBrand };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Lỗi không xác định khi cập nhật.';
            return { success: false, error: errorMessage };
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    return {
        brands,
        loading,
        error,
        fetchBrands,
        addBrand,
        deleteBrand,
        updateBrand
    };
};

export default useBrands;