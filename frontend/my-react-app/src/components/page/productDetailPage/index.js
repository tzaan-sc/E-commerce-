import { memo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Carousel from 'components/user/carousel';
import ProductDetail from 'components/user/productdetail';
import FeaturedProducts from 'components/user/featuredProducts';
import Breadcrumb from 'components/common/Breadcrumb'; 
import { getVariantsByProductId } from 'services/variantApi';
import './style.scss';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // 👇 2. STATE CHO BIẾN THỂ (Đã bỏ comment)
  const [variants, setVariants] = useState([]); 
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);

        // A. Gọi API lấy thông tin gốc
        const response = await axios.get(`http://localhost:8080/api/products/${id}`);
        const data = response.data;
        setProduct(data);

        // B. Xử lý hình ảnh gốc (Giữ nguyên logic của bạn)
        let productImages = [];
        if (data.images && data.images.length > 0) {
          productImages = data.images.map(
            (img) => `http://localhost:8080/api/uploads/products/${img.urlImage}` // Lưu ý: check lại đường dẫn ảnh cho khớp backend
          );
        } else {
          productImages = ['https://via.placeholder.com/600x600?text=No+Image'];
        }
        setImages(productImages);

        // C. Gọi API lấy Biến thể (Logic Mới) 👇
        const variantsData = await getVariantsByProductId(id);
        setVariants(variantsData);

        // D. Tự động chọn biến thể đầu tiên (nếu có)
        if (variantsData && variantsData.length > 0) {
          setSelectedVariant(variantsData[0]);
          
          // (Tùy chọn) Nếu biến thể có ảnh riêng, thêm nó vào đầu Carousel
          if (variantsData[0].image) {
             // Logic thêm ảnh biến thể vào đầu mảng images nếu muốn
             // setImages([variantsData[0].image, ...productImages]);
          }
        }

      } catch (error) {
        console.error('Lỗi tải sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProductData();
  }, [id]);

  if (loading) return <div className="loading-container">Đang tải dữ liệu...</div>;
  if (!product) return <div className="error-container">Không tìm thấy sản phẩm</div>;

  // Breadcrumb
  const breadcrumbItems = [
    { label: 'Laptop', link: '/laptop' },
    {
      label: product.brand?.name || 'Thương hiệu',
      link: `/laptop?brand=${product.brand?.id}`,
    },
    { label: product.name, link: null },
  ];

  return (
    <div className="main-container product-detail-page">
      <div className="container">
        <Breadcrumb items={breadcrumbItems} />

        <div className="product-content-wrapper">
          {/* 1. Carousel Ảnh */}
          <div className="product-section-image" style={{ marginBottom: '30px' }}>
            <Carousel images={images} />
          </div>

          {/* 2. Thông tin chi tiết */}
          <div className="product-section-info">
            {/* 👇 TRUYỀN PROPS XUỐNG CHO COMPONENT CON */}
            <ProductDetail 
                product={product} 
                variants={variants}                   // Danh sách biến thể
                selectedVariant={selectedVariant}     // Biến thể đang chọn
                setSelectedVariant={setSelectedVariant} // Hàm để đổi biến thể
            />
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