import { toast } from 'react-toastify';
import React, { useState, useEffect } from "react";
import apiClient from "api/axiosConfig";
import { formatter } from "utils/formatter";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Clock, Gift, ShoppingCart } from "lucide-react"; 
import { addToCart } from "api/cart"; 
import { useCart } from "context/index"; 
import { ROUTERS } from "utils/router";

import "./style.scss";

const UserPromotionPage = () => {
    const [promotions, setPromotions] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const navigate = useNavigate();
    const location = useLocation();
    const { fetchCartCount } = useCart();

    // ✅ Cấu hình URL cơ sở cho ảnh
    const BASE_URL = "http://localhost:8080";
    // ✅ Sử dụng link URL trực tiếp cho Banner để tránh lỗi Webpack
    const PromoBannerUrl = `${BASE_URL}/api/uploads/products/5fa03d0f-ebc3-48f9-a1a7-b8ada83f4a01.png`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // 1. Lấy danh sách khuyến mãi đang ACTIVE
                const promoRes = await apiClient.get("/promotions");
                const activePromos = promoRes.data.filter(p => p.status === "ACTIVE");
                setPromotions(activePromos);

                // 2. Lấy danh sách sản phẩm (chỉ lấy máy có khuyến mãi ACTIVE)
                const prodRes = await apiClient.get("/products");
                const discountedProds = prodRes.data.filter(
                    p => p.promotion !== null && p.promotion.status === "ACTIVE"
                );
                setProducts(discountedProds);
            } catch (err) {
                console.error("Lỗi tải trang khuyến mãi:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [fetchCartCount]);

    // --- LOGIC THÊM VÀO GIỎ HÀNG ---
    const handleAddToCart = async (product) => {
        const user = localStorage.getItem("user"); // Kiểm tra user thay vì chỉ token cho đồng bộ
        
        if (!user) { 
            if (window.confirm("Vui lòng đăng nhập để mua hàng. Bạn có muốn đăng nhập ngay không?")) {
                navigate(ROUTERS.USER.LOGIN);
            }
            return; 
        }

        try { 
            // Nếu sản phẩm có variants, nên ưu tiên lấy variant đầu tiên hoặc dẫn về trang detail
            // Ở trang khuyến mãi, ta mặc định thêm product.id gốc hoặc variant đầu tiên nếu có
            const variantId = product.variants?.length > 0 ? product.variants[0].id : null;
            await addToCart(product.id, 1, variantId); 
            fetchCartCount(); 
            toast.success("Đã thêm vào giỏ hàng thành công!"); 
        } catch (err) { 
            console.error(err);
            toast.error("Thêm vào giỏ hàng thất bại!");
        }
    };

    // --- HÀM XỬ LÝ URL ẢNH TỪ API ---
    const getProductImageUrl = (url) => {
        if (!url) return "https://via.placeholder.com/300x300?text=No+Image";
        return url.startsWith("http") ? url : `${BASE_URL}${url}`;
    };

    // --- HÀM XÁC ĐỊNH LINK CHI TIẾT SẢN PHẨM ---
    const getProductLink = (id) => {
        const isCustomerPage = location.pathname.includes("/customer");
        return isCustomerPage 
            ? ROUTERS.CUSTOMER.PRODUCTDETAIL.replace(":id", id) 
            : ROUTERS.USER.PRODUCTDETAIL.replace(":id", id);
    };

    // --- HÀM TÍNH GIÁ SAU GIẢM ---
    const calculateDiscount = (price, promo) => {
        if (promo.discountType === "PERCENTAGE") return price - (price * promo.discountValue) / 100;
        return Math.max(0, price - promo.discountValue);
    };

    if (loading) return <div className="loading-state">Đang săn deal cho bạn...</div>;

    return (
        <div className="promotion-hub">
            <div className="container">
                
                {/* --- BANNER SECTION --- */}
                <div className="promo-hero-image" style={{ width: '100%', marginBottom: '40px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                    <img 
                        src={PromoBannerUrl} 
                        alt="Siêu hội khuyến mãi INFINITY" 
                        style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = "https://placehold.co/1200x400?text=INFINITY+PROMOTION+DEAL"; }}
                    />
                </div>

                {/* --- DANH SÁCH CHƯƠNG TRÌNH KHUYẾN MÃI --- */}
                <div className="section-header">
                    <h2 className="section-title">Chương trình đang diễn ra</h2>
                </div>
                <div className="promo-grid">
                    {promotions.map(promo => (
                        <div key={promo.id} className="promo-card">
                            <div className="promo-card__icon">
                                <Gift size={24} />
                            </div>
                            <div className="promo-card__info">
                                <h3>{promo.name}</h3>
                                <p>{promo.description}</p>
                                <div className="promo-value">
                                    Giảm ngay: <span>{promo.discountType === "PERCENTAGE" ? `${promo.discountValue}%` : formatter(promo.discountValue)}</span>
                                </div>
                            </div>
                            <div className="promo-card__footer">
                                <span><Clock size={14} /> Hết hạn: {new Date(promo.endDate).toLocaleDateString('vi-VN')}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- SẢN PHẨM ĐANG GIẢM GIÁ --- */}
                <div className="discounted-section" style={{ marginTop: '60px' }}>
                    <h2 className="section-title">Sản phẩm đang giảm sốc</h2>
                    <div className="product-grid">
                        {products.map(item => (
                            <div key={item.id} className="product-card">
                                <div className="badge">
                                    -{item.promotion.discountValue}{item.promotion.discountType === "PERCENTAGE" ? "%" : "₫"}
                                </div>
                                
                                <Link to={getProductLink(item.id)} className="product-card__image">
                                    <img 
                                        src={getProductImageUrl(item.imageUrl)} 
                                        alt={item.name} 
                                        onError={(e) => {
                                            e.target.onerror = null; 
                                            e.target.src = "https://via.placeholder.com/300x300?text=Laptop+INFINITY";
                                        }}
                                    />
                                </Link>

                                <div className="product-card__content">
                                    <h3 className="product-name">
                                        <Link to={getProductLink(item.id)}>{item.name}</Link>
                                    </h3>

                                    <div className="price-box">
                                        <span className="new-price">{formatter(calculateDiscount(item.price, item.promotion))}</span>
                                        <span className="old-price">{formatter(item.price)}</span>
                                    </div>

                                    <button 
                                        className="btn-buy" 
                                        onClick={() => handleAddToCart(item)}
                                    >
                                        <ShoppingCart size={16} style={{marginRight: '8px'}} />
                                        Thêm vào giỏ hàng
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserPromotionPage;