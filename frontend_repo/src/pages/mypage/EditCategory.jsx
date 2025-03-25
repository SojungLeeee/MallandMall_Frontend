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

    // 새로 추가할 카테고리들만 기록
    const categoriesToAdd = [];
    // 이미 선택되어 있던 카테고리들 (현재 DB에 저장된 것) 가져오기
    const currentCategoriesResponse = await fetchLikeCategoriesByUserId(userId);
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

    try {
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
      navigate("/mypage"); // 홈 화면으로 이동
    } catch (error) {
      console.error("선호 카테고리 수정 중 오류 발생:", error);
      alert("선호 카테고리 수정에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-5">
      <h1 className="text-xl font-bold mb-6">선호 카테고리 수정</h1>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => (
          <CategoryButton
            key={category.value}
            category={category}
            isSelected={selectedCategories.includes(category.value)} // 선택된 카테고리 여부 확인
            toggleCategory={toggleCategory}
          />
        ))}
      </div>
      <div className="mt-6">
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
          수정하기
        </button>
      </div>
    </div>
  );
}

export default EditCategory;
