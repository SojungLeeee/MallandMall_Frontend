import React, { useState } from "react";
import fish from "../../assets/images/fish.png"; // 이미지를 import
import meat from "../../assets/images/ham.png"; // 이미지를 import
import milk from "../../assets/images/milk.png";
import drink from "../../assets/images/drink.png";
import vegetable from "../../assets/images/vegetable.png";
import fruit from "../../assets/images/fruit.png";
import snack from "../../assets/images/snack.png";
import sauce from "../../assets/images/sauce.png";
import pill from "../../assets/images/pill.png";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수 얻기

  const btnClick = (e) => {
    let categoryName = e.target.innerText; // 클릭된 버튼의 텍스트를 가져옵니다.

    if (categoryName === "육류") {
      categoryName = "meat";
    } else if (categoryName === "해산물") {
      categoryName = "fish";
    } else if (categoryName === "유제품") {
      categoryName = "dairy";
    } else if (categoryName === "음료") {
      categoryName = "drink";
    } else if (categoryName === "채소") {
      categoryName = "vegetable";
    } else if (categoryName === "과일") {
      categoryName = "fruit";
    } else if (categoryName === "간식") {
      categoryName = "snack";
    } else if (categoryName === "조미료/소스") {
      categoryName = "sauce";
    } else if (categoryName === "건강식품") {
      categoryName = "health";
    }
    console.log(categoryName); // 선택된 카테고리 출력
    navigate(`/product/${categoryName}`); // 카테고리 이름을 포함한 URL로 이동
  };

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
            <button
              className="bg-[#f2f1d3]  font-semibold py-2 px-4 rounded-lg text-base"
              name="btn"
              onClick={btnClick}
            >
              {category.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
