import React, { useEffect, useState } from "react";
import {
  fetchFindAllProductCode,
  fetchAddProductCode,
} from "../../api/httpAdminService";
import AllProductCodes from "../../components/ui/admin/AllProductCodes";
import AddComponents from "../../components/ui/admin/AddComponent";

export default function AdminAllProducts() {
  const [error, setError] = useState(null); // 오류 상태
  const [productData, setProductData] = useState([]); // 상품 데이터를 위한 상태

  // 상품 데이터를 가져오는 함수
  const fetchProductData = async () => {
    try {
      const productCodeList = await fetchFindAllProductCode();
      console.log("받아온 상품 목록:", productCodeList);

      if (Array.isArray(productCodeList)) {
        setProductData(productCodeList); // 상품 데이터 상태 업데이트
      } else {
        throw new Error("상품 데이터가 배열이 아닙니다.");
      }
    } catch (error1) {
      console.log("Error.name:", error1.name);
      console.log("Error.message:", error1.message);
      setError({ mesg: error1.message }); // 오류 발생 시 상태 업데이트
    }
  };

  // 상품 추가 후 데이터 갱신
  const handleProductAdded = async (newProduct) => {
    try {
      await fetchAddProductCode(newProduct); // 상품 추가 API 호출
      await fetchProductData(); // 상품 목록을 새로 불러옵니다.
    } catch (error) {
      console.log("상품 추가 실패:", error);
      setError({ mesg: "상품 추가 실패" });
    }
  };

  useEffect(() => {
    fetchProductData(); // 컴포넌트가 마운트되었을 때 상품 데이터 가져오기
  }, []);

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
    return (
      <tr key={index}>
        <td className="px-3 py-2">{product.productCode}</td>
        <td className="px-3 py-2">{product.category}</td>
        <td className="px-3 py-2">{product.productName}</td>
        <td className="px-3 py-2">{product.price}</td>
        <td className="px-3 py-2">{product.image}</td>
      </tr>
    );
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-semibold mb-4">상품 코드 목록</h2>
      <hr className="mb-4" />

      {/* 상품 추가 컴포넌트 */}
      <AddComponents onProductAdded={handleProductAdded} />

      <br />
      <hr className="mb-4" />

      {/* 상품 목록 표시 */}
      {productData.length > 0 ? (
        <AllProductCodes
          data={productData} // 상품 데이터
          dataType="product" // 데이터 타입 예시
          renderRow={renderRow} // 행 렌더링 함수
          showDeleteCheckbox={false} // 삭제 체크박스 여부
          text1="상품코드" // 헤더 텍스트
          text2="카테고리"
          text3="상품명"
          text4="가격"
          text5="삭제"
        />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
