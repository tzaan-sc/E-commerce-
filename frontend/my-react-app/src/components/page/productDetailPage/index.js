import { memo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Carousel from 'components/user/carousel';
import ProductDetail from 'components/user/productdetail';
import FeaturedProducts from 'components/user/featuredProducts';
import Breadcrumb from 'components/common/Breadcrumb'; // 👈 1. Import Breadcrumb
import './style.scss';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/products/${id}`
        );
        const data = response.data;

        // Xử lý hình ảnh (Giữ nguyên logic của bạn)
        let productImages = [];
        if (data.images && data.images.length > 0) {
          productImages = data.images.map(
            (img) => `http://localhost:8080${img.urlImage}`
          );
        } else {
          productImages = ['https://via.placeholder.com/600x600?text=No+Image'];
        }

        setProduct(data);
        setImages(productImages);
      } catch (error) {
        console.error('Lỗi tải sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading)
    return <div className="loading-container">Đang tải dữ liệu...</div>;
  if (!product)
    return <div className="error-container">Không tìm thấy sản phẩm</div>;

  // 👇 2. Tạo dữ liệu cho Breadcrumb (Logic mới)
  const breadcrumbItems = [
    { label: 'Laptop', link: '/laptop' },
    {
      label: product.brand?.name || 'Thương hiệu',
      link: `/laptop?brand=${product.brand?.id}`,
    },
    { label: product.name, link: null }, // Trang hiện tại
  ];

  return (
    <div className="main-container product-detail-page">
      <div className="container">
        {/* 👇 3. Hiển thị Breadcrumb ở đầu container */}
        <Breadcrumb items={breadcrumbItems} />

        <div className="product-content-wrapper">
          {/* 1. Carousel Ảnh */}
          <div
            className="product-section-image"
            style={{ marginBottom: '30px' }}
          >
            <Carousel images={images} />
          </div>

          {/* 2. Thông tin chi tiết */}
          <div className="product-section-info">
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
