// // import { memo, useState, useEffect } from "react"; // <-- Cần thêm useEffect
// // import "./style.scss";
// // import { ChevronLeft, ChevronRight } from 'lucide-react';

// // const Carousel = () => {
// //   const [currentSlide, setCurrentSlide] = useState(0);

// //   const slides = [
// //     // Ảnh lớn, rõ nét
// //     "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80",
// //     "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80",
// //     "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1200&q=80",
// //   ];
  
// //   // Hàm chuyển slide kế tiếp
// //   const nextSlide = () => {
// //     setCurrentSlide((prev) => (prev + 1) % slides.length);
// //   };

// //   const prevSlide = () => {
// //     setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
// //   };
  
// //   const goToSlide = (slideIndex) => {
// //     setCurrentSlide(slideIndex);
// //   };

// //   // 👇 THÊM LOGIC TỰ ĐỘNG CHUYỂN SLIDE (AUTO-PLAY)
// //   useEffect(() => {
// //     const slideInterval = setInterval(() => {
// //       // Dùng hàm cập nhật trạng thái để chuyển slide tiếp theo
// //       setCurrentSlide((prev) => (prev + 1) % slides.length);
// //     }, 3500); // Tự động chuyển sau mỗi 3.5 giây

// //     // Hàm Cleanup: Xóa Interval khi component bị hủy (Unmount)
// //     return () => clearInterval(slideInterval);
// //   }, [slides.length]); // [slides.length] giúp đảm bảo useEffect chạy lại nếu số slide thay đổi

// //   return (
// //     <div className="carousel-wrapper">
// //       <div className="carousel-container">
// //         <div
// //           className="carousel-track"
// //           style={{ transform: `translateX(-${currentSlide * 100}%)` }}
// //         >
// //           {slides.map((slide, index) => (
// //             <div key={index} className="carousel-slide">
// //               <img src={slide} alt={`Slide ${index + 1}`} />
// //             </div>
// //           ))}
// //         </div>
        
// //         {/* Nút điều hướng trái/phải */}
// //         <button className="carousel-nav prev" onClick={prevSlide}>
// //           <ChevronLeft size={24} />
// //         </button>
// //         <button className="carousel-nav next" onClick={nextSlide}>
// //           <ChevronRight size={24} />
// //         </button>
        
// //         {/* Indicators (Dấu chấm điều hướng) */}
// //         <div className="carousel-indicators">
// //           {slides.map((_, index) => (
// //             <button
// //               key={index}
// //               className={`indicator-dot ${index === currentSlide ? 'active' : ''}`}
// //               onClick={() => goToSlide(index)}
// //             />
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default memo(Carousel);
// import { memo, useState, useEffect } from "react";
// import "./style.scss";
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// const Carousel = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);

//   const slides = [
//     "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80", // Laptop 1
//     "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80", // Laptop 2
//     "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1200&q=80", // Laptop 3
//     "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1200&q=80", // Laptop 4 (Thêm để test layout 4 ô)
//   ];

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % slides.length);
//   };

//   const prevSlide = () => {
//     setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
//   };

//   const goToSlide = (slideIndex) => {
//     setCurrentSlide(slideIndex);
//   };

//   // Auto-play (Tùy chọn: thường trang sản phẩm ít khi auto-play, nếu không cần bạn có thể bỏ đoạn này)
//   useEffect(() => {
//     const slideInterval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % slides.length);
//     }, 5000); // Để 5s cho chậm hơn chút để khách xem hàng
//     return () => clearInterval(slideInterval);
//   }, [slides.length]);

//   return (
//     <div className="product-carousel-wrapper">
      
//       {/* --- PHẦN 1: ẢNH LỚN (MAIN STAGE) --- */}
//       <div className="main-stage">
//         <div
//           className="carousel-track"
//           style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//         >
//           {slides.map((slide, index) => (
//             <div key={index} className="carousel-slide">
//               <img src={slide} alt={`Product View ${index + 1}`} />
//             </div>
//           ))}
//         </div>

//         {/* Nút điều hướng trên ảnh lớn */}
//         <button className="carousel-nav prev" onClick={prevSlide}>
//           <ChevronLeft size={24} />
//         </button>
//         <button className="carousel-nav next" onClick={nextSlide}>
//           <ChevronRight size={24} />
//         </button>
//       </div>

//       {/* --- PHẦN 2: THUMBNAILS (HÀNG ẢNH NHỎ BÊN DƯỚI) --- */}
//       <div className="thumbnail-list">
//         {slides.map((slide, index) => (
//           <div
//             key={index}
//             className={`thumbnail-item ${index === currentSlide ? 'active' : ''}`}
//             onClick={() => goToSlide(index)}
//           >
//             <img src={slide} alt={`Thumbnail ${index + 1}`} />
//           </div>
//         ))}
//       </div>

//     </div>
//   );
// };

// export default memo(Carousel);
import { memo, useState, useEffect } from "react";
import "./style.scss";
import { ChevronLeft, ChevronRight } from 'lucide-react';

// 1. Nhận props 'images' từ cha truyền xuống
const Carousel = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // 2. Kiểm tra: Nếu có ảnh từ DB thì dùng, nếu không thì dùng ảnh placeholder mặc định
  const slides = (images && images.length > 0) 
    ? images 
    : ["https://via.placeholder.com/800x600?text=No+Image"];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  // Auto-play: Reset interval khi currentSlide hoặc slides thay đổi
  useEffect(() => {
    // Chỉ auto-play nếu có nhiều hơn 1 ảnh
    if (slides.length <= 1) return;

    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(slideInterval);
  }, [slides.length, currentSlide]);

  return (
    <div className="product-carousel-wrapper">
      
      {/* --- PHẦN 1: ẢNH LỚN --- */}
      <div className="main-stage">
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="carousel-slide">
              {/* slide ở đây là đường dẫn URL ảnh (String) */}
              <img src={slide} alt={`Product View ${index + 1}`} />
            </div>
          ))}
        </div>

        {/* Chỉ hiện nút điều hướng nếu có > 1 ảnh */}
        {slides.length > 1 && (
          <>
            <button className="carousel-nav prev" onClick={prevSlide}>
              <ChevronLeft size={24} />
            </button>
            <button className="carousel-nav next" onClick={nextSlide}>
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* --- PHẦN 2: THUMBNAILS --- */}
      {/* Chỉ hiện thumbnails nếu có > 1 ảnh */}
      {slides.length > 1 && (
        <div className="thumbnail-list">
            {slides.map((slide, index) => (
            <div
                key={index}
                className={`thumbnail-item ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
            >
                <img src={slide} alt={`Thumbnail ${index + 1}`} />
            </div>
            ))}
        </div>
      )}

    </div>
  );
};

export default memo(Carousel);