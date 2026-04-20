import { memo, useState, useEffect, useMemo, useCallback } from "react";
import "./style.scss";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = ({ images, mainImage, selectedVariant }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const BASE_URL = "http://localhost:8080";

  const getFullUrl = (imgData) => {
    if (!imgData) return null;
    let path = typeof imgData === 'object' ? (imgData.imageUrl || imgData.urlImage || imgData) : imgData;
    if (!path || typeof path !== 'string') return null;
    return path.startsWith("http") ? path : `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  // ✅ LOGIC ĐƯỢC CHỈNH SỬA: Chỉ hiện đúng ảnh của biến thể nếu có
  const slides = useMemo(() => {
    const list = new Set();
    
    // 1. ƯU TIÊN SỐ 1: Lấy ảnh từ mảng imageUrls của biến thể đang chọn
    const variantImgs = selectedVariant?.imageUrls || []; 
    if (Array.isArray(variantImgs) && variantImgs.length > 0) {
      variantImgs.forEach(path => {
        const url = getFullUrl(path);
        if (url) list.add(url);
      });
    }

    // 2. ƯU TIÊN SỐ 2: Nếu mảng trên trống, thử tìm trong mảng images của biến thể
    if (list.size === 0) {
      const altVariantImgs = selectedVariant?.images || [];
      if (Array.isArray(altVariantImgs) && altVariantImgs.length > 0) {
        altVariantImgs.forEach(img => {
          const url = getFullUrl(img);
          if (url) list.add(url);
        });
      }
    }

    // 3. DỰ PHÒNG CUỐI CÙNG: Chỉ khi biến thể hoàn toàn không có ảnh, mới hiện ảnh chính sản phẩm
    if (list.size === 0) {
      const mImg = getFullUrl(mainImage);
      if (mImg) list.add(mImg);
      
      // Và thêm các ảnh phụ sản phẩm nếu ảnh chính cũng không có
      if (list.size === 0 && Array.isArray(images)) {
        images.forEach(img => {
          const url = getFullUrl(img);
          if (url) list.add(url);
        });
      }
    }

    return Array.from(list);
  }, [mainImage, images, selectedVariant]); // Sẽ tính toán lại CHỈ khi đổi biến thể

  const nextSlide = useCallback(() => {
    if (slides.length > 1) setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    if (slides.length > 1) setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (slides.length > 1 && !isHovered) {
      const interval = setInterval(nextSlide, 3000);
      return () => clearInterval(interval);
    }
  }, [slides.length, isHovered, nextSlide]);

  useEffect(() => {
    setCurrentSlide(0);
  }, [selectedVariant?.id]);

  if (slides.length === 0) return null;

  return (
    <div 
      className="product-carousel-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="main-stage">
        {/* Track trượt ảnh */}
        <div className="carousel-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {slides.map((url, index) => (
            <div className="carousel-slide-item" key={`${url}-${index}`}>
              <img src={url} alt={`Slide ${index}`} onError={(e) => e.target.style.display = 'none'} />
            </div>
          ))}
        </div>
        
        {slides.length > 1 && (
          <>
            <button className="carousel-nav prev" onClick={prevSlide}><ChevronLeft size={24} /></button>
            <button className="carousel-nav next" onClick={nextSlide}><ChevronRight size={24} /></button>
          </>
        )}
      </div>

      {/* Thumbnail bên dưới */}
      {slides.length > 1 && (
        <div className="thumbnail-container">
          <div className="thumbnail-list">
            {slides.map((url, index) => (
              <div 
                key={`thumb-${index}`}
                className={`thumbnail-item ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              >
                <img src={url} alt="thumb" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Carousel);