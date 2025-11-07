import { memo, useState } from "react";
import "./style.scss";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80",
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80",
    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1200&q=80",
  ];
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };
  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };
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
        <button className="carousel-nav prev" onClick={prevSlide}>
          <ChevronLeft size={24} />
        </button>
        <button className="carousel-nav next" onClick={nextSlide}>
          <ChevronRight size={24} />
        </button>
        </div>
    </div>
  );
};

export default memo(Carousel);
