import { memo, useState, useEffect } from "react"; // <-- Cần thêm useEffect
import "./style.scss";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    // Ảnh lớn, rõ nét
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80",
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80",
    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1200&q=80",
  ];
  
  // Hàm chuyển slide kế tiếp
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };
  
  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  // 👇 THÊM LOGIC TỰ ĐỘNG CHUYỂN SLIDE (AUTO-PLAY)
  useEffect(() => {
    const slideInterval = setInterval(() => {
      // Dùng hàm cập nhật trạng thái để chuyển slide tiếp theo
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3500); // Tự động chuyển sau mỗi 3.5 giây

    // Hàm Cleanup: Xóa Interval khi component bị hủy (Unmount)
    return () => clearInterval(slideInterval);
  }, [slides.length]); // [slides.length] giúp đảm bảo useEffect chạy lại nếu số slide thay đổi

  return (
    <div className="carousel-wrapper">
      <div className="carousel-container">
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="carousel-slide">
              <img src={slide} alt={`Slide ${index + 1}`} />
            </div>
          ))}
        </div>
        
        {/* Nút điều hướng trái/phải */}
        <button className="carousel-nav prev" onClick={prevSlide}>
          <ChevronLeft size={24} />
        </button>
        <button className="carousel-nav next" onClick={nextSlide}>
          <ChevronRight size={24} />
        </button>
        
        {/* Indicators (Dấu chấm điều hướng) */}
        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(Carousel);