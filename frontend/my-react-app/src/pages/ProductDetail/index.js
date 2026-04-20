import { memo, useEffect } from 'react'; // Thêm useEffect
import { useParams } from 'react-router-dom';
import { useProductDetail } from '../../hooks/useProductDetail';

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
    images,           
    variants,         
    selectedVariant,  
    setSelectedVariant, 
    loading, 
    error 
  } = useProductDetail(id);

  // ✅ FIX: Tự động chọn biến thể đầu tiên nếu selectedVariant đang null
  // Điều này đảm bảo Carousel luôn có biến thể để lấy ảnh từ bảng variant_images
  useEffect(() => {
    if (!selectedVariant && variants && variants.length > 0) {
      setSelectedVariant(variants[0]);
    }
  }, [variants, selectedVariant, setSelectedVariant]);

  if (loading) return <LoadingSpinner text="Đang tải thông tin sản phẩm..." />;
  if (error || !product) return <div className="text-center py-20">Lỗi hoặc không tìm thấy sản phẩm</div>;

  const breadcrumbItems = [
    { label: 'Laptop', link: '/laptop' },
    { label: product.brand?.name || 'Thương hiệu', link: `/laptop?brand=${product.brand?.id}` },
    { label: product.name, link: null },
  ];

  // Tạo một biến an toàn để truyền vào Carousel
  const activeVariant = selectedVariant || (variants && variants.length > 0 ? variants[0] : null);

  return (
    <div className="main-container product-detail-page">
      <div className="container mx-auto px-4">
        <Breadcrumb items={breadcrumbItems} />

        <div className="product-layout-vertical" style={{ 
          maxWidth: '1000px', 
          margin: '20px auto', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}>
          
          <div className="carousel-top-wrapper" style={{ width: '100%', marginBottom: '40px' }}>
            {/* ✅ Truyền activeVariant để chắc chắn Carousel có dữ liệu images */}
            <Carousel 
              mainImage={product.imageUrl} 
              images={images} 
              selectedVariant={activeVariant} 
            />
          </div>

          <div className="info-bottom-wrapper" style={{ width: '100%' }}>
            <ProductDetail 
                product={product} 
                variants={variants}                   
                selectedVariant={activeVariant}     
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