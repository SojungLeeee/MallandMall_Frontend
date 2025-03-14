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

  const btnClick = (categoryName) => {
    let category = categoryName;

    // 카테고리 이름을 알맞은 값으로 변환
    if (category === "육류") {
      category = "meat";
    } else if (category === "해산물") {
      category = "fish";
    } else if (category === "유제품") {
      category = "dairy";
    } else if (category === "음료") {
      category = "drink";
    } else if (category === "채소") {
      category = "vegetable";
    } else if (category === "과일") {
      category = "fruit";
    } else if (category === "간식") {
      category = "snack";
    } else if (category === "조미료/소스") {
      category = "sauce";
    } else if (category === "건강식품") {
      category = "health";
    }

    console.log(category); // 선택된 카테고리 출력
    navigate(`/products/${category}`); // 카테고리 이름을 포함한 URL로 이동
  };

  return (
    <div className="p-6 m-2">
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => (
          <div
            key={category.name}
            className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            onClick={() => btnClick(category.name)} // div를 클릭했을 때 카테고리 이름을 전달
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-24 h-24 object-cover rounded-md mb-4 cursor-pointer" // 이미지 클릭 시 카테고리 이름 전달
            />
            <button
              className="bg-[#f2f1d3] font-semibold py-2 px-4 rounded-lg text-base"
              onClick={(e) => {
                e.stopPropagation(); // 버튼 클릭 시 div 클릭 이벤트가 발생하지 않도록 방지
                btnClick(category.name); // 버튼 클릭 시 카테고리 이름 전달
              }}
            >
              {category.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
