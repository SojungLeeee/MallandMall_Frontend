import React, { useEffect, useState, useRef } from "react";
import {
  fetchFindAllProductCode,
  fetchDeleteProductCode,
} from "../../api/httpAdminService";
import AllProductCodes from "../../components/ui/admin/AllProductCodes"; // AllProductCodes 컴포넌트 임포트

export default function AdminAllProducts() {
  const [error, setError] = useState(null); // 오류 상태
  const [productData, setProductData] = useState([]); // 상품 데이터를 위한 상태
  const [delProductCode, setDelProductCode] = useState(null); // 삭제할 상품 코드
  const modal_dialog = useRef(null); // 모달 ref

  // 상품 데이터를 불러오는 함수
  useEffect(() => {
    async function fetchProductData() {
      try {
        const productCodeList = await fetchFindAllProductCode();
        console.log("받아온 상품 목록:", productCodeList); // 받아온 데이터를 콘솔에 출력

        if (Array.isArray(productCodeList)) {
          setProductData(productCodeList); // 상품 데이터를 상태에 저장
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

  // 상품 삭제 처리 함수
  const handleRemoveProduct = (productCode) => {
    setDelProductCode(productCode); // 삭제할 상품 코드 설정
    modal_dialog.current.showModal(); // 모달 표시
  };

  // 삭제 확인 후 서버와 연동하여 상품 삭제
  const handleDeleteConfirm = async () => {
    if (!delProductCode) return; // 삭제할 상품 코드가 없으면 아무것도 하지 않음

    try {
      await fetchDeleteProductCode(delProductCode); // 서버에서 상품 삭제
      console.log("상품 삭제 성공");

      // 로컬 상태에서 해당 상품 삭제
      setProductData((prevData) =>
        prevData.filter((product) => product.productCode !== delProductCode)
      );
      modal_dialog.current.close(); // 모달 닫기
    } catch (error) {
      console.error("상품 삭제 실패:", error);
      setError({ mesg: error.message });
    }
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
    return (
      <tr key={index}>
        <td className="px-3 py-2">{product.productCode}</td>
        <td className="px-3 py-2">{product.category}</td>
        <td className="px-3 py-2">{product.productName}</td>
        <td className="px-3 py-2">{product.price}</td>
        <td className="px-3 py-2">
          <button
            onClick={() => handleRemoveProduct(product.productCode)}
            className="bg-white"
          >
            ❌
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-semibold mb-4">상품 코드 목록</h2>
      <hr className="mb-4" />

      {/* 삭제 확인 모달 */}
      <dialog
        ref={modal_dialog}
        className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-3/5"
      >
        <h3 className="text-xl font-semibold mb-4">삭제 확인</h3>
        <p className="mb-4 text-gray-700">
          정말로{" "}
          <span className="text-red-600 font-bold">{delProductCode}</span>{" "}
          상품코드를 삭제하시겠습니까?
        </p>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleDeleteConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            삭제
          </button>
          <button
            type="button"
            onClick={() => modal_dialog.current.close()}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            취소
          </button>
        </div>
      </dialog>

      {/* 상품 목록 표시 */}
      {productData.length > 0 ? (
        <AllProductCodes
          data={productData} // 상품 데이터
          dataType="product" // 데이터 타입 예시
          renderRow={renderRow} // 행 렌더링 함수
          showDeleteCheckbox={true} // 삭제 체크박스 여부
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
