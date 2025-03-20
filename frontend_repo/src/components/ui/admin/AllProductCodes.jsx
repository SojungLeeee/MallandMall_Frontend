import React from "react";

// 카테고리별 배경색을 설정하기 위한 함수
const getCategoryBackgroundColor = (category) => {
  switch (category) {
    case "meat":
      return "bg-red-200"; // 고기
    case "fish":
      return "bg-blue-200"; // 생선
    case "dairy":
      return "bg-yellow-200"; // 유제품
    case "drink":
      return "bg-green-200"; // 음료
    case "vegetable":
      return "bg-green-100"; // 채소
    case "fruit":
      return "bg-pink-200"; // 과일
    case "snack":
      return "bg-purple-200"; // 간식
    case "sauce":
      return "bg-gray-200"; // 소스
    case "health":
      return "bg-teal-200"; // 건강
    default:
      return "bg-white"; // 기본값
  }
};

// 범용적인 테이블 본문 컴포넌트 (tbody)
export const GenericTableBody = ({
  data, // 어떤 종류의 배열이든 받을 수 있음 (products, branch, event 등)
  renderRow, // 각 데이터 항목을 행으로 렌더링하는 함수
}) => {
  return <tbody>{data.map((item, index) => renderRow(item, index))}</tbody>;
};

// 메인 테이블 컴포넌트
const AllProductCode = ({
  data,
  dataType,
  onRemoveConfirm,
  showDeleteCheckbox,
  text1,
  text2,
  text3,
  text4,
  text5,
  children, // 직접 tbody 컴포넌트를 넘겨줄 수도 있음
  renderRow, // 커스텀 행 렌더링 함수
}) => {
  return (
    <div className="overflow-x-auto shadow-lg rounded-lg">
      <table className="min-w-full table-fixed border-separate border-spacing-0">
        <thead className="bg-gray-100 text-gray-600">
          <tr className="border-b-2 border-gray-300">
            <th className="px-4 py-3 text-left font-medium text-sm">{text1}</th>
            <th className="px-4 py-3 text-left font-medium text-sm">{text2}</th>
            <th className="px-4 py-3 text-left font-medium text-sm">{text3}</th>
            <th className="px-4 py-3 text-left font-medium text-sm">{text4}</th>
            {showDeleteCheckbox && (
              <th className="px-4 py-3 text-left font-medium text-sm">
                {text5}
              </th>
            )}
          </tr>
        </thead>

        {children || <GenericTableBody data={data} renderRow={renderRow} />}
      </table>
    </div>
  );
};

export { getCategoryBackgroundColor };
export default AllProductCode;
