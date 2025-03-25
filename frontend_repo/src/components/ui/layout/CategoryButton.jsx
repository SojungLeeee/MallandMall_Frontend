// src/components/CategoryButton.jsx
import React from "react";

function CategoryButton({ category, isSelected, toggleCategory }) {
  return (
    <button
      onClick={() => toggleCategory(category)}
      className={`px-3 py-8 rounded-xl text-xl font-semibold transition-all duration-300
        ${
          isSelected
            ? "bg-yellow-400 text-black"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }
        focus:outline-none`}
    >
      {category.name}
    </button>
  );
}

export default CategoryButton;
