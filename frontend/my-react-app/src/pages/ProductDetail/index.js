import { memo } from 'react';
import { useParams } from 'react-router-dom';
import { useProductDetail } from '../../hooks/useProductDetail';

// ✅ Phải import lại Carousel vì trong ProductDetail đã xóa
import Carousel from '../../components/widgets/carousel';
import ProductDetail from '../../components/widgets/productdetail';
import FeaturedProducts from '../../components/widgets/featuredProducts';
import Breadcrumb from '../../components/common/Breadcrumb'; 
import LoadingSpinner from '../../components/common/LoadingSpinner';

import './style.scss';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { 
    product, 
    images, // ✅ Lấy lại mảng images ở đây
    variants, 
    selectedVariant, 
    setSelectedVariant, 
    loading, 
    error 
  } = useProductDetail(id);

  if (loading) return <LoadingSpinner text="Đang tải thông tin sản phẩm..." />;
  if (error || !product) return <div className="text-center py-20">Lỗi hoặc không tìm thấy sản phẩm</div>;

  const breadcrumbItems = [
    { label: 'Laptop', link: '/laptop' },
    { label: product.brand?.name || 'Thương hiệu', link: `/laptop?brand=${product.brand?.id}` },
    { label: product.name, link: null },
  ];

  return (
    <div className="main-container product-detail-page">
      <div className="container mx-auto px-4">
        <Breadcrumb items={breadcrumbItems} />

        {/* ✅ BỐ CỤC MỚI: Dàn hàng dọc cho cân đối */}
        <div className="product-layout-vertical" style={{ 
          maxWidth: '1000px', 
          margin: '20px auto', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}>
          
          {/* 1. Ảnh chính diện hiện lên đầu tiên */}
          <div className="carousel-top-wrapper" style={{ width: '100%', marginBottom: '40px' }}>
            <Carousel 
              mainImage={product.imageUrl} 
              images={images} 
              selectedVariant={selectedVariant} 
            />
          </div>

          {/* 2. Thông tin thanh toán, cấu hình ở ngay bên dưới */}
          <div className="info-bottom-wrapper" style={{ width: '100%' }}>
            <ProductDetail 
                product={product} 
                variants={variants}                   
                selectedVariant={selectedVariant}     
                setSelectedVariant={setSelectedVariant} 
            />
          </div>
        </div>

        <div className="mt-12">
          <FeaturedProducts />
        </div>
      </div>
    </div>
  );
};

export default memo(ProductDetailPage);