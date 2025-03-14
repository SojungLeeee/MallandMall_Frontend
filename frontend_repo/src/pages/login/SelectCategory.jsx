import { useState } from "react";
import { redirect, useNavigate } from "react-router-dom";

function SelectCategory() {
  // 선택된 카테고리를 저장하는 상태
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAge, setSelectedAge] = useState(""); // 나이 선택 상태 추가
  const navigate = useNavigate(); // useNavigate 훅을 사용해 navigate 함수 가져오기

  // 카테고리 목록
  const categories = [
    "육류",
    "해산물",
    "유제품",
    "음료",
    "채소",
    "과일",
    "간식",
    "조미료/소스",
    "건강식품",
  ];

  // 나이 목록
  const ages = ["10대", "20대", "30대", "40대", "50대", "60대"];

  // 카테고리 선택/해제 처리 함수
  const toggleCategory = (category) => {
    setSelectedCategories(
      (prevCategories) =>
        prevCategories.includes(category)
          ? prevCategories.filter((item) => item !== category) // 선택 해제
          : [...prevCategories, category] // 선택
    );
  };

  // 나이 선택 변경 함수
  const handleAgeChange = (e) => {
    setSelectedAge(e.target.value);
  };

  // 제출하기 버튼 클릭 시 처리할 함수
  const handleSubmit = () => {
    if (!selectedAge) {
      alert("나이를 선택해주세요.");
      return;
    }
    if (selectedCategories.length === 0) {
      alert("선호 카테고리를 하나 이상 선택해주세요.");
      return;
    }

    // 제출 처리 (예: 콘솔에 선택된 정보 출력)
    console.log("나이대:", selectedAge);
    console.log("선택된 카테고리:", selectedCategories);
    alert("제출되었습니다!");
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center p-5 h-[671px]">
      {/* 나이 선택 드롭다운 */}
      <div className="mb-6">
        <label htmlFor="age" className="text-lg font-semibold text-xl">
          사용자 나이 : <span></span>
        </label>
        <select
          id="age"
          value={selectedAge}
          onChange={handleAgeChange}
          className="px-4 py-2 mt-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg"
        >
          <option value="">나이대를 선택하세요</option>
          {ages.map((age) => (
            <option key={age} value={age}>
              {age}
            </option>
          ))}
        </select>
      </div>

      <h1 className="text-2xl font-bold mb-6">선호 카테고리 선택</h1>
      <div className="grid grid-cols-3 gap-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            className={`px-3 py-8 rounded-xl text-xl font-semibold transition-all duration-300
              ${
                selectedCategories.includes(category)
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }
              focus:outline-none`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="mt-6">
        <h2 className="font-semibold">선택된 선호 카테고리:</h2>
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

      {/* 제출하기 버튼 */}
      <div className="mt-6">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-yellow-500 text-white rounded-xl text-xl font-semibold transition-all duration-300 hover:bg-blue-400 focus:outline-none"
        >
          제출하기
        </button>
      </div>
    </div>
  );
}

export default SelectCategory;
