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

const AllProductCode = ({ products, onRemoveConfirm, showDeleteCheckbox }) => {
  return (
    <div>
      <table className="min-w-full table-fixed border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-3 py-2 w-[100px]">상품코드</th>{" "}
            {/* 상품코드 너비 설정 */}
            <th className="px-3 py-2 w-[200px]">카테고리</th>{" "}
            {/* 카테고리 너비 설정 */}
            <th className="px-3 py-2 w-[500px]">상품명</th>{" "}
            {/* 상품명 너비 설정 */}
            <th className="px-3 py-2 w-[300px]">가격</th> {/* 가격 너비 설정 */}
            {showDeleteCheckbox && <th className="px-1 w-[10px]">삭제</th>}{" "}
            {/* 삭제 체크박스 열 추가 */}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.productCode}>
              <td className="px-3 py-2 w-[100px] text-sm">
                {product.productCode}
              </td>
              <td
                className={`px-3 py-2 w-[200px] text-sm ${getCategoryBackgroundColor(
                  product.category
                )}`}
              >
                {product.category}
              </td>{" "}
              {/* 카테고리 필드에 배경색 적용 */}
              <td className="px-3 py-2 w-[500px] text-sm">
                {product.productName}
              </td>
              <td className="px-1 py-2 w-[300px] text-sm">{product.price}원</td>
              {showDeleteCheckbox && (
                <td className="w-[10px] text-sm">
                  <button
                    onClick={() => onRemoveConfirm(product.productCode)}
                    className="text-black bg-transparent border-none hover:bg-transparent"
                  >
                    ❌
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllProductCode;
