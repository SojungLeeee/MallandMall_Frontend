// src/components/CategoryButton.jsx
import React from "react";
import { motion } from "framer-motion"; // 추가: 애니메이션을 위한 framer-motion

function CategoryButton({ category, isSelected, toggleCategory }) {
  return (
    <motion.button
      onClick={() => toggleCategory(category)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`relative overflow-hidden rounded-md w-full border h-20 transition-all duration-300
        ${
          isSelected
            ? "bg-black text-white border-black shadow-lg"
            : "bg-white text-gray-800 border-gray-200 hover:border-gray-400"
        }
        focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-20`}
    >
      {/* 배경 스타일 효과 */}
      {!isSelected && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      )}

      {/* 선택 시 배경 효과 */}
      {isSelected && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-white opacity-20"></div>
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-white opacity-30 rounded-full"></div>
          </div>
        </div>
      )}

      {/* 텍스트 */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <span className={`text-center font-medium text-base`}>
          {category.name}
        </span>
      </div>

      {/* 선택된 상태 표시 */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full bg-white shadow-sm"
        >
          <svg
            className="w-3 h-3 text-black"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </motion.div>
      )}

      {/* 선택되지 않은 상태의 미묘한 테두리 효과 */}
      {!isSelected && (
        <div className="absolute inset-0 border border-transparent opacity-0 hover:opacity-100 hover:border-gray-300 rounded-md transition-opacity duration-300"></div>
      )}
    </motion.button>
  );
}

export default CategoryButton;
