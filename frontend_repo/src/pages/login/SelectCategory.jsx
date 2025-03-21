import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchAddLikeCategory } from "../../api/httpCategoryService"; // api 파일에서 함수 import

function SelectCategory() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const navigate = useNavigate(); // useNavigate 훅을 사용해 navigate 함수 가져오기
  const location = useLocation(); // useLocation 훅을 사용하여 현재 위치 정보 가져오기
  const userId = new URLSearchParams(location.search).get("userId"); // 쿼리 파라미터에서 userId 추출

  useEffect(() => {
    if (userId) {
      console.log("Received userId:", userId); // userId를 콘솔에 출력
    }
  }, [userId]); // userId가 변경될 때마다 실행

  // 카테고리 목록과 매핑
  const categories = [
    { name: "육류", value: "meat" },
    { name: "해산물", value: "fish" },
    { name: "유제품", value: "dairy" },
    { name: "음료", value: "drink" },
    { name: "채소", value: "vegetable" },
    { name: "과일", value: "fruit" },
    { name: "간식", value: "snack" },
    { name: "조미료/소스", value: "sauce" },
    { name: "건강식품", value: "health" },
    { name: "기타(밥/면)", value: "etc" },
  ];

  // 카테고리 선택/해제 처리 함수
  const toggleCategory = (category) => {
    setSelectedCategories(
      (prevCategories) =>
        prevCategories.includes(category.value)
          ? prevCategories.filter((item) => item !== category.value) // 선택 해제
          : [...prevCategories, category.value] // 선택
    );
  };

  // 제출하기 버튼 클릭 시 처리할 함수
  const handleSubmit = async () => {
    if (selectedCategories.length === 0) {
      alert("선호 카테고리를 하나 이상 선택해주세요.");
      return;
    }

    // 선택된 카테고리들 각각에 대해 API 호출을 반복
    try {
      for (const categoryValue of selectedCategories) {
        const likeCategoryData = {
          userId, // userId를 포함
          category: categoryValue, // category value (meat, fish, dairy 등)
        };

        // 서버에 데이터를 저장하는 함수 호출
        const response = await fetchAddLikeCategory(likeCategoryData);

        if (response.status === 201) {
          console.log(`${categoryValue} 선호 카테고리 저장 성공`);
        } else {
          alert(`카테고리 ${categoryValue} 저장 실패`);
        }
      }

      alert("선호 카테고리가 성공적으로 저장되었습니다!");
      navigate("/"); // 홈 화면으로 이동
    } catch (error) {
      console.error("선호 카테고리 저장 중 오류 발생:", error);
      alert("선호 카테고리 저장에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-5">
      <h1 className="text-xl font-bold mb-6">
        {userId}님의 선호 카테고리를 선택하세요!
      </h1>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => toggleCategory(category)}
            className={`px-3 py-8 rounded-xl text-xl font-semibold transition-all duration-300
              ${
                selectedCategories.includes(category.value)
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }
              focus:outline-none`}
          >
            {category.name}
          </button>
        ))}
      </div>
      <div className="mt-6">
        <h2 className="font-semibold">선택된 선호 카테고리:</h2>
        <ul className="list-disc pl-6">
          {selectedCategories.length > 0 ? (
            selectedCategories.map((categoryValue) => (
              <li key={categoryValue} className="text-lg">
                {categories.find((cat) => cat.value === categoryValue).name}
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
