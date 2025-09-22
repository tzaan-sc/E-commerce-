import { useState, useEffect } from 'react';

/**
 * Custom hook để trì hoãn việc cập nhật một giá trị.
 * @param {any} value - Giá trị cần debounce.
 * @param {number} delay - Thời gian trì hoãn (ms).
 * @returns {any} - Trả về giá trị đã được debounce.
 */
function useDebounce(value, delay) {
    // State để lưu trữ giá trị đã debounce
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Thiết lập một timeout để cập nhật giá trị debounce
        // sau khoảng thời gian delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup function: Hủy timeout nếu value hoặc delay thay đổi
        // Điều này ngăn việc cập nhật giá trị debounce nếu user tiếp tục gõ
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Chỉ chạy lại effect nếu value hoặc delay thay đổi

    return debouncedValue;
}

export default useDebounce;