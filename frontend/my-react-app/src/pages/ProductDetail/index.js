import { memo } from 'react';
import { useParams } from 'react-router-dom';
import { useProductDetail } from '../../hooks/useProductDetail';

import Carousel from '../../components/widgets/carousel';
import ProductDetail from '../../components/widgets/productdetail';
import FeaturedProducts from '../../components/widgets/featuredProducts';
import Breadcrumb from '../../components/common/Breadcrumb'; 
import LoadingSpinner from '../../components/common/LoadingSpinner';

// (Tạm thời import style cũ, bạn có thể chuyển style sang folder này sau)
import './style.scss';

const ProductDetailPage = () => {
  const { id } = useParams();
  
  // Toàn bộ logic phức tạp đã được đưa vào hook
  const { 
    product, 
    images, 
    variants, 
    selectedVariant, 
    setSelectedVariant, 
    loading, 
    error 
  } = useProductDetail(id);

  if (loading) return <LoadingSpinner text="Đang tải thông tin sản phẩm..." />;
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-red-500">
        <h2 className="text-xl font-bold">Ôi lỗi rồi!</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-20 text-gray-500">Không tìm thấy sản phẩm</div>;
  }

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
      <div className="container mx-auto px-4">
        <Breadcrumb items={breadcrumbItems} />

        <div className="product-content-wrapper mt-5 flex flex-wrap lg:flex-nowrap gap-5">
          {/* 1. Carousel Ảnh */}
          <div className="product-section-image w-full lg:w-1/2 mb-8">
            <Carousel images={images} />
          </div>

          {/* 2. Thông tin chi tiết */}
          <div className="product-section-info w-full lg:w-1/2">
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
