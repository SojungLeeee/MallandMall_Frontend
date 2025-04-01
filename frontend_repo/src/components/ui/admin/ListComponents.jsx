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
  showText5, // text5에 대한 표시 여부
}) => {
  return (
    <tbody>
      {data.map((item, index) => renderRow(item, index, showText5))}
    </tbody>
  );
};

// 메인 테이블 컴포넌트
const ListComponents = ({
  data,
  dataType,
  onRemoveConfirm,
  showDeleteCheckbox,
  text1,
  text2,
  text3,
  text4,
  text5,
  text6,
  children, // 직접 tbody 컴포넌트를 넘겨줄 수도 있음
  renderRow, // 커스텀 행 렌더링 함수
}) => {
  // 각 textX가 존재하면 true, 아니면 false
  const showText1 = Boolean(text1);
  const showText2 = Boolean(text2);
  const showText3 = Boolean(text3);
  const showText4 = Boolean(text4);
  const showText5 = Boolean(text5);
  const showText6 = Boolean(text6);

  return (
    <div className="overflow-x-auto shadow-lg rounded-sm">
      <table className="min-w-full table-fixed border-separate border-spacing-0">
        <thead className="bg-black text-white">
          <tr className="border-b-2 border-gray-300 border-seperate">
            {showText1 && (
              <th className="px-2 py-2 text-center font-bold text-sm">
                {text1}
              </th>
            )}
            {showText2 && (
              <th className="px-2 py-2 text-center font-bold text-sm">
                {text2}
              </th>
            )}
            {showText3 && (
              <th className="px-2 py-2 text-center font-bold text-sm">
                {text3}
              </th>
            )}
            {showText4 && (
              <th className="px-2 py-2 text-center font-bold text-sm">
                {text4}
              </th>
            )}
            {showText5 && (
              <th className="px-2 py-2 text-center font-bold text-sm">
                {text5}
              </th>
            )}
            {showDeleteCheckbox && showText6 && (
              <th className="px-2 py-2 text-center font-bold text-sm">
                {text6}
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
export default ListComponents;
