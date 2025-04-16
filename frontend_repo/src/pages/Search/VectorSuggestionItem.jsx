import React from "react";
import { FaArrowUp, FaArrowDown, FaMinus } from "react-icons/fa";

/**
 * 벡터 검색 제안 아이템 컴포넌트
 * @param {Object} props
 * @param {Object} props.item - 벡터 검색 결과 아이템
 * @param {Function} props.onClick - 클릭 핸들러 함수
 * @returns {JSX.Element}
 */
const VectorSuggestionItem = ({ item, onClick }) => {
  // 랭크 변동 아이콘 렌더링 함수
  const renderRankChange = (change) => {
    if (change > 0) {
      return (
        <span className="flex items-center text-green-500">
          <FaArrowUp size={12} />
          <span className="text-xs ml-1">{Math.abs(change)}</span>
        </span>
      );
    } else if (change < 0) {
      return (
        <span className="flex items-center text-red-500">
          <FaArrowDown size={12} />
          <span className="text-xs ml-1">{Math.abs(change)}</span>
        </span>
      );
    } else {
      return (
        <span className="flex items-center text-gray-500">
          <FaMinus size={12} />
          <span className="text-xs ml-1">0</span>
        </span>
      );
    }
  };

  // 유사도 백분율 계산
  const similarityPercentage = item.similarity
    ? (parseFloat(item.similarity) * 100).toFixed(1)
    : "N/A";

  // 개선된 클릭 이벤트 핸들러
  const handleItemClick = (e) => {
    // 모든 이벤트 전파 즉시 중지
    e.stopImmediatePropagation();
    e.preventDefault();
    e.stopPropagation();

    // 다른 이벤트가 실행되지 않도록 약간의 지연 후 실행
    setTimeout(() => {
      onClick(item.product_code);
    }, 10);
  };

  return (
    <div
      className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
      onClick={handleItemClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="bg-blue-100 text-blue-800 font-semibold rounded-full w-6 h-6 flex items-center justify-center mr-3">
            {item.rank}
          </span>
          <span className="font-medium">
            {item.product_name || item.product_code}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">{similarityPercentage}%</span>
          {renderRankChange(item.rankChange)}
        </div>
      </div>
    </div>
  );
};

export default VectorSuggestionItem;
