import React from "react";
import fish from "../../assets/images/fish.jpg"; // 이미지를 import

// Define the category data (category name and image source)
const categories = [
  { name: "육류", image: "/images/meat.jpg" },
  { name: "해산물", image: fish },
  { name: "유제품", image: "/images/dairy.jpg" },
  { name: "음료", image: "/images/drinks.jpg" },
  { name: "채소", image: "/images/vegetables.jpg" },
  { name: "과일", image: "/images/fruits.jpg" },
  { name: "간식", image: "/images/snacks.jpg" },
  { name: "조미료/소스", image: "/images/spices.jpg" },
  { name: "건강식품", image: "/images/health.jpg" },
];

export default function CategoryList() {
  return (
    <div className="p-6 m-2">
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => (
          <div
            key={category.name}
            className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-24 h-24 object-cover rounded-md mb-4"
            />
            <button className="bg-[#f2f1d3]  font-semibold py-2 px-4 rounded-lg text-base">
              {category.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
