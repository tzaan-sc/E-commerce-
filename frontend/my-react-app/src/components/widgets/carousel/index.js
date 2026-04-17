import { memo, useState, useEffect, useMemo } from "react";
import "./style.scss";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = ({ images, mainImage, selectedVariant }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const BASE_URL = "http://localhost:8080";

  const getFullUrl = (url) => {
    if (!url) return "https://placehold.co/600x600?text=No+Image";
    return url.startsWith("http") ? url : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  // ✅ LOGIC ĐẦY ĐỦ: Ưu tiên ảnh biến thể -> Ảnh chính -> Ảnh phụ (Không trùng lặp)
  const slides = useMemo(() => {
    const list = new Set(); // Dùng Set để tự động loại bỏ các URL trùng nhau

    // 1. Lấy ảnh của biến thể đang chọn (Trường hợp có mảng images)
    if (selectedVariant?.images?.length > 0) {
      selectedVariant.images.forEach(img => {
        const path = typeof img === 'string' ? img : (img.imageUrl || img.urlImage);
        if (path) list.add(getFullUrl(path));
      });
    } 
    
    // 2. Lấy ảnh đơn của biến thể (Trường hợp chỉ có 1 trường imageUrl lẻ - Hay gặp trong DB của Hiển)
    const variantSinglePic = selectedVariant?.imageUrl || selectedVariant?.image || selectedVariant?.urlImage;
    if (variantSinglePic) {
      list.add(getFullUrl(variantSinglePic));
    }

    // 3. Thêm ảnh chính của sản phẩm gốc (Nếu chưa có)
    if (mainImage) {
      list.add(getFullUrl(mainImage));
    }
    
    // 4. Thêm các ảnh phụ khác từ thư viện ảnh sản phẩm
    if (images?.length > 0) {
      images.forEach(img => {
        const path = typeof img === 'string' ? img : (img.imageUrl || img.urlImage || img.imagePath);
        if (path) list.add(getFullUrl(path));
      });
    }

    const finalArray = Array.from(list);
    return finalArray.length > 0 ? finalArray : ["https://placehold.co/600x600?text=No+Image"];
  }, [mainImage, images, selectedVariant]); // 🚀 Chạy lại khi đổi biến thể

  // ✅ Khi đổi ID biến thể (chọn RAM/Màu mới), ép slide về tấm đầu tiên (Ảnh của biến thể đó)
  useEffect(() => {
    setCurrentSlide(0);
  }, [selectedVariant?.id]);

  if (!slides.length) return null;

  return (
    <div className="product-carousel-wrapper">
      {/* 🖼️ KHUNG ẢNH CHÍNH (STAGE) */}
      <div className="main-stage">
        <div className="carousel-slide">
          <img 
            // Cực kỳ quan trọng: key giúp React nhận biết ảnh đã thay đổi để thực hiện hiệu ứng transition
            key={slides[currentSlide]} 
            src={slides[currentSlide]} 
            alt="Product visual" 
          />
        </div>
        
        {slides.length > 1 && (
          <>
            <button 
              className="carousel-nav prev" 
              onClick={() => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)}
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              className="carousel-nav next" 
              onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)}
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* 🎞️ DANH SÁCH ẢNH PHỤ (THUMBNAILS) */}
      {slides.length > 1 && (
        <div className="thumbnail-container">
          <div className="thumbnail-list">
            {slides.map((url, index) => (
              <div 
                key={`${selectedVariant?.id}-${index}`}
                className={`thumbnail-item ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              >
                <img src={url} alt={`thumb-${index}`} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Carousel);