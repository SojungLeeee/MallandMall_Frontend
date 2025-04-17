// src/components/CategoryButton.jsx
import React from "react";

function CategoryButton({ category, isSelected, toggleCategory }) {
  return (
    <button
      onClick={() => toggleCategory(category)}
      className={`relative overflow-hidden rounded-sm w-full border h-20 transition-all duration-300 group
        ${
          isSelected
            ? "bg-black text-white border-black shadow-md"
            : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
        }
        focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-30`}
    >
      {/* 배경 효과 */}
      {!isSelected && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform translate-x-[-100%] group-hover:translate-x-[100%]"></div>
      )}

      {/* 텍스트 */}
      <div className="relative z-10 flex flex-col items-center justify-center p-3">
        <span
          className={`text-center font-medium ${
            isSelected ? "text-base" : "text-base"
          }`}
        >
          {category.name}
        </span>

        {/* 선택된 아이콘 */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-white"></div>
        )}
      </div>
    </button>
  );
}

export default CategoryButton;
