import React from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 훅을 임포트

// 순위별로 보여줄 식료품 목록을 나타내는 컴포넌트
const RankedSearchComponent = ({ foodItems }) => {
  const navigate = useNavigate(); // navigate 훅을 사용

  // 아이템을 왼쪽과 오른쪽 컬럼으로 나누기
  const leftItems = foodItems.slice(0, 5);
  const rightItems = foodItems.slice(5, 10);

  // 목록 항목 클릭 시 검색 페이지로 이동하는 함수
  const handleItemClick = (itemName) => {
    navigate(`/search/${itemName}`); // 해당 항목의 이름을 포함하여 검색 페이지로 이동
  };

  return (
    <div className="bg-white rounded-lg shadow-md px-6 py-3  max-w-6xl mx-auto text-sm">
      <h4 className="text-xl font-bold text-center text-emerald-600 my-4 border-b-2 border-emerald-300 pb-2">
        몰앤몰 추천 검색어
      </h4>

      <div className="grid grid-cols-2 gap-4">
        {/* 왼쪽 컬럼 */}
        <div className="space-y-3">
          <ol className="space-y-3">
            {leftItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center py-2 px-3 rounded-md transition-colors hover:bg-gray-50 border border-gray-100 cursor-pointer"
                onClick={() => handleItemClick(item.name)} // 클릭 시 해당 항목으로 이동
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-semibold mr-3">
                  {item.rank}
                </span>
                <span className="text-gray-700 font-medium">{item.name}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* 오른쪽 컬럼 */}
        <div className="space-y-3">
          <ol className="space-y-3">
            {rightItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center py-2 px-3 rounded-md transition-colors hover:bg-gray-50 border border-gray-100 cursor-pointer"
                onClick={() => handleItemClick(item.name)} // 클릭 시 해당 항목으로 이동
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-semibold mr-3">
                  {item.rank}
                </span>
                <span className="text-gray-700 font-medium">{item.name}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RankedSearchComponent;
