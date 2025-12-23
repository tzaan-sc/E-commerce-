import { memo, useState, useEffect } from "react";
import "./style.scss";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // State mới: Quản lý vị trí bắt đầu của thanh thumbnail
  const [thumbIndex, setThumbIndex] = useState(0);
  const THUMB_SIZE = 5; // Số lượng ảnh nhỏ hiển thị cùng lúc

  const slides = (images && images.length > 0) 
    ? images 
    : ["https://via.placeholder.com/800x600?text=No+Image"];

  // --- LOGIC ẢNH LỚN ---
  const nextSlide = () => {
    const newIndex = (currentSlide + 1) % slides.length;
    setCurrentSlide(newIndex);
  };

  const prevSlide = () => {
    const newIndex = (currentSlide - 1 + slides.length) % slides.length;
    setCurrentSlide(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  // Tự động cuộn thumbnail khi ảnh lớn thay đổi (để ảnh đang chọn luôn nằm trong vùng nhìn thấy)
  useEffect(() => {
    if (currentSlide < thumbIndex) {
        setThumbIndex(currentSlide);
    } else if (currentSlide >= thumbIndex + THUMB_SIZE) {
        setThumbIndex(currentSlide - THUMB_SIZE + 1);
    }
  }, [currentSlide]);

  // --- LOGIC NÚT BẤM THUMBNAIL ---
  const nextThumb = () => {
    if (thumbIndex + THUMB_SIZE < slides.length) {
        setThumbIndex(thumbIndex + 1);
    }
  };

  const prevThumb = () => {
    if (thumbIndex > 0) {
        setThumbIndex(thumbIndex - 1);
    }
  };

  // Auto-play
  useEffect(() => {
    if (slides.length <= 1) return;
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [slides.length]); 

  // Cắt danh sách thumbnail để hiển thị (chỉ lấy 5 cái bắt đầu từ thumbIndex)
  const visibleThumbnails = slides.slice(thumbIndex, thumbIndex + THUMB_SIZE);

  return (
    <div className="product-carousel-wrapper">
      
      {/* --- PHẦN 1: ẢNH LỚN --- */}
      <div className="main-stage">
        <div className="carousel-track">
            <div className="carousel-slide">
              <img src={slides[currentSlide]} alt={`Product View ${currentSlide + 1}`} />
            </div>
        </div>

        {slides.length > 1 && (
          <>
            <button className="carousel-nav prev" onClick={prevSlide}><ChevronLeft size={24} /></button>
            <button className="carousel-nav next" onClick={nextSlide}><ChevronRight size={24} /></button>
          </>
        )}
      </div>

      {/* --- PHẦN 2: THUMBNAILS CAROUSEL --- */}
      {slides.length > 1 && (
        <div className="thumbnail-container">
            {/* Nút Prev Thumbnail (Chỉ hiện khi có thể lùi) */}
            <button 
                className="thumb-nav-btn left" 
                onClick={prevThumb}
                disabled={thumbIndex === 0} 
            >
                <ChevronLeft size={18} />
            </button>

            <div className="thumbnail-list">
                {visibleThumbnails.map((slide, index) => {
                    // Tính index thực tế trong mảng gốc để so sánh active
                    const realIndex = thumbIndex + index;
                    return (
                        <div
                            key={realIndex}
                            className={`thumbnail-item ${realIndex === currentSlide ? 'active' : ''}`}
                            onClick={() => goToSlide(realIndex)}
                        >
                            <img src={slide} alt={`Thumb ${realIndex}`} />
                        </div>
                    );
                })}
            </div>

            {/* Nút Next Thumbnail (Chỉ hiện khi còn ảnh phía sau) */}
            <button 
                className="thumb-nav-btn right" 
                onClick={nextThumb}
                disabled={thumbIndex + THUMB_SIZE >= slides.length} 
            >
                <ChevronRight size={18} />
            </button>
        </div>
      )}

    </div>
  );
};

export default memo(Carousel);