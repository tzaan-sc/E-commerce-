// import { memo } from "react";
// import "./style.scss"
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Autoplay } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// const Banner = () => {
//   const slides1 = [
//     "/acerbtccsss.webp",
//     "/acerbtccsss.webp",
//     "/delchungnew.webp",
//   ];

//   const slides2 = [
//     "/delchungnew.webp",
//     "/acerbtccsss.webp",
//     "/delchungnew.webp",
//   ];

//   return (
//     <div className="dual-carousel">
//       {/* Carousel 1 */}
//       <Swiper
//         modules={[Navigation, Autoplay]}
//         loop={true}
//         navigation
//         autoplay={{ delay: 3000 }}
//         className="carousel-box"
//       >
//         {slides1.map((img, index) => (
//           <SwiperSlide key={index}>
//             <img src={img} alt={`Slide ${index + 1}`} />
//           </SwiperSlide>
//         ))}
//       </Swiper>

//       {/* Carousel 2 */}
//       <Swiper
//         modules={[Navigation, Autoplay]}
//         loop={true}
//         navigation
//         autoplay={{ delay: 3000, reverseDirection: true }}
//         className="carousel-box"
//       >
//         {slides2.map((img, index) => (
//           <SwiperSlide key={index}>
//             <img src={img} alt={`Slide ${index + 1}`} />
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// };

// export default memo(Banner);
import { memo } from "react";
import "./style.scss"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const Banner = () => {
    
    // Helper function để fix lỗi đường dẫn tương đối
    const getImageUrl = (url) => {
        if (!url || url.startsWith('http')) {
            return url;
        }
        // Nối với địa chỉ Backend (Giả định Backend phục vụ ảnh từ gốc /)
        return `http://localhost:8080${url}`;
    };
    
    const slides1 = [
        "/uploads/products/bd5d49f8-d228-40d1-b4db-03ac2dbb9039.webp",
        "/uploads/products/af5aab81-6c2c-46e8-b9b7-22592d369a76.webp",
        "/uploads/products/99c847a7-edf3-41a1-b8bd-80bcc60df06d.webp",
    ];

    const slides2 = [
        "/uploads/products/d5006d85-1e12-44f2-8796-1f56fe9e8707.webp",
        "/uploads/products/53f7a787-1c77-4145-8f50-8c2defefff74.webp",
        "/uploads/products/2e2a1537-88f2-47a5-9cb6-0e45bab160b4.webp",
    ];

    return (
        <div className="dual-carousel">
            {/* Carousel 1 */}
            <Swiper
                modules={[Navigation, Autoplay]}
                loop={true}
                navigation
                autoplay={{ delay: 3000 }}
                className="carousel-box"
            >
                {slides1.map((img, index) => (
                    <SwiperSlide key={index}>
                        {/* 👇 FIX: Áp dụng getImageUrl */}
                        <img src={getImageUrl(img)} alt={`Slide ${index + 1}`} />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Carousel 2 */}
            <Swiper
                modules={[Navigation, Autoplay]}
                loop={true}
                navigation
                autoplay={{ delay: 3000, reverseDirection: true }}
                className="carousel-box"
            >
                {slides2.map((img, index) => (
                    <SwiperSlide key={index}>
                        {/* 👇 FIX: Áp dụng getImageUrl */}
                        <img src={getImageUrl(img)} alt={`Slide ${index + 1}`} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default memo(Banner);