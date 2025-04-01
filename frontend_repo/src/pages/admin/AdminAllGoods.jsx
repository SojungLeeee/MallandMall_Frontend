import React, { useEffect, useState } from "react";
import { fetchFindAllGoods } from "../../api/httpAdminService";
import ListComponents from "../../components/ui/admin/ListComponents"; // ListComponents 컴포넌트 임포트

export default function AdminAllProducts() {
  const [error, setError] = useState(null); // 오류 상태
  const [productData, setProductData] = useState([]); // 상품 데이터를 위한 상태

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    async function fetchProductData() {
      try {
        const productCodeList = await fetchFindAllGoods();
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
      <tr key={index} className="text-xs">
        <td className="px-3 py-2 w-10">{product.productCode}</td>
        <td className="px-3 py-2">{product.branchName}</td>
        <td
          className={`px-3 py-2 ${
            new Date(product.expirationDate) < new Date()
              ? "bg-red-500 text-white"
              : ""
          }`}
        >
          {formatDate(product.expirationDate)} {/* 날짜 형식 변환 */}
        </td>
      </tr>
    );
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-semibold mb-4">개별 상품 목록</h2>
      <hr className="mb-4" />
      {productData.length > 0 ? (
        <ListComponents
          data={productData} // 상품 데이터
          dataType="product" // 데이터 타입 예시
          renderRow={renderRow} // 행 렌더링 함수
          showDeleteCheckbox={false} // 삭제 체크박스 여부
          text1="상품코드" // 헤더 텍스트
          text2="지점명"
          text3="유통기한"
        />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
