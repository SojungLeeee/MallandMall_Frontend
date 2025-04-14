import React from "react";
import { FaFilter } from "react-icons/fa";

/**
 * 특성 선택기 컴포넌트
 * @param {Object} props
 * @param {string} props.selectedFeature - 선택된 특성
 * @param {Function} props.onFeatureSelect - 특성 선택 핸들러
 * @param {boolean} props.isPositive - 긍정적/부정적 특성 여부
 * @param {Function} props.onPositiveToggle - 긍정/부정 토글 핸들러
 * @param {Array} props.features - 사용 가능한 특성 목록
 * @returns {JSX.Element}
 */
const FeatureSelector = ({
  selectedFeature,
  onFeatureSelect,
  isPositive,
  onPositiveToggle,
  features = [
    "품질",
    "가격",
    "디자인",
    "사용감",
    "내구성",
    "편의성",
    "배송",
    "서비스",
    "성능",
    "가성비",
    "색상",
  ],
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <FaFilter className="mr-2 text-blue-600" />
          <h2 className="text-lg font-semibold">특성 필터</h2>
        </div>

        <div className="flex items-center space-x-2">
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              isPositive
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
            }`}
            onClick={() => onPositiveToggle(true)}
          >
            긍정적 ✓
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              !isPositive
                ? "bg-red-100 text-red-800 border border-red-300"
                : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
            }`}
            onClick={() => onPositiveToggle(false)}
          >
            부정적 ✗
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {features.map((feature, index) => (
          <button
            key={index}
            onClick={() => onFeatureSelect(feature)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedFeature === feature
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {feature}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FeatureSelector;
