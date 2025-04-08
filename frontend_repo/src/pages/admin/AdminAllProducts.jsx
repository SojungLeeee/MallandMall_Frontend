import React, { useEffect, useState } from "react";
import { fetchFindAllProductCode } from "../../api/httpAdminService";
import ListComponents, {
  getCategoryBackgroundColor,
} from "../../components/ui/admin/ListComponents"; // Import getCategoryBackgroundColor

export default function AdminAllProducts() {
  const [error, setError] = useState(null); // 오류 상태
  const [productData, setProductData] = useState([]); // 상품 데이터를 위한 상태
  const [selectedCategory, setSelectedCategory] = useState(null); // 선택된 카테고리 (1개만)

  useEffect(() => {
    async function fetchProductData() {
      try {
        const productCodeList = await fetchFindAllProductCode();
        console.log("받아온 상품 목록:", productCodeList); // 받아온 데이터를 콘솔에 출력

        if (Array.isArray(productCodeList)) {
          setProductData(productCodeList); // 응답이 배열이면 그 자체를 상태에 저장
        } else {
          throw new Error("상품 데이터가 배열이 아닙니다.");
        }
      } catch (error1) {
        console.log("Error.name:", error1.name);
        console.log("Error.message:", error1.message);
        setError({ mesg: error1.message }); // 오류 발생 시 상태 업데이트
      }
    }

    fetchProductData();
  }, []);

  // 카테고리 필터링: 선택된 카테고리에 해당하는 상품만 필터링
  const filteredProducts = selectedCategory
    ? productData.filter((product) => product.category === selectedCategory)
    : productData; // 선택된 카테고리가 없으면 모든 상품 표시

  // 카테고리 토글 함수 (1개만 선택 가능)
  const handleCategoryToggle = (category) => {
    setSelectedCategory(
      (prevCategory) => (prevCategory === category ? null : category) // 선택된 카테고리와 동일하면 해제, 아니면 새로 선택
    );
  };

  // 오류가 있으면 화면에 오류 메시지 표시
  if (error) {
    return (
      <div>
        <div>{`Error: ${error.mesg}`}</div>
      </div>
    );
  }

  // 행 렌더링 함수 정의
  const renderRow = (product, index) => {
    // 카테고리별 배경색 설정
    const categoryBackgroundColor = getCategoryBackgroundColor(
      product.category
    );

    return (
      <tr key={index} className="border-b border-gray-300 text-xs">
        <td className="px-3 py-2">{product.productCode}</td>

        {/* Apply background color only to the category cell */}
        <td className={`px-3 py-2 ${categoryBackgroundColor}`}>
          {product.category}
        </td>

        <td className="px-3 py-2 text-left">{product.productName}</td>
        <td className="px-3 py-2">{product.price.toLocaleString()}</td>
      </tr>
    );
  };

  // 모든 카테고리 리스트 추출 (중복된 카테고리 제거)
  const allCategories = [
    ...new Set(productData.map((product) => product.category)),
  ];

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-semibold mb-4">상품 코드 목록</h2>

      <div className="mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryToggle(category)}
              className={`w-full py-2 border rounded-md ${
                selectedCategory === category
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <hr className="mb-4" />

      {filteredProducts.length > 0 ? (
        <ListComponents
          data={filteredProducts} // 상품 데이터 (필터된 데이터)
          dataType="product" // 데이터 타입 예시
          renderRow={renderRow} // 행 렌더링 함수
          showDeleteCheckbox={false} // 삭제 체크박스 여부
          text1="코드" // 헤더 텍스트
          text2="카테고리"
          text3="상품명"
          text4="가격"
        />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
