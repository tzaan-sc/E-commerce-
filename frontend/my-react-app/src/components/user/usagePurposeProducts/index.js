import { memo, useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom"; // 1. Thêm useSearchParams
import { AiOutlineShoppingCart, AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import apiClient from "api/axiosConfig"; 
import { addToCart } from "api/cart";    
import { useCart } from "context/index"; 
import { formatter } from "utils/formatter"; 
import { ROUTERS } from "utils/router";
import Brand from "components/user/brand"; 
import "./style.scss"; 

const UsagePurposeProductsPage = () => {
  const { id } = useParams(); // ID Nhu cầu (VD: 4)
  
  // 2. Khai báo hook để đọc/ghi URL Query Params (?brand=...)
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Lấy ID Brand từ URL (nếu có). VD: ...?brand=2 => brandIdFromUrl = "2"
  const brandIdFromUrl = searchParams.get("brand");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purposeName, setPurposeName] = useState("");
  const { fetchCartCount } = useCart(); 

  const ITEMS_PER_BATCH = 8; 
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);

  // 3. XỬ LÝ KHI BẤM VÀO LOGO BRAND
  const handleBrandClick = (clickedBrandId) => {
    // Logic: Nếu đang chọn brand đó rồi thì bỏ chọn (xóa khỏi URL), ngược lại thì thêm vào URL
    if (Number(brandIdFromUrl) === clickedBrandId) {
        // Xóa tham số brand khỏi URL
        setSearchParams({}); 
    } else {
        // Đẩy brand ID lên URL => URL sẽ thành: .../usage-purpose/4?brand=2
        setSearchParams({ brand: clickedBrandId });
    }
    // Reset lại số lượng hiển thị
    setVisibleCount(ITEMS_PER_BATCH);
  };

  // 4. GỌI API (Tự động chạy khi ID nhu cầu HOẶC ID Brand trên URL thay đổi)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let response;

        // Kiểm tra xem trên URL có brand không
        if (brandIdFromUrl) {
            // GỌI API LỌC KẾT HỢP
            response = await apiClient.get(`/products/filter?purpose=${id}&brand=${brandIdFromUrl}`);
        } else {
            // GỌI API LẤY TẤT CẢ THEO NHU CẦU
            response = await apiClient.get(`/products/usage-purpose/${id}`);
        }

        setProducts(response.data);

        // Lấy tên Nhu cầu (Optional - để hiển thị tiêu đề đẹp)
        try {
             const cateRes = await apiClient.get(`/usage-purposes/${id}`);
             setPurposeName(cateRes.data.name);
        } catch {}

      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, brandIdFromUrl]); // Quan trọng: Chạy lại khi URL thay đổi

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("token"); 
    if (!token) { alert("Vui lòng đăng nhập!"); return; }
    try { await addToCart(productId, 1); fetchCartCount(); alert("Đã thêm vào giỏ hàng!"); } 
    catch (err) { console.error(err); }
  };

  const handleLoadMore = () => setVisibleCount(prev => prev + ITEMS_PER_BATCH);
  const handleCollapse = () => {
    setVisibleCount(ITEMS_PER_BATCH);
    document.querySelector('.usage-purpose-page').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="container usage-purpose-page">
      
      {/* Truyền ID brand đang active (lấy từ URL) xuống để component Brand tô màu đỏ */}
      <Brand 
        onBrandClick={handleBrandClick} 
        selectedBrandId={brandIdFromUrl ? Number(brandIdFromUrl) : null}
      />

      <div className="section-header">
        <h2 className="section-title">
            Laptop {purposeName || "Theo Nhu Cầu"} 
            {/* Hiển thị thêm tên hãng nếu đang lọc */}
            {brandIdFromUrl && products.length > 0 && (
                <> - {products[0].brand?.name || ""}</>
            )}
        </h2>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : products.length === 0 ? (
        <div className="no-products">
            Không tìm thấy sản phẩm nào. 
            {/* Nút bỏ lọc */}
            <button onClick={() => setSearchParams({})} style={{marginLeft: '10px', color: 'blue', cursor: 'pointer', border: 'none', background: 'none'}}>
                Xem tất cả
            </button>
        </div>
      ) : (
        <>
          <div className="product-grid">
            {products.slice(0, visibleCount).map((item) => (
              <div key={item.id} className="product-card">
                <div className="product-card__image">
                   <Link to={ROUTERS.USER.PRODUCTDETAIL.replace(":id", item.id)}>
                      <img src={`http://localhost:8080${item.imageUrl || item.image}`} alt={item.name} />
                   </Link>
                </div>
                <div className="product-card__content">
                  <div className="product-brand">{item.brand?.name}</div>
                  <h3 className="product-name">
                    <Link to={ROUTERS.USER.PRODUCTDETAIL.replace(":id", item.id)}>{item.name}</Link>
                  </h3>
                  <div className="product-price">{formatter(item.price)}</div>
                  <button className="btn-add-cart" onClick={() => handleAddToCart(item.id)}>
                      <AiOutlineShoppingCart style={{marginRight: '5px'}}/> Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="view-more-container">
            {visibleCount < products.length ? (
                <button className="btn-view-more" onClick={handleLoadMore}>
                    Xem thêm <AiOutlineDown />
                </button>
            ) : (
                products.length > ITEMS_PER_BATCH && (
                    <button className="btn-view-more collapse-mode" onClick={handleCollapse}>
                        Thu gọn <AiOutlineUp />
                    </button>
                )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default memo(UsagePurposeProductsPage);