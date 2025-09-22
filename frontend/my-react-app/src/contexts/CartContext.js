import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Tạo Context
const CartContext = createContext();

// 2. Custom hook để sử dụng Context dễ dàng hơn
export const useCart = () => {
    return useContext(CartContext);
};

// Hàm khởi tạo state từ localStorage
const getInitialCart = () => {
    try {
        const storedCart = localStorage.getItem('cart');
        return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng từ localStorage:", error);
        return [];
    }
};

// 3. Tạo Provider Component
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(getInitialCart);

    // Lưu giỏ hàng vào localStorage mỗi khi cartItems thay đổi
    useEffect(() => {
        try {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        } catch (error) {
            console.error("Lỗi khi lưu giỏ hàng vào localStorage:", error);
        }
    }, [cartItems]);

    /**
     * Thêm sản phẩm vào giỏ hàng.
     * Nếu sản phẩm đã tồn tại, tăng số lượng.
     * @param {object} product - Sản phẩm cần thêm.
     * @param {number} quantity - Số lượng cần thêm.
     */
    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);

            if (existingItem) {
                // Nếu sản phẩm đã có, cập nhật số lượng
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // Nếu sản phẩm chưa có, thêm mới vào giỏ hàng
                return [...prevItems, { ...product, quantity }];
            }
        });
    };

    /**
     * Xóa sản phẩm khỏi giỏ hàng.
     * @param {string} productId - ID của sản phẩm cần xóa.
     */
    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    /**
     * Cập nhật số lượng của một sản phẩm trong giỏ hàng.
     * @param {string} productId - ID của sản phẩm.
     * @param {number} quantity - Số lượng mới.
     */
    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            // Nếu số lượng là 0 hoặc âm, xóa sản phẩm
            removeFromCart(productId);
        } else {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === productId ? { ...item, quantity } : item
                )
            );
        }
    };

    /**
     * Xóa toàn bộ giỏ hàng.
     */
    const clearCart = () => {
        setCartItems([]);
    };

    // Tính toán tổng số lượng và tổng tiền
    const cartTotalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartTotalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    // 4. Giá trị cung cấp cho các component con
    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotalQuantity,
        cartTotalPrice,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};