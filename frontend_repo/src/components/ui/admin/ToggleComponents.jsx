import React, { useEffect, useState } from "react";

const ToggleComponents = ({
  onItemSelect,
  fetchItems,
  extractCode,
  extractLabel = (item, code) => code, // 기본적으로 코드를 레이블로 사용
  title = "항목 선택",
  labelText = "코드",
  placeholderText = "선택하세요",
  loadingText = "불러오는 중...",
  errorText = "데이터를 불러오는 데 실패했습니다.",
}) => {
  const [items, setItems] = useState([]);
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // onItemSelect가 함수인지 확인 (디버깅)
  useEffect(() => {
    if (typeof onItemSelect !== "function") {
      console.error("onItemSelect는 함수가 아닙니다. 확인해주세요.");
    }
  }, [onItemSelect]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchItems(); // API를 통해 데이터 가져오기
        setItems(data); // 전체 아이템 저장

        // 코드 목록 추출
        const extractedCodes = data.map((item) => ({
          code: extractCode(item),
          label: extractLabel(item, extractCode(item)),
        }));

        setCodes(extractedCodes);
      } catch (err) {
        setError(errorText);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchItems, extractCode, errorText]);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <div className="text-xl font-semibold">{loadingText}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="flex items-center space-x-4">
        {/* 라벨 */}
        <label htmlFor="itemCode" className="font-medium text-gray-700 w-1/4">
          {labelText}
        </label>

        {/* 아이템 코드 선택 드롭다운 */}
        <select
          id="itemCode"
          onChange={(e) => {
            const selectedCode = e.target.value;
            const selectedItem = selectedCode
              ? items.find((item) => extractCode(item) === selectedCode)
              : null;
            onItemSelect(selectedCode, selectedItem);
          }}
          className="w-3/4 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">{placeholderText}</option>
          {codes.map(({ code, label }, index) => (
            <option key={index} value={code}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ToggleComponents;
