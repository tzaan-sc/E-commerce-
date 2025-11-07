import { memo } from "react";
import "./style.scss"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
const Banner = () => {
  const slides1 = [
    "/acerbtccsss.webp",
    "/acerbtccsss.webp",
    "/delchungnew.webp",
  ];

  const slides2 = [
    "/delchungnew.webp",
    "/acerbtccsss.webp",
    "/delchungnew.webp",
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
            <img src={img} alt={`Slide ${index + 1}`} />
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
            <img src={img} alt={`Slide ${index + 1}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default memo(Banner);