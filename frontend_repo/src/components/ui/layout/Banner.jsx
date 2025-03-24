import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// Import required modules
import sadari from "../../../assets/images/banner/sadari.png";
import cheer from "../../../assets/images/banner/cheer.png";
import ice from "../../../assets/images/banner/ice.png";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

export default function Banner() {
  const slides = [
    { id: 1, Image: sadari },
    { id: 2, Image: cheer },
    { id: 3, Image: ice },
  ];

  return (
    <section className="w-[390px] h-[230px] relative">
      {/* CSS 스타일 추가 */}
      <style>
        {`
          /* 페이지네이션 점 스타일 */
          .swiper-pagination-bullet {
            background-color: rgba(255, 255, 255, 0.5); /* 비활성 상태의 점 색상 - 반투명 흰색 */
            opacity: 1;
          }
          .swiper-pagination-bullet-active {
            background-color: white; /* 활성 상태의 점 색상 - 흰색 */
            opacity: 1;
          }

          /* 네비게이션 화살표 스타일 */
          .swiper-button-next,
          .swiper-button-prev {
            color: white; /* 화살표 색상 - 흰색 */
            background-color: rgba(0, 0, 0, 0.3); /* 배경색 - 반투명 검정 */
            width: 30px; /* 너비 */
            height: 30px; /* 높이 */
            border-radius: 50%; /* 원형 모양 */
            display: flex;
            justify-content: center;
            align-items: center;
          }

          /* 화살표 크기 조정 */
          .swiper-button-next:after,
          .swiper-button-prev:after {
            font-size: 15px; /* 화살표 아이콘 크기 */
            font-weight: bold;
          }

          /* 마우스 오버 효과 */
          .swiper-button-next:hover,
          .swiper-button-prev:hover {
            background-color: rgba(0, 0, 0, 0.5); /* 호버 시 배경 약간 더 진하게 */
          }
        `}
      </style>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={true}
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="flex flex-col items-center justify-center h-full">
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
