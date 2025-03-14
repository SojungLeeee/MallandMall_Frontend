import React from "react";
import fish from "../../assets/images/fish.png"; // 이미지를 import
import meat from "../../assets/images/ham.png"; // 이미지를 import
import milk from "../../assets/images/milk.png";
import drink from "../../assets/images/drink.png";
import vegetable from "../../assets/images/vegetable.png";
import fruit from "../../assets/images/fruit.png";
import snack from "../../assets/images/snack.png";
import sauce from "../../assets/images/sauce.png";
import pill from "../../assets/images/pill.png";

// Define the category data (category name and image source)
const categories = [
  { name: "육류", image: meat },
  { name: "해산물", image: fish },
  { name: "유제품", image: milk },
  { name: "음료", image: drink },
  { name: "채소", image: vegetable },
  { name: "과일", image: fruit },
  { name: "간식", image: snack },
  { name: "조미료/소스", image: sauce },
  { name: "건강식품", image: pill },
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
