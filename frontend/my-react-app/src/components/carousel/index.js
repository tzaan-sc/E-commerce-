import { memo } from "react";
import "./style.scss"

const Carousel = () => {
  return (
    <div
      id="carouselExampleControls"
      className="custom-carousel carousel slide" // Thêm class custom-carousel
      data-bs-ride="carousel"
    >
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img 
            src="https://images.unsplash.com/photo-1579113800032-c38bd7635ba4?q=80&w=1974" 
            className="d-block carousel-img" // Bỏ w-50, dùng class mới
            alt="Fresh vegetables" 
          />
        </div>
        <div className="carousel-item">
          <img 
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974" 
            className="d-block carousel-img" 
            alt="Fresh fruits" 
          />
        </div>
        <div className="carousel-item">
          <img 
            src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070" 
            className="d-block carousel-img" 
            alt="Healthy salad" 
          />
        </div>
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleControls"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleControls"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default memo(Carousel);