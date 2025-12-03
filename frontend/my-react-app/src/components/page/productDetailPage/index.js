import { memo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Carousel from "components/user/carousel";
import ProductDetail from "components/user/productdetail";
import FeaturedProducts from "components/user/featuredProducts";
import "./style.scss"; // (Nếu có style riêng cho trang này)

const ProductDetailPage = () => {
  const { id } = useParams(); // Lấy ID ở đây
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/products/${id}`);
        const data = response.data;

        // 1. Xử lý thông số kỹ thuật
        let parsedSpecs = [];
        try {
          if (data.specifications) {
            parsedSpecs = JSON.parse(data.specifications);
          }
        } catch (e) {
          parsedSpecs = [{ label: "Thông số", value: data.specifications }];
        }

        // 2. Xử lý hình ảnh
        let productImages = [];
        if (data.images && data.images.length > 0) {
            productImages = data.images.map(img => `http://localhost:8080${img.urlImage}`);
        } else {
            productImages = ["https://via.placeholder.com/600x600?text=No+Image"];
        }

        // Lưu vào state
        setProduct({ ...data, specs: parsedSpecs });
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
          <div className="row">
             {/* Cột trái: Carousel Ảnh */}
             <div className="col-lg-6 col-md-12">
                {/* Truyền mảng ảnh xuống Carousel */}
                <Carousel images={images} />
             </div>

             {/* Cột phải: Thông tin chi tiết */}
             <div className="col-lg-6 col-md-12">
                {/* Truyền object product xuống để hiển thị thông tin */}
                <ProductDetail product={product} />
             </div>

          </div>
          <FeaturedProducts />
       </div>
    </div>
  );  
};

export default memo(ProductDetailPage);