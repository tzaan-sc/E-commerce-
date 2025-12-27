import { memo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Carousel from "components/user/carousel";
import ProductDetail from "components/user/productdetail";
import FeaturedProducts from "components/user/featuredProducts";
import "./style.scss"; 

const ProductDetailPage = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/products/${id}`);
        const data = response.data;

        // 👇 ĐÃ SỬA: Không cần parse JSON nữa, giữ nguyên data gốc
        // Vì data.specifications bây giờ là chuỗi văn bản dài
        
        // Xử lý hình ảnh (Giữ nguyên logic của bạn)
        let productImages = [];
        if (data.images && data.images.length > 0) {
            productImages = data.images.map(img => `http://localhost:8080${img.urlImage}`);
        } else {
            productImages = ["https://via.placeholder.com/600x600?text=No+Image"];
        }

        setProduct(data); // Lưu trực tiếp data
        setImages(productImages);

      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) return <div className="loading-container">Đang tải dữ liệu...</div>;
  if (!product) return <div className="error-container">Không tìm thấy sản phẩm</div>;

  return (
    <div className="main-container product-detail-page">
       <div className="container">
          <div className="product-content-wrapper">
             {/* 1. Carousel Ảnh */}
             <div className="product-section-image" style={{ marginBottom: '30px' }}>
                <Carousel images={images} />
             </div>

             {/* 2. Thông tin chi tiết */}
             <div className="product-section-info">
                {/* 👇 Truyền toàn bộ product vào đây */}
                <ProductDetail product={product} />
             </div>
          </div>
          
          <div style={{ marginTop: '50px' }}>
            <FeaturedProducts />
          </div>
       </div>
    </div>
  );  
};

export default memo(ProductDetailPage);