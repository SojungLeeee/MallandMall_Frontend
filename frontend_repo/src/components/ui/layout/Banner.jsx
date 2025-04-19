import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
// Import required modules
import welcome from "../../../assets/images/banner/welcome.png";
import coupon from "../../../assets/images/banner/coupon.png";
import offsale from "../../../assets/images/banner/offsale.png";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

export default function Banner() {
  const slides = [
    { id: 1, Image: welcome },
    { id: 2, Image: offsale },
    { id: 3, Image: coupon },
  ];

  return (
    <section className="w-full h-[175px] relative overflow-hidden">
      {/* CSS 스타일 추가 */}
      <style>
        {`
          /* 페이지네이션 점 스타일 */
          .swiper-pagination-bullet {
            background-color: rgba(255, 255, 255, 0.5);
            opacity: 1;
            width: 8px;
            height: 8px;
            transition: all 0.3s ease;
          }
          .swiper-pagination-bullet-active {
            background-color: white;
            opacity: 1;
            width: 16px; /* 활성화된 페이지네이션은 더 길게 */
            border-radius: 4px; /* 약간 둥근 직사각형 형태로 */
          }

          /* 네비게이션 화살표 스타일 */
          .swiper-button-next,
          .swiper-button-prev {
            color: white;
            background-color: rgba(0, 0, 0, 0.3);
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 0.3s ease;
            transform: translateY(-50%);
            opacity: 0; /* 기본적으로 숨김 */
          }

          /* 화살표 크기 조정 */
          .swiper-button-next:after,
          .swiper-button-prev:after {
            font-size: 14px;
            font-weight: bold;
          }

          /* 마우스 오버 효과 */
          .swiper-button-next:hover,
          .swiper-button-prev:hover {
            background-color: rgba(0, 0, 0, 0.7);
            transform: translateY(-50%) scale(1.1); /* 호버시 약간 커지는 효과 */
          }
          
          /* 슬라이더에 마우스 올렸을 때만 화살표 표시 */
          .swiper-container:hover .swiper-button-next,
          .swiper-container:hover .swiper-button-prev {
            opacity: 1;
          }
          
          /* 슬라이드 전환 애니메이션 */
          .swiper-slide-active img {
            animation: zoomIn 5s ease forwards;
          }
          
          @keyframes zoomIn {
            0% {
              transform: scale(1);
            }
            100% {
              transform: scale(1.05);
            }
          }
          
          /* 페이드 효과 사용시 */
          .swiper-fade .swiper-slide {
            transition-property: opacity;
            transition-duration: 1000ms !important; /* 페이드 지속 시간 늘림 */
          }
        `}
      </style>

      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        navigation={true}
        pagination={{ clickable: true }}
        loop={true}
        effect="fade" /* 페이드 효과 적용 */
        autoplay={{
          delay: 5000 /* 슬라이드 지속 시간을 5초로 늘림 */,
          disableOnInteraction: false,
        }}
        speed={1000} /* 전환 속도를 1초로 설정 - 더 부드러운 전환 */
        className="w-full h-full swiper-container"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="flex flex-col items-center justify-center h-full overflow-hidden">
              <img
                src={slide.Image}
                alt={`슬라이드 ${slide.id}`}
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
