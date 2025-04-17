// src/pages/SelectCategory.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchAddLikeCategory } from "../../api/httpCategoryService";
import CategoryButton from "../../components/ui/layout/CategoryButton";

function SelectCategory() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = new URLSearchParams(location.search).get("userId");

  useEffect(() => {
    if (userId) {
      console.log("Received userId:", userId);
    }
  }, [userId]);

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
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(category.value)
        ? prevCategories.filter((item) => item !== category.value)
        : [...prevCategories, category.value]
    );
  };

  // 제출하기 버튼 클릭 시 처리할 함수
  const handleSubmit = async () => {
    if (selectedCategories.length === 0) {
      alert("선호 카테고리를 하나 이상 선택해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      for (const categoryValue of selectedCategories) {
        const likeCategoryData = {
          userId,
          category: categoryValue,
        };

        const response = await fetchAddLikeCategory(likeCategoryData);

        if (response.status === 201) {
          console.log(`${categoryValue} 선호 카테고리 저장 성공`);
        } else {
          alert(`카테고리 ${categoryValue} 저장 실패`);
        }
      }

      alert("선호 카테고리가 성공적으로 저장되었습니다!");
      navigate("/");
    } catch (error) {
      console.error("선호 카테고리 저장 중 오류 발생:", error);
      alert("선호 카테고리 저장에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 py-0">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <div className="px-8 pt-8 pb-6 border-b border-gray-100">
          <div className="flex items-center justify-center mb-2">
            <div className="flex items-center">
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-black"></div>
              <div className="w-1 h-1 rounded-full bg-black ml-1"></div>
            </div>
            <h1 className="text-xl font-bold text-center mx-4">
              <span>
                {userId}님의 <br></br>선호 카테고리
              </span>
            </h1>
            <div className="flex items-center">
              <div className="w-1 h-1 rounded-full bg-black mr-1"></div>
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-black"></div>
            </div>
          </div>
          <p className="text-gray-600 text-sm text-center mt-3">
            관심 있는 카테고리를 선택해 주세요
          </p>
        </div>
        {/* 카테고리 버튼 섹션 */}
        <div className="p-8">
          <div className="grid grid-cols-2 gap-4 mb-8">
            {categories.map((category) => (
              <CategoryButton
                key={category.value}
                category={category}
                isSelected={selectedCategories.includes(category.value)}
                toggleCategory={toggleCategory}
              />
            ))}
          </div>

          {/* 선택된 카테고리 표시 섹션 */}
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 mb-8">
            <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
              <h2 className="font-medium text-black">선택된 카테고리</h2>
              <span className="text-xs text-gray-500">
                {selectedCategories.length}개 선택됨
              </span>
            </div>

            {selectedCategories.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {selectedCategories.map((categoryValue) => (
                  <span
                    key={categoryValue}
                    className="px-4 py-1.5 bg-black text-white text-sm rounded-full shadow-sm flex items-center justify-between"
                  >
                    <span className="truncate mr-1">
                      {
                        categories.find((cat) => cat.value === categoryValue)
                          .name
                      }
                    </span>
                    <button
                      onClick={() => toggleCategory({ value: categoryValue })}
                      className="ml-1 text-white hover:text-gray-300 focus:outline-none flex-shrink-0"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic p-2">
                선택된 카테고리가 없습니다
              </p>
            )}
          </div>

          {/* 제출 버튼 */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || selectedCategories.length === 0}
              className={`
                px-12 py-3.5 rounded-md text-lg font-medium transition-all duration-300 
                shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2
                ${
                  selectedCategories.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800 focus:ring-gray-800"
                }
              `}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  처리 중...
                </div>
              ) : (
                "선택 완료"
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 text-xs text-gray-400 flex items-center">
        <span className="mr-1">©</span> 2025 프리미엄 카테고리 선택 서비스
      </div>
    </div>
  );
}

export default SelectCategory;
