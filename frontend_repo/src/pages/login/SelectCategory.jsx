import { useState } from "react";

function SelectCategory() {
  // 선택된 카테고리를 저장하는 상태
  const [selectedCategories, setSelectedCategories] = useState([]);

  // 카테고리 목록
  const categories = [
    "육류",
    "해산물",
    "유제품",
    "음료",
    "채소",
    "과일",
    "간식",
    "조미료",
    "건강식품",
    "소스",
  ];

  // 카테고리 선택/해제 처리 함수
  const toggleCategory = (category) => {
    setSelectedCategories(
      (prevCategories) =>
        prevCategories.includes(category)
          ? prevCategories.filter((item) => item !== category) // 선택 해제
          : [...prevCategories, category] // 선택
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-6">선호 카테고리 선택</h1>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            className={`p-4 rounded-lg text-lg font-semibold transition-all duration-300
              ${
                selectedCategories.includes(category)
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-200"
              }
              focus:outline-none`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="mt-6">
        <h2 className="font-semibold">선택된 카테고리:</h2>
        <ul className="list-disc pl-6">
          {selectedCategories.length > 0 ? (
            selectedCategories.map((category) => (
              <li key={category} className="text-lg">
                {category}
              </li>
            ))
          ) : (
            <li className="text-lg text-gray-500">
              선택된 카테고리가 없습니다.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default SelectCategory;
