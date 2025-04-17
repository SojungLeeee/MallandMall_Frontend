import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  fetchAddLikeCategory,
  fetchLikeCategoriesByUserId,
  fetchDeleteCategories,
} from "../../api/httpCategoryService"; // API 함수 import
import CategoryButton from "../../components/ui/layout/CategoryButton"; // CategoryButton 컴포넌트 import

function EditCategory() {
  const [selectedCategories, setSelectedCategories] = useState([]); // 선택된 카테고리 상태
  const [isSubmitting, setIsSubmitting] = useState(false); // 제출 상태 추가
  const navigate = useNavigate(); // useNavigate 훅을 사용해 navigate 함수 가져오기
  const location = useLocation(); // useLocation 훅을 사용하여 현재 위치 정보 가져오기
  const userId = new URLSearchParams(location.search).get("userId"); // 쿼리 파라미터에서 userId 추출

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

  // API 호출하여 이미 선택된 카테고리들 불러오기
  useEffect(() => {
    if (userId) {
      const fetchCategories = async () => {
        try {
          const response = await fetchLikeCategoriesByUserId(userId);
          const categoriesFromAPI = response.data; // API 응답에서 카테고리 데이터 가져오기

          // 이미 선택된 카테고리들을 selectedCategories 상태에 설정
          const selectedCategoryValues = categoriesFromAPI.map(
            (category) => category.category
          );
          setSelectedCategories(selectedCategoryValues);
        } catch (error) {
          console.error("선호 카테고리 불러오기 실패:", error);
          alert(
            "선호 카테고리를 불러오는 데 실패했습니다. 다시 시도해 주세요."
          );
        }
      };
      fetchCategories();
    }
  }, [userId]); // userId가 변경될 때마다 실행

  // 제출하기 버튼 클릭 시 처리할 함수
  const handleSubmit = async () => {
    if (selectedCategories.length === 0) {
      alert("선호 카테고리를 하나 이상 선택해주세요.");
      return;
    }

    setIsSubmitting(true);

    // 새로 추가할 카테고리들만 기록
    const categoriesToAdd = [];
    // 이미 선택되어 있던 카테고리들 (현재 DB에 저장된 것) 가져오기
    try {
      const currentCategoriesResponse = await fetchLikeCategoriesByUserId(
        userId
      );
      const currentCategories = currentCategoriesResponse.data.map(
        (category) => category.category
      );

      // 새로 선택된 카테고리 중에서, DB에 없으면 추가 (새로 체크된 것)
      for (const categoryValue of selectedCategories) {
        if (!currentCategories.includes(categoryValue)) {
          categoriesToAdd.push(categoryValue); // DB에 없는 카테고리 추가
        }
      }

      // 삭제할 카테고리들 (선택 해제된 것)
      const categoriesToDelete = currentCategories.filter(
        (category) => !selectedCategories.includes(category)
      );

      // 카테고리 삭제
      for (const category of categoriesToDelete) {
        await fetchDeleteCategories(userId, category);
        console.log(`${category} 선호 카테고리 삭제 성공`);
      }

      // 카테고리 추가
      for (const category of categoriesToAdd) {
        const likeCategoryData = {
          userId,
          category: category,
        };

        const response = await fetchAddLikeCategory(likeCategoryData);
        if (response.status === 201) {
          console.log(`${category} 선호 카테고리 추가 성공`);
        } else {
          alert(`카테고리 ${category} 추가 실패`);
        }
      }

      alert("선호 카테고리 수정이 완료되었습니다!");
      navigate("/mypage"); // 마이페이지로 이동
    } catch (error) {
      console.error("선호 카테고리 수정 중 오류 발생:", error);
      alert("선호 카테고리 수정에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-50 px-6 ">
      <div className="w-full max-w-md bg-white shadow-xl rounded-sm overflow-hidden border border-gray-100">
        <div className="px-8 pt-8 pb-6 border-b border-gray-100">
          <div className="flex items-center justify-center mb-2">
            <div className="flex items-center">
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-black"></div>
              <div className="w-1 h-1 rounded-full bg-black ml-1"></div>
            </div>
            <h1 className="text-m font-bold text-center mx-4">
              <span>선호 카테고리 수정</span>
            </h1>
            <div className="flex items-center">
              <div className="w-1 h-1 rounded-full bg-black mr-1"></div>
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-black"></div>
            </div>
          </div>
          <p className="text-gray-500 text-sm text-center mt-3">
            관심 카테고리를 선택 및 해제해 주세요
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
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 mb-8">
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
                px-12 py-3.5 rounded-sm text-lg font-medium transition-all duration-300 
                shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2
                ${
                  selectedCategories.length === 0
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-900 focus:ring-gray-800"
                }
              `}
            >
              {isSubmitting ? "처리 중..." : "수정 완료"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 text-xs text-gray-400 flex items-center">
        <button
          onClick={() => navigate("/mypage")}
          className="text-gray-500 hover:text-black transition-colors duration-300 pb-3"
        >
          마이페이지로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default EditCategory;
