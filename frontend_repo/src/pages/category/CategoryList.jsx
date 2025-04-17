import React, { useState } from "react";
import fish from "../../assets/images/fish.png";
import meat from "../../assets/images/meat.png";
import milk from "../../assets/images/milk.png";
import drink from "../../assets/images/drink.png";
import vegetable from "../../assets/images/vegetable.png";
import fruit from "../../assets/images/fruit.webp";
import snack from "../../assets/images/snack.png";
import sauce from "../../assets/images/sauce.png";
import pill from "../../assets/images/pill.png";
import etc from "../../assets/images/etc.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const categories = [
  { name: "육류", image: meat, value: "meat" },
  { name: "해산물", image: fish, value: "fish" },
  { name: "유제품", image: milk, value: "dairy" },
  { name: "음료", image: drink, value: "drink" },
  { name: "채소", image: vegetable, value: "vegetable" },
  { name: "과일", image: fruit, value: "fruit" },
  { name: "간식", image: snack, value: "snack" },
  { name: "조미료/소스", image: sauce, value: "sauce" },
  { name: "건강식품", image: pill, value: "health" },
  { name: "기타(밥/면)", image: etc, value: "etc" },
];

export default function CategoryList() {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [clickedCategory, setClickedCategory] = useState(null);

  const handleCategoryClick = (categoryValue) => {
    setClickedCategory(categoryValue);

    // 약간의 딜레이 후 페이지 이동 (애니메이션 효과를 위해)
    setTimeout(() => {
      console.log(categoryValue);
      navigate(`/products/${categoryValue}`);
    }, 300);
  };

  // 애니메이션 변수 설정
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <div className="p-6 m-2 bg-white overflow-hidden relative">
      {/* 배경 장식 요소 */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-black opacity-[0.02] rounded-full"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black opacity-[0.02] rounded-full"></div>

      {/* 헤더 */}
      <div className="mb-8 relative">
        <div className="flex justify-center items-center">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-black opacity-30"></div>
          <h2 className="text-2xl font-bold mx-4 text-black text-center tracking-wide">
            카테고리
          </h2>
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-black opacity-30"></div>
        </div>
        <p className="text-xs text-center text-gray-500 mt-2 tracking-wider uppercase">
          Premium Selection
        </p>
      </div>

      <motion.div
        className="grid grid-cols-2 gap-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {categories.map((category) => (
          <motion.div
            key={category.name}
            variants={itemVariants}
            onHoverStart={() => setHoveredCategory(category.name)}
            onHoverEnd={() => setHoveredCategory(null)}
            className={`relative overflow-hidden bg-white transition-all duration-500 group
              ${
                clickedCategory === category.value ? "scale-95 opacity-80" : ""
              }`}
            onClick={() => handleCategoryClick(category.value)}
            whileHover={{
              y: -5,
            }}
          >
            {/* 카드 테두리 애니메이션 */}
            <div className="absolute inset-0 p-[1px]">
              <div
                className={`absolute inset-0 bg-gradient-to-r 
                ${
                  hoveredCategory === category.name
                    ? "from-black to-gray-700"
                    : "from-gray-200 to-gray-300"
                }
                rounded-sm transition-all duration-500`}
              ></div>
            </div>

            <div className="relative m-[1px] bg-white p-5 rounded-sm flex flex-col items-center">
              <div className="relative mb-4 w-full flex justify-center">
                <div
                  className={`w-[130px] h-[110px] overflow-hidden flex items-center justify-center transition-all duration-500 ease-out
                    ${
                      hoveredCategory === category.name
                        ? "scale-110"
                        : "scale-100"
                    }`}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className={`w-full h-full object-contain p-2 transition-all duration-500 filter 
                      ${
                        hoveredCategory === category.name
                          ? "brightness-105"
                          : "brightness-100"
                      }`}
                  />
                </div>

                {/* 호버 효과 - 이미지 주변 광원 효과 */}
                {hoveredCategory === category.name && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.08 }}
                    className="absolute inset-0 rounded-full bg-black blur-xl"
                  />
                )}
              </div>

              {/* 카테고리 이름 */}
              <div className="w-full mb-3 text-center overflow-hidden">
                <motion.p
                  animate={{ y: hoveredCategory === category.name ? -2 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`font-medium text-sm tracking-wide transition-all duration-300
                    ${
                      hoveredCategory === category.name
                        ? "text-black"
                        : "text-gray-700"
                    }`}
                >
                  {category.name}
                </motion.p>
              </div>

              {/* 버튼 */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                className={`w-full py-2 px-3 font-medium rounded-sm shadow-sm transition-all duration-500 text-xs tracking-wider
                  ${
                    hoveredCategory === category.name
                      ? "bg-black text-white"
                      : "bg-white text-black border border-gray-200"
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCategoryClick(category.value);
                }}
              >
                <span className="relative inline-block">
                  <span className="relative z-10">제품 보러가기</span>
                  {hoveredCategory === category.name && (
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="absolute bottom-0 left-0 w-full h-[1px] bg-white origin-left"
                    ></motion.span>
                  )}
                </span>
              </motion.button>
            </div>

            {/* 호버 시 나타나는 아이콘 */}
            {hoveredCategory === category.name && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute top-4 right-4 w-6 h-6"
              >
                <svg
                  className="w-4 h-4 text-black opacity-70"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-10 text-center">
        <div className="h-px w-16 bg-gray-200 mx-auto mb-3"></div>
        <p className="text-xs tracking-wider text-gray-400 uppercase">
          Explore Premium Categories
        </p>
      </div>
    </div>
  );
}
